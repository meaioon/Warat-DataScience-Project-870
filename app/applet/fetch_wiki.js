import fs from 'fs';
import https from 'https';

https.get('https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('/app/applet/wiki.html', data);
    console.log('Saved to /app/applet/wiki.html');
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
