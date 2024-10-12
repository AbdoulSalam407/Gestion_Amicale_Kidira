let base_url = 'http://127.0.0.1:3002';

function chargerMembres() {
    fetch(`${base_url}/membres`)
        .then(response => response.json())
        .then(data => afficherMembres(data))
        .catch(error => console.error('Erreur lors du chargement des membres:', error));
}

function afficherMembres(membres) {
    const aboutSection = document.getElementById('about');
    membres.forEach(membre => {
        const membreDiv = document.createElement('div');
        membreDiv.classList.add('member');
        membreDiv.innerHTML = `
            <img src="${membre.image}" alt="${membre.role}">
            <h2>${membre.role}</h2>
            <p>Nom : ${membre.nom}</p>
            <p>Email : ${membre.email}</p>
            <p>Bio : ${membre.bio}</p>
        `;
        aboutSection.appendChild(membreDiv);
    });
}

window.onload = chargerMembres;
