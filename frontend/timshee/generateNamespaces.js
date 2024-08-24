const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'public', 'locales');
const languages = fs.readdirSync(localesPath);
const namespaces = new Set();

languages.forEach(language => {
    const localePath = path.join(localesPath, language);
    const files = fs.readdirSync(localePath);
    files.forEach(file => {
        const ns = path.basename(file, '.json');
        namespaces.add(ns);
    })
});

const nsArray = Array.from(namespaces);
fs.writeFileSync(path.join(__dirname, 'src', 'namespaces.json'), JSON.stringify(nsArray, null, 2));