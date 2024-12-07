const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3004;

app.use(cors());
app.use(bodyParser.json());

const csvFilePath = path.join(__dirname, '../data/gallery.csv');
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'url', title: 'URL' },
        { id: 'description', title: 'Description' }
    ],
    append: false
});

function lirePhotos(callback) {
    const photos = [];
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => photos.push(row))
        .on('end', () => callback(null, photos))
        .on('error', callback);
}

app.get('/photos', (req, res) => {
    lirePhotos((err, photos) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des photos.' });
        }
        res.status(200).json(photos);
    });
});

app.post('/ajouter', (req, res) => {
    const { url, description } = req.body;

    if (!url || !description) {
        return res.status(400).json({ message: 'L\'URL et la description sont requis.' });
    }

    lirePhotos((err, photos) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des photos.' });
        }

        const newId = photos.length ? parseInt(photos[photos.length - 1].id) + 1 : 1;
        const newPhoto = { id: newId.toString(), url, description };
        photos.push(newPhoto);

        csvWriter.writeRecords(photos)
            .then(() => res.status(200).json({ message: 'Photo ajoutée avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de l\'ajout de la photo.' }));
    });
});

app.put('/modifier/:id', (req, res) => {
    const { id } = req.params;
    const { url, description } = req.body;

    if (!url || !description) {
        return res.status(400).json({ message: 'L\'URL et la description sont requis.' });
    }

    lirePhotos((err, photos) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des photos.' });
        }

        const index = photos.findIndex(photo => photo.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Photo non trouvée.' });
        }

        photos[index] = { id, url, description };

        csvWriter.writeRecords(photos)
            .then(() => res.status(200).json({ message: 'Photo modifiée avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de la modification de la photo.' }));
    });
});

app.delete('/supprimer/:id', (req, res) => {
    const { id } = req.params;

    lirePhotos((err, photos) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des photos.' });
        }

        const index = photos.findIndex(photo => photo.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Photo non trouvée.' });
        }

        photos.splice(index, 1);

        csvWriter.writeRecords(photos)
            .then(() => res.status(200).json({ message: 'Photo supprimée avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de la suppression de la photo.' }));
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://127.0.0.1:${PORT}`);
});
