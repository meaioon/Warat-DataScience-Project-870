import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-3xl font-bold/g, 'text-2xl md:text-3xl font-bold');

fs.writeFileSync(filePath, content);
console.log('Replaced text-3xl');
