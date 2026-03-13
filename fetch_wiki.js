import fs from 'fs';

async function run() {
  const res = await fetch('https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2', {
    headers: {
      'User-Agent': 'MyBot/1.0 (warat34609@gmail.com) Node.js/22'
    }
  });
  const text = await res.text();
  fs.writeFileSync('wiki.html', text);
  console.log('Saved to wiki.html, length:', text.length);
}

run();
