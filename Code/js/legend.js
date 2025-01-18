const utilisateurs = [ "Loric", "Mathys", "Thomas", "Angeline"];
const couleursUtilisateurs = ["#0055FF", "#FDD017", "#FF0000","#00CC00"];
const listeCourbesAffichées = [true, true, true, true];

// Sélection du conteneur de la légende fixe
const legendContainer = d3.select("#legendContainer");

// Ajout de chaque élément de la légende
utilisateurs.forEach((utilisateur, i) => {
    const legendItem = legendContainer.append("div")
        .attr("class", "legend-item")
        .style("cursor", "pointer");

    // Carré de couleur
    legendItem.append("div")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", couleursUtilisateurs[i]);

    // Nom de l'utilisateur
    legendItem.append("span")
        .style("margin-left", "5px")
        .style("color", "black")
        .text(utilisateur);

    // Événement au clic
    legendItem.on("click", () => {
        // Inversion de l'état de la courbe
        listeCourbesAffichées[i] = !listeCourbesAffichées[i];

        // Affichage ou masquage des courbes associées
        d3.selectAll(`.utilisateur-${i}`)
            .transition()
            .duration(300)
            .attr("display", listeCourbesAffichées[i] ? "block" : "none");

        // Mise à jour du style du texte
        legendItem.select("span")
            .style("color", listeCourbesAffichées[i] ? "black" : "lightgray");

        updateCharts();
        updateChartHisto();
    });
});