package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func main() {
	port := flag.Int("port", 4180, "本地网页使用的端口")
	dir := flag.String("dir", "interactive", "要打开的网页文件目录")
	flag.Parse()

	absDir, err := filepath.Abs(*dir)
	if err != nil {
		log.Fatalf("无法读取网页目录：%v", err)
	}

	if _, err := os.Stat(absDir); os.IsNotExist(err) {
		log.Fatalf("网页目录不存在：%s", absDir)
	}

	fs := http.FileServer(http.Dir(absDir))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		
		// Set headers
		lrw.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		lrw.Header().Set("Access-Control-Allow-Origin", "*")

		// Support both / and /interactive paths
		if strings.HasPrefix(r.URL.Path, "/interactive/") {
			r.URL.Path = strings.TrimPrefix(r.URL.Path, "/interactive")
		} else if r.URL.Path == "/interactive" {
			http.Redirect(lrw, r, "/", http.StatusMovedPermanently)
			return
		}

		fs.ServeHTTP(lrw, r)
		log.Printf("[%s] %s %s -> %d in %v", r.RemoteAddr, r.Method, r.URL.Path, lrw.statusCode, time.Since(start))
	})

	addr := fmt.Sprintf("0.0.0.0:%d", *port)
	addr6 := fmt.Sprintf("[::]:%d", *port)

	log.Printf("网页服务启动中：http://localhost:%d（也可打开 http://127.0.0.1:%d）", *port, *port)
	log.Printf("网页文件来自：%s", absDir)

	// Try listening on IPv4 explicitly
	l4, err4 := net.Listen("tcp4", addr)
	if err4 != nil {
		log.Printf("IPv4地址暂时无法使用 %s：%v", addr, err4)
	} else {
		log.Printf("IPv4网页地址已就绪：%s", addr)
		go func() {
			if err := http.Serve(l4, handler); err != nil {
				log.Printf("IPv4网页服务出错：%v", err)
			}
		}()
	}

	// Also listen on IPv6
	l6, err6 := net.Listen("tcp6", addr6)
	if err6 != nil {
		log.Printf("IPv6地址暂时无法使用 %s：%v", addr6, err6)
	} else {
		log.Printf("IPv6网页地址已就绪：%s", addr6)
		if err := http.Serve(l6, handler); err != nil {
			log.Printf("IPv6网页服务出错：%v", err)
		}
	}

	// Keep alive if l4 is running and l6 failed
	select {}
}
