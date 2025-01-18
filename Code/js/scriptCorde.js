// Dimensions du graphique
const largeur = 1150;
const hauteur = 600;
const rayonInterne = Math.min(largeur, hauteur) * 0.5 - 40;
const rayonExterne = rayonInterne + 10;

const marge = {haut: 10, droite: 20, bas: 20, gauche: 20};

// Gestion de la div latérale
const infoDiv = d3.select("#info_cordes");
const infoTexte = d3.select("#info_cordes_texte");
const boutonFermer = d3.select("#fermer");

// Crée un élément SVG
var svg1 = d3.
    select('#visu_cordes').
    append('svg')
    .attr('width', largeur)
    .attr('height', hauteur)
    .append('g')
    .attr('transform', `translate(${marge.gauche + largeur / 2}, ${marge.haut + hauteur / 2})`); // Centrer le graphique

const utilisateursCorde = ["Angeline", "Loric", "Mathys", "Thomas"];
const couleursCorde = ["#00CC00", "#0055FF", "#FDD017", "#FF0000"];

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

    // On crée une matrice pour répertorier les vidéos communes entre les utilisateurs
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

    // Création du tooltip
    const tooltip = d3.select("#tooltip_cordes");

    // Création des arcs
    const arcs = d3.arc()
        .innerRadius(rayonInterne)
        .outerRadius(rayonExterne);

    // Ajout des arcs des utilisateurs
    svg1.append("g")
        .selectAll("path")
        .data(cordes.groups)
        .enter()
        .append("path")
        .style("fill", d => couleursCorde[d.index])
        .style("stroke", d => couleursCorde[d.index])
        .attr("d", arcs);

    // Ajout des noms des utilisateurs
    svg1.append("g")
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

    // Création des liens entre les utilisateurs
    const liens = d3.ribbon()
        .radius(rayonInterne);

    svg1.append("g")
        .selectAll("path")
        .data(cordes)
        .enter()
        .append("path")
        .attr("d", liens)
        .style("fill", d => couleursCorde[d.source.index])
        .style("stroke", d => couleursCorde[d.source.index])
        .style("opacity", 0.8)
        // Evènement de survol
        .on("mouseover", function(event, d) {
            // Rend transparent les autres liens
            svg1.selectAll("path")
                .style("opacity", 0.1)
                .style("stroke-width", 0)
                .transition()
                .delay(0)
                .duration(300);

            // Met en évidence le lien survolé
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "black")
                .style("stroke-width", 3);

            // Affiche le tooltip
            tooltip
                .style("opacity", 1)
                .text(`${utilisateursCorde[d.source.index]} et ${utilisateursCorde[d.target.index]} : ${d.source.value} vidéos en commun`); // Affiche le nombre
        })
        // Evènement de déplacement de la souris
        .on("mousemove", function (event) {
            // Positionne le tooltip
            tooltip
                .style("top", `${event.pageY - 80}px`)
                .style("left", `${event.pageX - 80}px`);
        })
        // Evènement de sortie du survol
        .on("mouseout", function () {
            // Réinitialise les liens
            svg1.selectAll("path")
                .transition()
                .delay(0)
                .duration(300)
                .style("opacity", 0.8)
                .style("stroke-width", 0);
    
            // Cache le tooltip
            tooltip
                .style("opacity", 0);
        })
        // Evènement de clic
        .on("click", function(event, d) {
            // Récupère les vidéos communes
            let videosCommunes = [];
            videosTotal.forEach(video => {
                video.users.forEach(utilisateur1 => {
                    video.users.forEach(utilisateur2 => {
                        if (utilisateur1.user !== utilisateur2.user && utilisateursCorde[d.source.index] === utilisateur1.user && utilisateursCorde[d.target.index] === utilisateur2.user) {
                            videosCommunes.push(video);
                        }
                    });
                });
            });

            // Récupère 5 vidéos au hasard pour les afficher dans la div latérale
            let videosCommunesAleatoires = [];
            for (let i = 0; i < 5; i++) {
                let video = videosCommunes[Math.floor(Math.random() * videosCommunes.length)];
                videosCommunesAleatoires.push(video);
            }

            // Crée le contenu de la div latérale ( code créé à l'aide de ChatGPT )
            let contenuVideos = `<h2>Vidéos communes entre ${utilisateursCorde[d.source.index]} et ${utilisateursCorde[d.target.index]}</h2>`;
            videosCommunesAleatoires.forEach(video => {
                const id = video.url.split("v=")[1]; // Récupère l'identifiant de la vidéo
                contenuVideos += `
                <div class="video">
                    <div class="video_info">
                        <iframe 
                            width="100%" 
                            height="315" 
                            src="https://www.youtube.com/embed/${id}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>`;
            });

            // Affiche les vidéos communes
            ouvrirDiv(contenuVideos);
        });

        // Evènement de clic sur le bouton de fermeture
        boutonFermer.on("click", fermerDiv);
        
        // Ouverture de la div latérale avec les informations
        function ouvrirDiv(infos) {
            infoTexte.html(infos);
            infoDiv.classed("active", true);
        }

        // Fermeture de la div latérale
        function fermerDiv() {
            infoDiv.classed("active", false);
        }
});