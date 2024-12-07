const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3005;

app.use(cors());
app.use(bodyParser.json());

const membresCsvFilePath = path.join(__dirname, '../data/members.csv');
const membresCsvWriter = createCsvWriter({
    path: membresCsvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'nom', title: 'Nom' },
        { id: 'prenom', title: 'Prénom' },
        { id: 'email', title: 'Email' }
    ]
});

// Récupérer les membres
app.get('/membres', (req, res) => {
    let membres = [];
    fs.createReadStream(membresCsvFilePath)
        .pipe(csvParser())
        .on('data', row => membres.push(row))
        .on('end', () => res.json(membres));
});

// Ajouter un membre
app.post('/ajouterMembre', (req, res) => {
    const nouveauMembre = { id: Date.now().toString(), ...req.body };
    membres.push(nouveauMembre);
    membresCsvWriter.writeRecords(membres)
        .then(() => res.status(201).json(nouveauMembre))
        .catch(error => res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier CSV' }));
});

// Modifier un membre
app.put('/modifierMembre/:id', (req, res) => {
    const id = req.params.id;
    const index = membres.findIndex(m => m.id === id);
    if (index !== -1) {
        membres[index] = { id, ...req.body };
        membresCsvWriter.writeRecords(membres)
            .then(() => res.json(membres[index]))
            .catch(error => res.status(500).json({ error: 'Erreur lors de la modification du fichier CSV' }));
    } else {
        res.status(404).json({ error: 'Membre non trouvé' });
    }
});

// Supprimer un membre
app.delete('/supprimerMembre/:id', (req, res) => {
    const id = req.params.id;
    membres = membres.filter(m => m.id !== id);
    membresCsvWriter.writeRecords(membres)
        .then(() => res.json({ success: true }))
        .catch(error => res.status(500).json({ error: 'Erreur lors de la suppression dans le fichier CSV' }));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
