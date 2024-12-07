const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());

const csvFilePath = path.join(__dirname, '../data/news.csv');
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'titre', title: 'Titre' },
        { id: 'date', title: 'Date' },
        { id: 'contenu', title: 'Contenu' }
    ],
    append: false
});

function lireNews(callback) {
    const news = [];
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => news.push(row))
        .on('end', () => callback(null, news))
        .on('error', callback);
}

app.get('/news', (req, res) => {
    lireNews((err, news) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des actualités.' });
        }
        res.status(200).json(news);
    });
});

app.post('/ajouter', (req, res) => {
    const { titre, date, contenu } = req.body;

    if (!titre || !date || !contenu) {
        return res.status(400).json({ message: 'Le titre, la date et le contenu sont requis.' });
    }

    lireNews((err, news) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des actualités.' });
        }

        const newId = news.length ? parseInt(news[news.length - 1].id) + 1 : 1;
        const newNews = { id: newId, titre, date, contenu };
        news.push(newNews);

        csvWriter
            .writeRecords(news)
            .then(() => res.status(201).json({ message: 'Actualité ajoutée avec succès.' }))
            .catch(() => res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier CSV.' }));
    });
});

app.put('/modifier/:id', (req, res) => {
    const id = req.params.id;
    const { titre, date, contenu } = req.body;

    lireNews((err, news) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des actualités.' });
        }

        const newsIndex = news.findIndex(n => n.id === id);
        if (newsIndex === -1) {
            return res.status(404).json({ message: 'Actualité non trouvée.' });
        }

        news[newsIndex] = { id, titre, date, contenu };

        csvWriter
            .writeRecords(news)
            .then(() => res.status(200).json({ message: 'Actualité modifiée avec succès.' }))
            .catch(() => res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier CSV.' }));
    });
});

app.delete('/supprimer/:id', (req, res) => {
    const id = req.params.id;

    lireNews((err, news) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des actualités.' });
        }

        const newsIndex = news.findIndex(n => n.id === id);
        if (newsIndex === -1) {
            return res.status(404).json({ message: 'Actualité non trouvée.' });
        }

        news.splice(newsIndex, 1);

        csvWriter
            .writeRecords(news)
            .then(() => res.status(200).json({ message: 'Actualité supprimée avec succès.' }))
            .catch(() => res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier CSV.' }));
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
