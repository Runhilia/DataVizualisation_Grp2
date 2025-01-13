// Dimensions du graphique
const largeur = 1150;
const hauteur = 600;
const rayonInterne = Math.min(largeur, hauteur) * 0.5 - 40;
const rayonExterne = rayonInterne + 10;

const marge = {haut: 10, droite: 20, bas: 20, gauche: 20};

// Crée un élément SVG
var svg = d3.
    select('#visuCorde').
    append('svg')
    .attr('width', largeur)
    .attr('height', hauteur)
    .append('g')
    .attr('transform', `translate(${marge.gauche + largeur / 2}, ${marge.haut + hauteur / 2})`); // Centrer le graphique

const utilisateursCorde = ["Angeline", "Loric", "Mathys", "Thomas"];
const couleursCorde = ["#00CC00", "#0055FF", "#FDD017", "#FF0000"];

// Récupère les données du fichier
d3.json('Data/videoData2020.json').then(data => {

    // On met les vidéos dans un tableau pour les manipuler plus facilement
    videosTotal = Object.entries(data).map(([url, valeurs]) => ({
        url,
        ...valeurs,
        users: Object.entries(valeurs.users).map(([user, details]) => ({ // On fait pareil pour les utilisateursCorde à l'intérieur des vidéos
            user,
            ...details
        }))
    }));

    // On crée une matrice pour répertorier les vidéos communes entre les utilisateursCorde
    let matriceVideosCommunes = new Array(utilisateursCorde.length)
        .fill(0)
        .map(() => 
            new Array(utilisateursCorde.length).fill(0));
    
    // On remplit la matrice
    videosTotal.forEach(video => {
        video.users.forEach(utilisateur1 => {
            video.users.forEach(utilisateur2 => {
                if (utilisateur1.user !== utilisateur2.user) {
                    matriceVideosCommunes
                    [utilisateursCorde.indexOf(utilisateur1.user)]
                    [utilisateursCorde.indexOf(utilisateur2.user)]++;
                }
            });
        });
    });

    // Création des cordes
    const corde = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);
    const cordes = corde(matriceVideosCommunes);

    // Création des arcs
    const arcs = d3.arc()
        .innerRadius(rayonInterne)
        .outerRadius(rayonExterne);

    // Ajout des arcs des utilisateursCorde
    svg.append("g")
        .selectAll("path")
        .data(cordes.groups)
        .enter()
        .append("path")
        .style("fill", d => couleursCorde[d.index])
        .style("stroke", d => couleursCorde[d.index])
        .attr("d", arcs);

    // Ajout des noms des utilisateursCorde
    svg.append("g")
        .selectAll("text")
        .data(cordes.groups)
        .enter()
        .append("text")
        .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${rayonExterne + 10})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
        .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => utilisateursCorde[d.index]);

    // Création des liens entre les utilisateursCorde
    const liens = d3.ribbon()
        .radius(rayonInterne);

    svg.append("g")
        .selectAll("path")
        .data(cordes)
        .enter()
        .append("path")
        .attr("d", liens)
        .style("fill", d => couleursCorde[d.source.index])
        .style("stroke", d => couleursCorde[d.source.index]);

});