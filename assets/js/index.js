let base_url = 'http://127.0.0.1:3000';
let activites = [];
let editingIndex = -1;

function chargerActivites() {
    fetch(`${base_url}/activites`)
        .then(response => response.json())
        .then(data => {
            activites = data;
            afficherActivites();
        })
        .catch(error => afficherMessage('Erreur lors de la récupération des activités', 'error'));
}

function afficherActivites() {
    const listeActivites = document.getElementById('listeActivites');
    listeActivites.innerHTML = '';
    activites.forEach((activite, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${activite.id}</td>
            <td>${activite.nom}</td>
            <td>${activite.description}</td>
            <td>
                <button onclick="editerActivite(${index})">Modifier</button>
                <button onclick="confirmerSuppression(${activite.id})">Supprimer</button>
            </td>
        `;
        listeActivites.appendChild(row);
    });
}

function afficherFormulaireAjout() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitre').innerText = 'Nouvelle activité';
    document.getElementById('formActivite').reset();
    editingIndex = -1;
}

function fermerFormulaire() {
    document.getElementById('formSection').classList.add('hidden');
}

function sauvegarderActivite() {
    const nom = document.getElementById('activiteNom').value;
    const description = document.getElementById('activiteDescription').value;

    if (!nom || !description) {
        afficherMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (editingIndex === -1) {
        ajouterActivite({ nom, description });
    } else {
        modifierActivite({ nom, description });
    }

    fermerFormulaire();
    return false;
}

function ajouterActivite(activite) {
    fetch(`${base_url}/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activite)
    })
        .then(() => {
            afficherMessage('Activité ajoutée avec succès', 'success');
            chargerActivites();
        })
        .catch(error => afficherMessage('Erreur lors de l\'ajout de l\'activité', 'error'));
}

function editerActivite(index) {
    editingIndex = index;
    const activite = activites[index];
    document.getElementById('formTitre').innerText = 'Modifier activité';
    document.getElementById('activiteNom').value = activite.nom;
    document.getElementById('activiteDescription').value = activite.description;
    document.getElementById('formSection').classList.remove('hidden');
}

function modifierActivite(activite) {
    const id = activites[editingIndex].id;

    fetch(`${base_url}/modifier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activite)
    })
        .then(() => {
            afficherMessage('Activité modifiée avec succès', 'success');
            chargerActivites();
        })
        .catch(error => afficherMessage('Erreur lors de la modification de l\'activité', 'error'));
}

function confirmerSuppression(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
        supprimerActivite(id);
    }
}

function supprimerActivite(id) {
    fetch(`${base_url}/supprimer/${id}`, { method: 'DELETE' })
        .then(() => {
            afficherMessage('Activité supprimée avec succès', 'success');
            chargerActivites();
        })
        .catch(error => afficherMessage('Erreur lors de la suppression de l\'activité', 'error'));
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

window.onload = chargerActivites;
