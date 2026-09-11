const fs = require('fs');
const path = 'C:/Users/dwive/Desktop/Fasal-Pramaan-main/apps/latent-reasoning-lab/src/app/latents/page.tsx';
const content = fs.readFileSync(path, 'utf8');
for (let i = 0; i < content.length; i++) {
  if (content[i] === ';') {
    let ln = 1;
    for (let j = 0; j < i; j++) if (content[j] === '\n') ln++;
    if (ln > 270) console.log('Semi at', i, 'line', ln);
  }
}
console.log('Done');