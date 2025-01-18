// Dimensions du graphique
const largeurNbVid = 1150;
const hauteurNbVid = 600;

// Crée un élément SVG
var svg = d3.
    select('#visuNbVid').
    append('svg')
    .attr('width', largeurNbVid)
    .attr('height', hauteurNbVid);

const margeNbVid = {haut: 20, droite: 20, bas: 40, gauche: 50};

let videosTotal, videosParJour, videosParSemaine, videosParMois; // Pour les vidéos
let echelleX, echelleY, axeX, axeY; // Pour les axes
let points, lignes; // Pour les lignes
let tooltip_nbVid, pointLePlusProche; // Pour le tooltip

// Récupère les données du fichier
d3.json('Code/Data/videoData2020.json').then(data => {

    // On met les vidéos dans un tableau pour les manipuler plus facilement
    videosTotal = Object.entries(data).map(([url, valeurs]) => ({
        url,
        ...valeurs,
        users: Object.entries(valeurs.users).map(([user, details]) => ({ // On fait pareil pour les utilisateurs à l'intérieur des vidéos
            user,
            ...details
        }))
    }));

    // Tri des vidéos par personne
    const videosParPersonne = utilisateurs.map(utilisateur => {
        var videosUtilisateur = [];
        videosTotal.forEach(video => { // On parcourt toutes les vidéos
            video.users.forEach(user => { // On parcourt tous les utilisateurs de chaque vidéo
                if (user.user === utilisateur) { // Si l'utilisateur est celui qu'on cherche
                    videosUtilisateur.push({ // On ajoute la vidéo à la liste des vidéos
                        url: video.url,
                        dateVisionnage: user.date
                    });
                }
            });
        });
        return videosUtilisateur;
    });

    // Tri des vidéos par mois
    videosParMois = videosParPersonne.map(videosTotal => {
        var videosMois = [];
        for (let i = 0; i < 12; i++) { // On parcourt tous les mois
            videosMois.push(videosTotal.filter(video => { // On filtre les vidéos du mois
                const mois = video.dateVisionnage.split('/')[1];
                return mois == i + 1;
            }));
        }
        return videosMois;
    });

    // Tri des vidéos par semaine
    videosParSemaine = videosParPersonne.map(videosTotal => {
        var videosSemaine = [];
        for (let i = 0; i < 53; i++) { // On parcourt toutes les semaines
            videosSemaine.push(videosTotal.filter(video => { // On filtre les vidéos de la semaine
                const jour = video.dateVisionnage.split('/')[0];
                const mois = video.dateVisionnage.split('/')[1];
                const annee = video.dateVisionnage.split('/')[2];
                const date = new Date(annee, mois - 1, jour);
                // L'année commençait par un mercredi donc on doit décaler les dates ( code à l'aide de Copilot )
                const debutAnnee = new Date(2020, 0, 1 - 2);
                const debutSemaine = new Date(debutAnnee.getTime() + i * 7 * 24 * 60 * 60 * 1000);
                const finSemaine = new Date(debutSemaine.getTime() + 7 * 24 * 60 * 60 * 1000);
                return date >= debutSemaine && date < finSemaine;
            }));
        }
        return videosSemaine;
    });

    // Tri des vidéos par jour
    videosParJour = videosParPersonne.map(videosTotal => {
        var videosJour = [];
        for (let i = 0; i < 366; i++) { // On parcourt tous les jours
            videosJour.push(videosTotal.filter(video => { // On filtre les vidéos du jour
                const jour = video.dateVisionnage.split('/')[0];
                const mois = video.dateVisionnage.split('/')[1];
                const annee = video.dateVisionnage.split('/')[2];
                const date = new Date(annee, mois - 1, jour);
                return date.getTime() === new Date(2020, 0, 1 + i).getTime();
            }));
        }
        return videosJour;
    });

    // Echelles
    echelleX = d3.scaleUtc()
        .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)]) // Toute l'année 2020
        .range([margeNbVid.gauche, largeurNbVid - margeNbVid.droite]);
    
    echelleY = d3.scaleLinear()
        .domain(
            [d3.min(videosParSemaine.flat(), videosTotal => videosTotal.length), // Le nombre minimal de vidéos visionnées
            d3.max(videosParSemaine.flat(), videosTotal => videosTotal.length)]) // Le nombre maximal de vidéos visionnées
        .range([hauteurNbVid - margeNbVid.bas, margeNbVid.haut]);

    // Axes
    axeX = d3.axisBottom(echelleX)
        .ticks(d3.timeMonth.every(1)) // Un tick par mois
        .tickFormat(d3.timeFormat('%d %b')); // Format de la date

    axeY = d3.axisLeft(echelleY);

    // Ajout des axes
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${hauteurNbVid - margeNbVid.bas})`)
        .call(axeX)
        .call(g => g.append("text")
        .attr("class", "axis-label")
        .attr("x", largeurNbVid / 2)
        .attr("y", margeNbVid.bas)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Année 2020"));

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margeNbVid.gauche}, 0)`)
        .call(axeY)
        .call(g => g.append("text")
        .attr("x", 0)
        .attr("y", margeNbVid.haut - 5)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("🠕 Nombre de vidéos visionnées"));

    // Création des points pour les lignes
    points = getPointsCourbe(videosParSemaine);
    

    // Création d'un tooltip pour afficher les informations sur les points
    tooltip_nbVid = d3.select('#visuNbVid')
        .append('div')
        .attr('class', 'tooltipNbVid')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'white')
        .style('padding', '5px')
        .style('border', '1px solid black');

    // Création des lignes
    lignes = svg.selectAll('.ligne')
        .data(points)
        .enter()
        .append('g')
        .attr('class', (d, i) => `ligne utilisateur-${i}`); // Chaque ligne a sa propre classe
    
    lignes.each(function(d, i) { // Pour chaque ligne
        const ligne = d3.select(this);

        const ligneGen = d3.line()
            .x(d => echelleX(d.date))
            .y(d => echelleY(d.nbVideos));

        ligne.append('path')
            .datum(d)
            .attr('d', ligneGen)
            .attr('fill', 'none')
            .attr('stroke', couleursUtilisateurs[i]) // Une couleur par personne
            .attr('stroke-width', 2)
            .attr('class', `ligne utilisateur-${i}`)
            // Evènement qui se produit lorsqu'on passe la souris sur la courbe
            .on('mouseover', function() {
                survolCourbe(this);
            })
            // Evènement qui se produit lorsqu'on enlève la souris de la courbe
            .on('mouseout', function() {
                enleverSurvolCourbe();
            })
            .on('click', function() {
                afficheSemaine(this)
            });
    });

    function afficheSemaine(courbe) {

        const mouseX = d3.pointer(event)[0];
        const dateActuelle = echelleX.invert(mouseX);

        // Trouve la semaine correspondante
        const debutAnnee = new Date(2020, 0, 1 - 2); // Début de l'année ajusté
        const semaineIndex = Math.floor((dateActuelle - debutAnnee) / (7 * 24 * 60 * 60 * 1000));
        
        // Calcule la semaine actuelle
        const semaine = semaineIndex + 1;

        // Ouvre la page 'test_semaine.html' avec le paramètre 'semaine'
        window.open(`affiche_semaine.html?semaine=${semaine}`, '_blank');

        return semaine;
    }

    // Fonction qui se produit lorsqu'on survole une courbe
    function survolCourbe(courbe) {
        // On rend les autres courbes transparentes
        d3.selectAll('.ligne')
            .transition()
            .delay(0)
            .duration(300)
            .attr('stroke-opacity', 0.1);
        d3.select(courbe)
            .transition()
            .delay(0)
            .duration(300)
            .attr('stroke-opacity', 1);

        // On rend le tooltip visible et on affiche les informations
        tooltip_nbVid.style('visibility', 'visible'); 
        const mouseX = d3.pointer(event)[0];

        // Place le tooltip au bon endroit avec les informations
        tooltip_nbVid
            .style('top', `${event.pageY - 80}px`)
            .style('left', `${event.pageX - 80}px`)
            .style('color', couleursUtilisateurs[parseInt(courbe.getAttribute('class').split('-')[1])]);

        // Trouve le point le plus proche de la souris et affiche les informations dans le tooltip
        const dateActuelle = echelleX.invert(mouseX);
        const indiceCourbe = courbe.getAttribute('class').split('-')[1];
        pointLePlusProche = trouverPointLePlusProche(dateActuelle, indiceCourbe);
        switch (document.getElementById('affichage').value) {
            case 'jour':
                tooltip_nbVid.text(`${pointLePlusProche.date.toLocaleDateString()} :\n ${pointLePlusProche.nbVideos} vidéos visionnées`);
                break;
            case 'semaine':
                tooltip_nbVid.text(`Semaine du ${pointLePlusProche.date.toLocaleDateString()} :\n ${pointLePlusProche.nbVideos} vidéos visionnées`);
                break;
            case 'mois':
                tooltip_nbVid.text(`Mois -  ${pointLePlusProche.date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} :\n ${pointLePlusProche.nbVideos} vidéos visionnées`);
                break;
        }
    }

    // Fonction qui se produit quand on enlève la souris d'une courbe
    function enleverSurvolCourbe() {
        tooltip_nbVid.style('visibility', 'hidden'); // On cache le tooltip
        d3.selectAll('.ligne')
            .transition()
            .delay(0)
            .duration(300)
            .attr('stroke-opacity', 1); // Les lignes redeviennent visibles
    }

});


