const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const eventsCsvFilePath = path.join(__dirname, '../data/events.csv');
const eventsCsvWriter = createCsvWriter({
    path: eventsCsvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'nom', title: 'Nom' },
        { id: 'date', title: 'Date' },
        { id: 'description', title: 'Description' }
    ],
    append: false
});

function lireEvents(callback) {
    const events = [];
    fs.createReadStream(eventsCsvFilePath)
        .pipe(csvParser())
        .on('data', (row) => events.push(row))
        .on('end', () => callback(null, events))
        .on('error', callback);
}

app.get('/events', (req, res) => {
    lireEvents((err, events) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des événements.' });
        }
        res.status(200).json(events);
    });
});

app.post('/ajouterEvent', (req, res) => {
    const { nom, date, description } = req.body;

    if (!nom || !date || !description) {
        return res.status(400).json({ message: 'Le nom, la date et la description sont requis.' });
    }

    lireEvents((err, events) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des événements.' });
        }

        const newId = events.length ? parseInt(events[events.length - 1].id) + 1 : 1;
        const newEvent = { id: newId.toString(), nom, date, description };
        events.push(newEvent);

        eventsCsvWriter.writeRecords(events)
            .then(() => res.status(200).json({ message: 'Événement ajouté avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'événement.' }));
    });
});

app.put('/modifierEvent/:id', (req, res) => {
    const { id } = req.params;
    const { nom, date, description } = req.body;

    if (!nom || !date || !description) {
        return res.status(400).json({ message: 'Le nom, la date et la description sont requis.' });
    }

    lireEvents((err, events) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des événements.' });
        }

        const eventIndex = events.findIndex(e => e.id === id);
        if (eventIndex !== -1) {
            events[eventIndex] = { id, nom, date, description };
            eventsCsvWriter.writeRecords(events)
                .then(() => res.status(200).json({ message: 'Événement modifié avec succès.' }))
                .catch(err => res.status(500).json({ message: 'Erreur lors de la modification de l\'événement.' }));
        } else {
            res.status(404).json({ message: 'Événement non trouvé.' });
        }
    });
});

app.delete('/supprimerEvent/:id', (req, res) => {
    const { id } = req.params;

    lireEvents((err, events) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des événements.' });
        }

        const updatedEvents = events.filter(e => e.id !== id);
        if (updatedEvents.length === events.length) {
            return res.status(404).json({ message: 'Événement non trouvé.' });
        }

        eventsCsvWriter.writeRecords(updatedEvents)
            .then(() => res.status(200).json({ message: 'Événement supprimé avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement.' }));
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
