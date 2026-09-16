['manga-us-chapters','manga-us-v2-done','manga-us-v3-events'].forEach(key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(value))throw new Error('not a list')}catch{localStorage.removeItem(key)}});
const savedActive=+(localStorage.getItem('manga-us-v2-active')||0);
if(!Number.isFinite(savedActive)||savedActive<0||savedActive>27)localStorage.setItem('manga-us-v2-active','0');