// Fonction qui change l'intervalle d'affichage
function changeIntervalle() {
        const affichage = document.getElementById('affichage').value;
        let videosParIntervalle;
        switch (affichage) {
            case 'jour':
                points = getPointsCourbe(videosParJour);
                videosParIntervalle = videosParJour;
                break;
            case 'semaine':
                points = getPointsCourbe(videosParSemaine);
                videosParIntervalle = videosParSemaine;
                break;
            case 'mois':
                points = getPointsCourbe(videosParMois);
                videosParIntervalle = videosParMois;
                break;
        }

        echelleY.domain(
            [d3.min(videosParIntervalle.flat(), videosTotal => videosTotal.length), // Le nombre minimal de vidéos visionnées
            d3.max(videosParIntervalle.flat(), videosTotal => videosTotal.length)]); // Le nombre maximal de vidéos visionnées

        svg.select('.y-axis')
            .transition()
            .duration(300)
            .call(axeY);

        // Mise a jour des courbes
        lignes.each(function(d, i) {
            const ligne = d3.select(this);

            const ligneGen = d3.line()
                .x(d => echelleX(d.date))
                .y(d => echelleY(d.nbVideos));

            ligne.select('path')
                .datum(points[i])
                .transition()
                .duration(300)
                .attr('d', ligneGen);
        });
    }

