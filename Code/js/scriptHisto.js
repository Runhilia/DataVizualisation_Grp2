// Liste des utilisateursHisto et couleursHisto associées
const utilisateursHisto = ["Angeline", "Loric", "Mathys", "Thomas"];
const couleursHisto = ["#00CC00", "#0055FF", "#FDD017", "#FF0000"];

d3.json("Code/Data/videoData2020.json").then(data => {
    // Transformer les données
    const parsedData = [];
    Object.values(data).forEach(video => {
        Object.entries(video.users).forEach(([user, details]) => {
            const [hours, minutes, seconds] = video.duree.split(":").map(Number);
            const totalSeconds = (hours * 3600 + minutes * 60 + seconds) / 3600; // Convertir en heures
            const date = new Date(`${details.date.split("/").reverse().join("-")}T${details.heure.trim()}`);
            parsedData.push({
                user,
                hour: date.getHours(),
                duration: totalSeconds
            });
        });
    });

    const users = [...new Set(parsedData.map(d => d.user))];

    // Configurer le graphique
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 100, bottom: 50, left: 50 };

    const svg3 = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain([...Array(24).keys()]) // Heures de 0 à 23
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(x).tickFormat(d => `${d}h`);
    const yAxis = d3.axisLeft(y).tickFormat(d => `${Math.round(d)}h`);

    svg3.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis");

    svg3.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis");

        const updateChart = (selectedUser) => {
            // Filtrer les données par utilisateur
            const filteredData = parsedData.filter(d => d.user === selectedUser);

            // Agréger les données par heure
            const aggregatedData = d3.rollup(
                filteredData,
                v => d3.sum(v, d => d.duration),
                d => d.hour
            );

            const aggregatedArray = Array.from(aggregatedData, ([hour, duration]) => ({ hour, duration }))
                                        .sort((a, b) => a.hour - b.hour);

            // Mettre à jour les échelles
            y.domain([0, d3.max(aggregatedArray, d => d.duration)]);

            // Mettre à jour les axes
            svg3.select(".x-axis").call(xAxis);
            svg3.select(".y-axis").call(yAxis);

            // Liaison des données
            const bars = svg3.selectAll(".bar")
                .data(aggregatedArray, d => d.hour);

            // Ajouter ou mettre à jour les barres
            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.hour))
                .attr("y", d => y(d.duration))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.duration))
                .attr("fill", couleursHisto[utilisateursHisto.indexOf(selectedUser)]) // Appliquer la couleur en fonction de l'utilisateur
                .merge(bars)
                .transition().duration(500)
                .attr("x", d => x(d.hour))
                .attr("y", d => y(d.duration))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.duration))
                .attr("fill", couleursHisto[utilisateursHisto.indexOf(selectedUser)]); // Mettre à jour la couleur

            
            bars.exit().remove();
        };


    // Ajouter la légende avec les couleursHisto
    const legend = d3.select("#legend")
        .selectAll(".legend")
        .data(users)
        .enter().append("div")
        .attr("class", "legend")
        .style("color", (d, i) => couleursHisto[utilisateursHisto.indexOf(d)]) // Appliquer la couleur de chaque utilisateur
        .text(d => d)
        .on("click", function(event, d) {
            // Activer/désactiver l'état actif
            d3.selectAll(".legend").classed("active", false);
            d3.select(this).classed("active", true);

            // Mettre à jour le graphique
            updateChart(d);
        });

    // Sélectionner le premier utilisateur par défaut
    d3.select(legend.nodes()[0]).classed("active", true);
    updateChart(users[0]);
}).catch(error => {
    console.error("Erreur lors du chargement des données :", error);
});