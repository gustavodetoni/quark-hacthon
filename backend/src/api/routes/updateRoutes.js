const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const csvParser = require('csv-parser');

const router = express.Router();

router.get('/clientes', async (req, res) => {
    const pathFile = path.join(__dirname, '..', '/updates/CLIENTES.csv');

    try {
        const results = [];
        
        const fileStream = await fs.readFile(pathFile, { encoding: 'utf-8' });
        const lines = fileStream.split('\r').slice(1);

        for (const line of lines) {
            const [ advisor, code, name ] = line.split(';');

            results.push({
                advisor: advisor.replace('\n', ''),
                code,
                name
            });
        }

        res.json(results);
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
