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

    window.updateChartHisto = function updateChartHisto() {
        // Filtrer les données par utilisateur
        const filteredData = parsedData.filter(d => {
            const userIndex = utilisateurs.indexOf(d.user);
            return listeCourbesAffichées[userIndex];
        });

        // Agréger les données par heure
        const aggregatedData = d3.group(
            filteredData,
            d => d.user,
            d => d.hour
        );

        const maxDuration = d3.max(Array.from(aggregatedData.values(), userHours =>
            d3.max(Array.from(userHours.values(), hours => d3.sum(hours, d => d.duration)))
        ));

        // Mettre à jour les échelles
        y.domain([0, maxDuration || 1]);

        // Mettre à jour les axes
        svg3.select(".x-axis").call(xAxis);
        svg3.select(".y-axis").call(yAxis);

        //suppresion des barres existantes
        svg3.selectAll(".bar").remove();

        // mise à jour des bars
        utilisateurs.forEach((utilisateur, i) => {
            const userAggregatedData = Array.from(aggregatedData.get(utilisateur) || [], ([hour, entries]) => ({
                hour,
                duration: d3.sum(entries, d => d.duration)
            }));

            const bars = svg3.selectAll(`.bar-${i}`)
                .data(userAggregatedData, d => d.hour);

            bars.enter().append("rect")
                .attr("class", `bar utilisateur-${i}`)
                .attr("x", d => x(d.hour))
                .attr("y", d => y(d.duration))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.duration))
                .attr("fill", couleursUtilisateurs[i])
                .attr("opacity", 0.6)
                .on("mouseover", function () {
                    // Rendre plus visible les barres de cet utilisateur
                    svg3.selectAll(`.bar`)
                        .attr("opacity", 0.2); // Réduire la visibilité de toutes les barres
                    svg3.selectAll(`.utilisateur-${i}`)
                        .attr("opacity", 0.7); // Rendre les barres de cet utilisateur visibles
                })
                .on("mouseout", function () {
                    // Réinitialiser l'opacité pour toutes les barres
                    svg3.selectAll(`.bar`)
                        .attr("opacity", 0.6);
                })
                .merge(bars);

        });
    };

    // Mise à jour du graphique
    updateChartHisto();
});