let base_url = 'http://127.0.0.1:3004';
let photos = [];
let editingIndex = -1;

function chargerPhotos() {
    fetch(`${base_url}/photos`)
        .then(response => response.json())
        .then(data => {
            photos = data;
            afficherPhotos();
        })
        .catch(error => afficherMessage('Erreur lors de la récupération des photos', 'error'));
}

function afficherPhotos() {
    const galleryContainer = document.getElementById('galleryContainer');
    galleryContainer.innerHTML = '';
    photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.description;
        img.title = photo.description;
        img.onclick = () => editerPhoto(index);
        galleryContainer.appendChild(img);
    });
}

function afficherFormulaireAjout() {
    document.getElementById('formSection').classList.remove('hidden');
    document.getElementById('formTitre').innerText = 'Nouvelle Photo';
    document.getElementById('formPhoto').reset();
    editingIndex = -1;
}

function fermerFormulaire() {
    document.getElementById('formSection').classList.add('hidden');
}

function sauvegarderPhoto() {
    const url = document.getElementById('photoUrl').value;
    const description = document.getElementById('photoDescription').value;

    if (!url || !description) {
        afficherMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (editingIndex === -1) {
        ajouterPhoto({ url, description });
    } else {
        modifierPhoto({ url, description });
    }

    fermerFormulaire();
    return false;
}

function ajouterPhoto(photo) {
    fetch(`${base_url}/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo)
    })
        .then(() => {
            afficherMessage('Photo ajoutée avec succès', 'success');
            chargerPhotos();
        })
        .catch(error => afficherMessage('Erreur lors de l\'ajout de la photo', 'error'));
}

function editerPhoto(index) {
    editingIndex = index;
    const photo = photos[index];
    document.getElementById('formTitre').innerText = 'Modifier Photo';
    document.getElementById('photoUrl').value = photo.url;
    document.getElementById('photoDescription').value = photo.description;
    document.getElementById('formSection').classList.remove('hidden');
}

function modifierPhoto(photo) {
    const id = photos[editingIndex].id;

    fetch(`${base_url}/modifier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo)
    })
        .then(() => {
            afficherMessage('Photo modifiée avec succès', 'success');
            chargerPhotos();
        })
        .catch(error => afficherMessage('Erreur lors de la modification de la photo', 'error'));
}

function confirmerSuppression(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
        supprimerPhoto(id);
    }
}

function supprimerPhoto(id) {
    fetch(`${base_url}/supprimer/${id}`, { method: 'DELETE' })
        .then(() => {
            afficherMessage('Photo supprimée avec succès', 'success');
            chargerPhotos();
        })
        .catch(error => afficherMessage('Erreur lors de la suppression de la photo', 'error'));
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

window.onload = chargerPhotos;
