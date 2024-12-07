let base_url = 'http://127.0.0.1:3003';
let news = [];
let editingIndex = -1;

function chargerNews() {
    fetch(`${base_url}/news`)
        .then(response => response.json())
        .then(data => {
            news = data;
            afficherNews();
        })
        .catch(error => afficherMessage('Erreur lors de la récupération des actualités', 'error'));
}

function afficherNews() {
    const listeNews = document.getElementById('listeNews');
    listeNews.innerHTML = '';
    news.forEach((actualite, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${actualite.id}</td>
            <td>${actualite.titre}</td>
            <td>${actualite.date}</td>
            <td>
                <button onclick="editerNews(${index})">Modifier</button>
                <button onclick="confirmerSuppression(${actualite.id})">Supprimer</button>
            </td>
        `;
        listeNews.appendChild(row);
    });
}

function afficherFormulaireAjout() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitre').innerText = 'Nouvelle actualité';
    document.getElementById('formNews').reset();
    editingIndex = -1;
}

function fermerFormulaire() {
    document.getElementById('formSection').classList.add('hidden');
}

function sauvegarderNews() {
    const titre = document.getElementById('newsTitre').value;
    const date = document.getElementById('newsDate').value;
    const contenu = document.getElementById('newsContenu').value;

    if (!titre || !date || !contenu) {
        afficherMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (editingIndex === -1) {
        ajouterNews({ titre, date, contenu });
    } else {
        modifierNews({ titre, date, contenu });
    }

    fermerFormulaire();
    return false;
}

function ajouterNews(actualite) {
    fetch(`${base_url}/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualite)
    })
        .then(() => {
            afficherMessage('Actualité ajoutée avec succès', 'success');
            chargerNews();
        })
        .catch(error => afficherMessage('Erreur lors de l\'ajout de l\'actualité', 'error'));
}

function editerNews(index) {
    editingIndex = index;
    const actualite = news[index];
    document.getElementById('formTitre').innerText = 'Modifier actualité';
    document.getElementById('newsTitre').value = actualite.titre;
    document.getElementById('newsDate').value = actualite.date;
    document.getElementById('newsContenu').value = actualite.contenu;
    document.getElementById('formSection').classList.remove('hidden');
}

function modifierNews(actualite) {
    const id = news[editingIndex].id;

    fetch(`${base_url}/modifier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualite)
    })
        .then(() => {
            afficherMessage('Actualité modifiée avec succès', 'success');
            chargerNews();
        })
        .catch(error => afficherMessage('Erreur lors de la modification de l\'actualité', 'error'));
}

function confirmerSuppression(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
        supprimerNews(id);
    }
}

function supprimerNews(id) {
    fetch(`${base_url}/supprimer/${id}`, { method: 'DELETE' })
        .then(() => {
            afficherMessage('Actualité supprimée avec succès', 'success');
            chargerNews();
        })
        .catch(error => afficherMessage('Erreur lors de la suppression de l\'actualité', 'error'));
}

function afficherMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.innerText = message;
    messageBox.className = type;
    setTimeout(() => {
        messageBox.innerText = '';
        messageBox.className = '';
    }, 3000);
}

window.onload = chargerNews;
