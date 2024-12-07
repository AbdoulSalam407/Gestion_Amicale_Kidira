const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

const membresCsvPath = path.join(__dirname, '../data/membres.csv');

// Lecture des membres depuis le fichier CSV
function lireMembres(callback) {
    const membres = [];
    fs.createReadStream(membresCsvPath)
        .pipe(csvParser())
        .on('data', (row) => membres.push(row))
        .on('end', () => callback(null, membres))
        .on('error', callback);
}

// Route pour obtenir les membres
app.get('/membres', (req, res) => {
    lireMembres((err, membres) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des membres.' });
        }
        res.status(200).json(membres);
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
