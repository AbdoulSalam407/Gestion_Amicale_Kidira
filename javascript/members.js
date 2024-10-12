let base_url = 'http://127.0.0.1:3005';
let membres = [];
let editingIndex = -1;

function chargerMembres() {
    fetch(`${base_url}/membres`)
        .then(response => response.json())
        .then(data => {
            membres = data;
            afficherMembres();
        })
        .catch(error => afficherMessage('Erreur lors de la récupération des membres', 'error'));
}

function afficherMembres() {
    const listeMembres = document.getElementById('listeMembres');
    listeMembres.innerHTML = '';
    membres.forEach((membre, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${membre.id}</td>
            <td>${membre.nom}</td>
            <td>${membre.prenom}</td>
            <td>${membre.email}</td>
            <td>
                <button onclick="editerMembre(${index})">Modifier</button>
                <button onclick="confirmerSuppression(${membre.id})">Supprimer</button>
            </td>
        `;
        listeMembres.appendChild(row);
    });
}

function afficherFormulaireAjout() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitre').innerText = 'Nouveau membre';
    document.getElementById('formMembre').reset();
    editingIndex = -1;
}

function fermerFormulaire() {
    document.getElementById('formSection').classList.add('hidden');
}

function sauvegarderMembre() {
    const nom = document.getElementById('membreNom').value;
    const prenom = document.getElementById('membrePrenom').value;
    const email = document.getElementById('membreEmail').value;

    if (!nom || !prenom || !email) {
        afficherMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (editingIndex === -1) {
        ajouterMembre({ nom, prenom, email });
    } else {
        modifierMembre({ nom, prenom, email });
    }

    fermerFormulaire();
    return false;
}

function ajouterMembre(membre) {
    fetch(`${base_url}/ajouterMembre`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membre)
    })
        .then(() => {
            afficherMessage('Membre ajouté avec succès', 'success');
            chargerMembres();
        })
        .catch(error => afficherMessage('Erreur lors de l\'ajout du membre', 'error'));
}

function editerMembre(index) {
    editingIndex = index;
    const membre = membres[index];
    document.getElementById('formTitre').innerText = 'Modifier membre';
    document.getElementById('membreNom').value = membre.nom;
    document.getElementById('membrePrenom').value = membre.prenom;
    document.getElementById('membreEmail').value = membre.email;
    document.getElementById('formSection').classList.remove('hidden');
}

function modifierMembre(membre) {
    const id = membres[editingIndex].id;

    fetch(`${base_url}/modifierMembre/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membre)
    })
        .then(() => {
            afficherMessage('Membre modifié avec succès', 'success');
            chargerMembres();
        })
        .catch(error => afficherMessage('Erreur lors de la modification du membre', 'error'));
}

function confirmerSuppression(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
        supprimerMembre(id);
    }
}

function supprimerMembre(id) {
    fetch(`${base_url}/supprimerMembre/${id}`, { method: 'DELETE' })
        .then(() => {
            afficherMessage('Membre supprimé avec succès', 'success');
            chargerMembres();
        })
        .catch(error => afficherMessage('Erreur lors de la suppression du membre', 'error'));
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

window.onload = chargerMembres;
