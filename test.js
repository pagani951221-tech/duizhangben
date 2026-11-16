// 從 recon.html 取出核心邏輯和自我檢查，在 Node 裡執行。用法：node test.js
// 核心邏輯不碰畫面，所以不需要瀏覽器。GitHub 每次推送都會跑這個檔案。
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/recon.html', 'utf8');

function cut(from, to) {
  const a = html.indexOf(from), b = html.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('recon.html 裡找不到標記：' + from);
  return html.slice(a, b);
}
const core = cut('// ================= 核心邏輯', '// ================= 畫面');
const test = cut('// ================= 自我檢查', '\nload(); refresh();');

const fails = new Function(`'use strict';\n${core}\n${test}\nreturn selfTest();`)();
if (fails.length) {
  console.error('自我檢查失敗：\n- ' + fails.join('\n- '));
  process.exit(1);
}
console.log('自我檢查通過');