// Fonction qui donne les points en fonction de l'intervalle d'affichage
function getPointsCourbe(videos) {
    switch (document.getElementById('affichage').value) {
        case 'jour':
            return videos.map((videos, i) => {
                return videos.map((videosJour, j) => {
                    return {
                        date: new Date(2020, 0, 1 + j),
                        nbVideos: videosJour.length
                    };
                });
            });
        case 'semaine':
            return videos.map((videos, i) => {
                return videos.map((videosSemaine, j) => {
                    return {
                        date: new Date(2020, 0, 2 + j * 7),
                        nbVideos: videosSemaine.length
                    };
                });
            });
        case 'mois':
            return videos.map((videos, i) => {
                return videos.map((videosMois, j) => {
                    return {
                        date: new Date(2020, j, 1),
                        nbVideos: videosMois.length
                    };
                });
            });
    }
}

// Fonction qui trouve le point le plus proche lorsque la souris survole une courbe
// ( Réalisé à l'aide de ChatGPT )
function trouverPointLePlusProche(dateActuelle, indiceCourbe) {
    let pointsActuels;
    switch (document.getElementById('affichage').value) {
        case 'jour':
            pointsActuels = getPointsCourbe(videosParJour);
            break;
        case 'semaine':
            pointsActuels = getPointsCourbe(videosParSemaine);
            break;
        case 'mois':
            pointsActuels = getPointsCourbe(videosParMois);
            break;
    }

    const pointsUtilisateur = pointsActuels[indiceCourbe];
    let pointLePlusProche = pointsUtilisateur[0];
    let distanceMin = Math.abs(pointLePlusProche.date - dateActuelle);
    pointsUtilisateur.forEach(point => {
        const distance = Math.abs(point.date - dateActuelle);
        if (distance < distanceMin) {
            pointLePlusProche = point;
            distanceMin = distance;
        }
    });
    return pointLePlusProche;
}