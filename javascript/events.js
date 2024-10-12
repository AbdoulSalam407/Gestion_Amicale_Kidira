let base_url = 'http://127.0.0.1:3001';
let events = [];
let editingIndex = -1;

function chargerEvents() {
    fetch(`${base_url}/events`)
        .then(response => response.json())
        .then(data => {
            events = data;
            afficherEvents();
        })
        .catch(error => afficherMessage('Erreur lors de la récupération des événements', 'error'));
}

function afficherEvents() {
    const listeEvents = document.getElementById('listeEvents');
    listeEvents.innerHTML = '';
    events.forEach((event, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.id}</td>
            <td>${event.nom}</td>
            <td>${event.date}</td>
            <td>${event.description}</td>
            <td>
                <button onclick="editerEvent(${index})">Modifier</button>
                <button onclick="confirmerSuppression(${event.id})">Supprimer</button>
            </td>
        `;
        listeEvents.appendChild(row);
    });
}

function afficherFormulaireAjout() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitre').innerText = 'Nouvel événement';
    document.getElementById('formEvent').reset();
    editingIndex = -1;
}

function fermerFormulaire() {
    document.getElementById('formSection').classList.add('hidden');
}

function sauvegarderEvent() {
    const nom = document.getElementById('eventNom').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;

    if (!nom || !date || !description) {
        afficherMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (editingIndex === -1) {
        ajouterEvent({ nom, date, description });
    } else {
        modifierEvent({ nom, date, description });
    }

    fermerFormulaire();
    return false;
}

function ajouterEvent(event) {
    fetch(`${base_url}/ajouterEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
        .then(() => {
            afficherMessage('Événement ajouté avec succès', 'success');
            chargerEvents();
        })
        .catch(error => afficherMessage('Erreur lors de l\'ajout de l\'événement', 'error'));
}

function editerEvent(index) {
    editingIndex = index;
    const event = events[index];
    document.getElementById('formTitre').innerText = 'Modifier événement';
    document.getElementById('eventNom').value = event.nom;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('formSection').classList.remove('hidden');
}

function modifierEvent(event) {
    const id = events[editingIndex].id;

    fetch(`${base_url}/modifierEvent/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
        .then(() => {
            afficherMessage('Événement modifié avec succès', 'success');
            chargerEvents();
        })
        .catch(error => afficherMessage('Erreur lors de la modification de l\'événement', 'error'));
}

function confirmerSuppression(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
        supprimerEvent(id);
    }
}

function supprimerEvent(id) {
    fetch(`${base_url}/supprimerEvent/${id}`, { method: 'DELETE' })
        .then(() => {
            afficherMessage('Événement supprimé avec succès', 'success');
            chargerEvents();
        })
        .catch(error => afficherMessage('Erreur lors de la suppression de l\'événement', 'error'));
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

window.onload = chargerEvents;
