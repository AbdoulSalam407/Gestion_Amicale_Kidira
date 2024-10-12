const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const csvFilePath = path.join(__dirname, '../data/activites.csv');
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'nom', title: 'Nom' },
        { id: 'description', title: 'Description' }
    ],
    append: false
});

function lireActivites(callback) {
    const activites = [];
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => activites.push(row))
        .on('end', () => callback(null, activites))
        .on('error', callback);
}

app.get('/activites', (req, res) => {
    lireActivites((err, activites) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des activités.' });
        }
        res.status(200).json(activites);
    });
});

// Route pour ajouter une nouvelle activité
app.post('/ajouter', async (req, res) => {
    try {
        const { nom, description } = req.body;

        // Vérification de la validité des données reçues
        if (!nom || !description) {
            return res.status(400).json({ message: 'Le nom et la description sont requis.' });
        }

        // Lecture des activités existantes
        const activites = await lireActivitesAsync(); // Supposons que lireActivites utilise une version async

        // Génération d'un nouvel ID basé sur l'existant
        const newId = activites.length ? parseInt(activites[activites.length - 1].id) + 1 : 1;
        
        // Création d'une nouvelle activité
        const newActivite = { id: newId.toString(), nom, description };

        // Ajout de la nouvelle activité à la liste
        activites.push(newActivite);

        // Écriture des activités mises à jour dans le fichier CSV
        await csvWriter.writeRecords(activites);

        // Journalisation de l'ajout réussi
        console.log(`Nouvelle activité ajoutée : ${JSON.stringify(newActivite)}`);

        // Réponse de succès
        return res.status(200).json({ message: 'Activité ajoutée avec succès.', activite: newActivite });
    
    } catch (error) {
        // Journalisation de l'erreur pour les suivis
        console.error('Erreur lors de l\'ajout de l\'activité :', error);

        // Réponse en cas d'erreur serveur
        return res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
    }
});



app.put('/modifier/:id', (req, res) => {
    const { id } = req.params;
    const { nom, description } = req.body;

    if (!nom || !description) {
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    lireActivites((err, activites) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des activités.' });
        }

        const activiteIndex = activites.findIndex(a => a.id === id);
        if (activiteIndex !== -1) {
            activites[activiteIndex] = { id, nom, description };
            csvWriter.writeRecords(activites)
                .then(() => res.status(200).json({ message: 'Activité modifiée avec succès.' }))
                .catch(err => res.status(500).json({ message: 'Erreur lors de la modification de l\'activité.' }));
        } else {
            res.status(404).json({ message: 'Activité non trouvée.' });
        }
    });
});

app.delete('/supprimer/:id', (req, res) => {
    const { id } = req.params;

    lireActivites((err, activites) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la lecture des activités.' });
        }

        const updatedActivites = activites.filter(a => a.id !== id);
        if (updatedActivites.length === activites.length) {
            return res.status(404).json({ message: 'Activité non trouvée.' });
        }

        csvWriter.writeRecords(updatedActivites)
            .then(() => res.status(200).json({ message: 'Activité supprimée avec succès.' }))
            .catch(err => res.status(500).json({ message: 'Erreur lors de la suppression de l\'activité.' }));
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
