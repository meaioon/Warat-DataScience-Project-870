import fs from 'fs';

const airports = JSON.parse(fs.readFileSync('airports_for_app.json', 'utf8'));
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const airportsString = `const AIRPORTS = ${JSON.stringify(airports, null, 2)};`;

// Find the start and end of the AIRPORTS array in App.tsx
const startMarker = 'const AIRPORTS = [';
const endMarker = '];';

const startIndex = appTsx.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find AIRPORTS start marker');
    process.exit(1);
}

// Find the matching closing bracket for the array
let openBrackets = 0;
let endIndex = -1;
for (let i = startIndex + 'const AIRPORTS = '.length; i < appTsx.length; i++) {
    if (appTsx[i] === '[') openBrackets++;
    if (appTsx[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            endIndex = i + 1;
            break;
        }
    }
}

if (endIndex === -1) {
    console.error('Could not find AIRPORTS end marker');
    process.exit(1);
}

const newAppTsx = appTsx.substring(0, startIndex) + airportsString + appTsx.substring(endIndex);
fs.writeFileSync('src/App.tsx', newAppTsx);
console.log('Successfully updated AIRPORTS in src/App.tsx');
