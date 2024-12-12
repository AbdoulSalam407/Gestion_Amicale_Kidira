const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Remplacez par votre nom d'utilisateur MySQL
    password: '', // Remplacez par votre mot de passe MySQL
    database: 'aerkz'
});

// Connexion à la base de données
db.connect(err => {
    if (err) throw err;
    console.log('Connecté à la base de données.');
});

// Récupérer toutes les activités
app.get('/activities', (req, res) => {
    const sql = 'SELECT * FROM activities';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter une activité
app.post('/activities', (req, res) => {
    const { nom, description } = req.body;
    const sql = 'INSERT INTO activities (nom, description) VALUES (?, ?)';
    db.query(sql, [nom, description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, nom, description });
    });
});

// Modifier une activité
app.put('/activities/:id', (req, res) => {
    const { id } = req.params;
    const { nom, description } = req.body;
    const sql = 'UPDATE activities SET nom = ?, description = ? WHERE id = ?';
    db.query(sql, [nom, description, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Activité mise à jour.' });
    });
});

// Supprimer une activité
app.delete('/activities/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM activities WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Activité supprimée.' });
    });
});



// Routes pour la gestion des événements

// Récupérer tous les événements
app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter un événement
app.post('/events', (req, res) => {
    const { nom, date, description } = req.body;
    const sql = 'INSERT INTO events (nom, date, description) VALUES (?, ?, ?)';
    db.query(sql, [nom, date, description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, nom, date, description });
    });
});

// Modifier un événement
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { nom, date, description } = req.body;
    const sql = 'UPDATE events SET nom = ?, date = ?, description = ? WHERE id = ?';
    db.query(sql, [nom, date, description, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Événement mis à jour.' });
    });
});

// Supprimer un événement
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Événement supprimé.' });
    });
});

// Routes pour la gestion de la galerie

// Récupérer toutes les images de la galerie
app.get('/gallery', (req, res) => {
    const sql = 'SELECT * FROM gallery';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter une image à la galerie
app.post('/gallery', (req, res) => {
    const { url, description } = req.body;
    const sql = 'INSERT INTO gallery (url, description) VALUES (?, ?)';
    db.query(sql, [url, description], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, url, description });
    });
});

// Modifier une image de la galerie
app.put('/gallery/:id', (req, res) => {
    const { id } = req.params;
    const { url, description } = req.body;
    const sql = 'UPDATE gallery SET url = ?, description = ? WHERE id = ?';
    db.query(sql, [url, description, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Image mise à jour.' });
    });
});

// Supprimer une image de la galerie
app.delete('/gallery/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM gallery WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Image supprimée.' });
    });
});

// Routes pour la gestion des membres

// Récupérer tous les membres
app.get('/members', (req, res) => {
    const sql = 'SELECT * FROM members';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter un membre
app.post('/members', (req, res) => {
    const { nom, prenom, email } = req.body;
    const sql = 'INSERT INTO members (nom, prenom, email) VALUES (?, ?, ?)';
    db.query(sql, [nom, prenom, email], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, nom, prenom, email });
    });
});

// Modifier un membre
app.put('/members/:id', (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email } = req.body;
    const sql = 'UPDATE members SET nom = ?, prenom = ?, email = ? WHERE id = ?';
    db.query(sql, [nom, prenom, email, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Membre mis à jour.' });
    });
});

// Supprimer un membre
app.delete('/members/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM members WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Membre supprimé.' });
    });
});



// Récupérer tous les membres du bureau
app.get('/bureau', (req, res) => {
    const sql = 'SELECT * FROM bureau';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter un membre au bureau
app.post('/bureau', (req, res) => {
    const { nom, email, role, bio, image } = req.body;
    const sql = 'INSERT INTO bureau (nom, email, role, bio, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, email, role, bio, image], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, nom, email, role, bio, image });
    });
});

// Modifier un membre du bureau
app.put('/bureau/:id', (req, res) => {
    const { id } = req.params;
    const { nom, email, role, bio, image } = req.body;
    const sql = 'UPDATE bureau SET nom = ?, email = ?, role = ?, bio = ?, image = ? WHERE id = ?';
    db.query(sql, [nom, email, role, bio, image, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Membre du bureau mis à jour.' });
    });
});

// Supprimer un membre du bureau
app.delete('/bureau/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM bureau WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Membre du bureau supprimé.' });
    });
});


// Récupérer toutes les actualités
app.get('/news', (req, res) => {
    const sql = 'SELECT * FROM news ORDER BY date DESC';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ajouter une actualité
app.post('/news', (req, res) => {
    const { titre, date, contenu } = req.body;
    const sql = 'INSERT INTO news (titre, date, contenu) VALUES (?, ?, ?)';
    db.query(sql, [titre, date, contenu], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, titre, date, contenu });
    });
});

// Modifier une actualité
app.put('/news/:id', (req, res) => {
    const { id } = req.params;
    const { titre, date, contenu } = req.body;
    const sql = 'UPDATE news SET titre = ?, date = ?, contenu = ? WHERE id = ?';
    db.query(sql, [titre, date, contenu, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Actualité mise à jour.' });
    });
});

// Supprimer une actualité
app.delete('/news/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM news WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Actualité supprimée.' });
    });
});


// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}.`);
});
