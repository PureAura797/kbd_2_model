const fs = require('fs');
const pdf = require('pdf-parse');

(async () => {
    const files = fs.readdirSync('.').filter(n => n.endsWith('.pdf'));
    for (let f of files) {
        let dataBuffer = fs.readFileSync(f);
        const data = await pdf(dataBuffer);
        fs.writeFileSync(f + '.txt', data.text);
        console.log(`Parsed ${f} -> ${f}.txt (${data.text.length} chars)`);
    }
})();
