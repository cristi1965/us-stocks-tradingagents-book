const { chromium } = require('playwright');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4180/?v=43-ledger', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(() => {
    const input = { fillSession:'regular', fillTif:'day', fillQty:'700', fillAvg:'49.957', fillOpen:'300', fillShortfall:'110' };
    const first = applyTeachingCommand(null, 10, input);
    const repeat = applyTeachingCommand(first.state, 10, input);
    const hostile = JSON.parse(JSON.stringify(first.state));
    hostile.marketBySymbol.SHAN.state = 'HALTED';
    const before = JSON.stringify(hostile);
    const rejected = applyTeachingCommand(hostile, 11, {});
    const malformed = JSON.parse(JSON.stringify(first.state));
    malformed.orders['shan-entry'].filledQty = 999;
    const migrated = migrateTeachingLedger({ schema:1 }, {11:{status:'passed',inputs:input}});
    return {
      first: first.ok && first.state.version === 1 && first.state.events.length === 4,
      idempotent: repeat.ok && repeat.idempotent && repeat.state.version === 1 && repeat.events.length === 0,
      atomicReject: !rejected.ok && JSON.stringify(rejected.state) === before,
      invariantDetectsCorruption: teachingLedgerInvariants(malformed).some(message => message.includes('fill totals')),
      migrated: migrated.changed && migrated.state.schema === 2 && migrated.state.orders['shan-entry']?.status === 'CANCELED_DAY_END',
      hashStable: ledgerHash({b:2,a:1}) === ledgerHash({a:1,b:2})
    };
  });
  await browser.close();
  console.log(JSON.stringify({ ...result, errors }, null, 2));
  if (errors.length || Object.values(result).some(value => value !== true)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
