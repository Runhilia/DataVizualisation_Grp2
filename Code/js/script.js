
        const margin = { top: 60, right: 100, bottom: 20, left: 100 },
            width = 400,
            height = 450;

    const utilisateurs = ["Angeline", "Loric", "Mathys", "Thomas"];
    const couleurs = ["#00CC00", "#0055FF", "#FDD017", "#FF0000"];
    const categories = [
      "Gaming", "Music", "Entertainment", "Comedy",
      "Film & Animation", "Sports", "People & Blogs",
      "Education", "Science & Technology", "Howto & Style",
      "News & Politics", "Pets & Animals", "Travel & Events",
      "Nonprofits & Activism"
    ];

    const couleursDonuts = ["#911215", "#F5BB5F", "#6D46BE", "#1FA83C", "#D47DA7", "#D92689", "#AE67EA",
      "#2B35B7", "#6684D5", "#A15738", "#5E8391", "#03C79A", "#167DE8", "#BA259C", "#AA95F5"
  ];

    const utilisateurDefaut = "Angeline";
    const categoriesDefaut = ["Gaming", "Music", "Education", "Entertainment", "Comedy"];

    d3.json("Data/videoData2020.json").then(data => {
      const videos = Object.entries(data).map(([url, valeurs]) => ({
        url,
        ...valeurs,
        users: Object.entries(valeurs.users).map(([user, details]) => ({
          user,
          ...details
        }))
      }));

      const userSelect = d3.select("#user-select");
      userSelect.selectAll("label")
        .data(utilisateurs)
        .enter()
        .append("label")
        .attr("class", "legend-item")
        .html((d, i) => {
          const isChecked = d === utilisateurDefaut ? "checked" : "";
          return `<input type="checkbox" value="${d}" ${isChecked}> <span style="color:${couleurs[i]}">${d}</span><br>`;
        });

        const categorySelect = d3.select("#category-select");
        categorySelect.selectAll("input")
          .data(categories)
          .enter()
          .append("label")
          .html(d => {
            const isChecked = categoriesDefaut.includes(d) ? "checked" : "";
            return `<input type="checkbox" value="${d}" ${isChecked}> ${d}`;
        });

        // Récupérer les données de l'utilisateur et des catégories sélectionnés
        function getUserDataRadar(user, selectedCategories) {
            let stats = {};
            selectedCategories.forEach(categorie => {
              stats[categorie] = { nombreVideos: 0 };
            });
    
            videos.forEach(video => {
              video.users.forEach(videoUser => {
                if (videoUser.user === user) {
                  if (selectedCategories.includes(video.genre)) {
                    stats[video.genre].nombreVideos += 1;
                  }
                }
              });
            });
    
            const sortedCategories = Object.entries(stats)
              .filter(([_, valeurs]) => valeurs.nombreVideos > 0)
              .sort((a, b) => b[1].nombreVideos - a[1].nombreVideos);
            
            return sortedCategories.map(([categorie, valeurs]) => ({
              axis: categorie,
              value: valeurs.nombreVideos
            }));
          }

          function getUserDataDonuts(user, selectedCategories) {
            
            // Initialisation d'un objet pour stocker les genres par utilisateur
            const userGenreCounts = {};
            var i = 0;
            // Parcours des vidéos
            videos.forEach(video => {
                const genre = video.genre;
                const duree = video.duree;
                
                video.users.forEach(({ user }) => {
                    // Initialisation des données pour chaque utilisateur si nécessaire
                    if (!userGenreCounts[user]) {
                        userGenreCounts[user] = {};
                    }
                    if (!userGenreCounts[user][genre]) {
                        userGenreCounts[user][genre] = {count : 0, totalDuree : 0};
                    }
                    // Incrémentation du compteur pour le genre
                    userGenreCounts[user][genre].count++;
                    userGenreCounts[user][genre].totalDuree+= calculDuree(duree);
                    
                });
            });

            console.log(userGenreCounts);
            return Object.entries(userGenreCounts[user])
                .filter(([genre]) => selectedCategories.includes(genre))
                .map(([genre, value]) => ({
                    user,
                    axis: genre,
                    count: value.count,          
                    totalDuree: value.totalDuree 
                }));
          }

          function updateCharts() {
            const selectedUsers = userSelect.selectAll("input:checked")
              .nodes()
              .map(checkbox => checkbox.value);
    
            const selectedCategories = categorySelect.selectAll("input:checked")
              .nodes()
              .map(checkbox => checkbox.value);
    
            const radarData = selectedUsers.map((user, i) => ({
              data: getUserDataRadar(user, selectedCategories),
              color: couleurs[utilisateurs.indexOf(user)]
            }));
    
            drawRadarChart("#visu", radarData, {
              w: width,
              h: height,
              margin: margin,
              maxValue: Math.max(...radarData.flatMap(d => d.data.map(p => p.value))),
              levels: 5,
              roundStrokes: true
            });

            const donutsData = selectedUsers.map((user, i) => ({
                data: getUserDataDonuts(user, selectedCategories)
              }));
    
            drawDonutCharts("#donuts", donutsData);
          }

            updateCharts();
            userSelect.on("change", updateCharts);
            categorySelect.on("change", updateCharts);

            function drawRadarChart(id, data, options) {
                const cfg = {
                  w: 600,
                  h: 600,
                  margin: { top: 20, right: 20, bottom: 20, left: 20 },
                  levels: 5,
                  maxValue: 0,
                  roundStrokes: false,
                  color: d3.scaleOrdinal(d3.schemeCategory10)
                };
              
                Object.keys(options).forEach(key => cfg[key] = options[key]);
              
                const radius = Math.min(cfg.w / 2, cfg.h / 2);
              
                const svg = d3.select(id).select("svg");
                if (svg.empty()) {
                  d3.select(id)
                    .append("svg")
                    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
                    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
                    .append("g")
                    .attr("class", "radarChartGroup")
                    .attr("transform", `translate(${cfg.w / 2 + cfg.margin.left},${cfg.h / 2 + cfg.margin.top})`);
                }
              
                const radarChartGroup = d3.select(`${id} .radarChartGroup`);
                const allAxis = data[0].data.map(d => d.axis);
                const total = allAxis.length;
                const angleSlice = Math.PI * 2 / total;
              
                const rScale = d3.scaleLinear()
                  .range([0, radius])
                  .domain([0, cfg.maxValue]);
              
                radarChartGroup.selectAll(".axisWrapper").remove();
              
                const axisGrid = radarChartGroup.append("g").attr("class", "axisWrapper");
              
                axisGrid.selectAll(".levels")
                  .data(d3.range(1, cfg.levels + 1).reverse())
                  .enter().append("circle")
                  .attr("class", "gridCircle")
                  .attr("r", d => radius / cfg.levels * d)
                  .style("fill", "#CDCDCD")
                  .style("fill-opacity", 0.1);
              
                axisGrid.selectAll(".level-label")
                  .data(d3.range(1, cfg.levels + 1).reverse())
                  .enter().append("text")
                  .attr("class", "level-label")
                  .attr("x", 4)
                  .attr("y", d => -radius / cfg.levels * d)
                  .attr("dy", "-0.3em")
                  .text(d => `${Math.round(cfg.maxValue / cfg.levels * d)} vidéos`);
              
                const axis = axisGrid.selectAll(".axis")
                  .data(allAxis)
                  .enter().append("g")
                  .attr("class", "axis");
              
                axis.append("line")
                  .attr("x1", 0)
                  .attr("y1", 0)
                  .attr("x2", (d, i) => rScale(cfg.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
                  .attr("y2", (d, i) => rScale(cfg.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
                  .attr("class", "line")
                  .style("stroke", "white")
                  .style("stroke-width", "2px");
              
                axis.append("text")
                .attr("class", "legend")
                .style("font-size", "12px")
                .style("fill", (d, i) => couleursDonuts[categories.indexOf(d)])
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .attr("x", (d, i) => rScale(cfg.maxValue * 1.2) * Math.cos(angleSlice * i - Math.PI / 2))
                .attr("y", (d, i) => rScale(cfg.maxValue * 1.2) * Math.sin(angleSlice * i - Math.PI / 2))
                .text(d => d);

              
                const radarWrapper = radarChartGroup.selectAll(".radarWrapper").data(data, d => d.color);

// Gestion des graphiques des utilisateurs désélectionnés
radarWrapper.exit()
  .transition()
  .duration(500)
  .style("opacity", 0) // Animation pour réduire progressivement l'opacité
  .remove(); // Supprimer le groupe radarWrapper correspondant

              
                const radarWrapperEnter = radarWrapper.enter()
                  .append("g")
                  .attr("class", "radarWrapper");
              
                radarWrapperEnter.append("path")
                  .attr("class", "radarArea")
                  .style("fill", d => d.color)
                  .style("fill-opacity", 0.1);
              
                radarWrapperEnter.append("path")
                  .attr("class", "radarStroke")
                  .style("stroke", d => d.color)
                  .style("stroke-width", 2)
                  .style("fill", "none");
              
                radarWrapperEnter.append("path")
                  .attr("class", "radarLine")
                  .style("stroke", "white")
                  .style("stroke-width", 2)
                  .style("fill", "none");
              
                const radarWrapperMerged = radarWrapperEnter.merge(radarWrapper);
              
                radarWrapperMerged.select(".radarStroke")
                  .transition()
                  .duration(750)
                  .attr("d", d => d3.lineRadial()
                    .curve(d3.curveLinearClosed)
                    .radius(p => rScale(p.value))
                    .angle((p, i) => i * angleSlice)(d.data));
              
                radarWrapperMerged.select(".radarArea")
                  .transition()
                  .duration(750)
                  .attr("d", d => d3.lineRadial()
                    .curve(d3.curveLinearClosed)
                    .radius(p => rScale(p.value))
                    .angle((p, i) => i * angleSlice)(d.data));
              
                const radarCircle = radarWrapperMerged.selectAll(".radarCircle").data(d => d.data, p => p.axis);
              
                radarCircle.enter()
                  .append("circle")
                  .attr("class", "radarCircle")
                  .attr("r", 5)
                  .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
                  .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
                  .style("fill", (d, i, nodes) => d3.select(nodes[i].parentNode).datum().color)
                  .style("fill-opacity", 0.8)
                  .merge(radarCircle)
                  .transition()
                  .duration(750)
                  .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
                  .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
                  .on("end", function () {
                    d3.select(this).raise();  
                    d3.select(this.parentNode).select(".radarLine").raise(); 
                  });
              
                radarCircle.exit()
                  .transition()
                  .duration(500)
                  .style("opacity", 0)
                  .remove();
              
                const tooltip = d3.select("#tooltip");
              
                radarWrapperMerged.selectAll(".radarCircle")
                  .on("mouseover", function (event, d) {
                    tooltip.style("opacity", 1)
                      .html(`${d.axis}: ${d.value} vidéos`)
                      .style("left", `${event.pageX + 10}px`)
                      .style("top", `${event.pageY - 10}px`);
                  })
                  .on("mousemove", function (event) {
                    tooltip.style("left", `${event.pageX + 10}px`)
                      .style("top", `${event.pageY - 10}px`);
                  })
                  .on("mouseout", function () {
                    tooltip.style("opacity", 0);
                  });
              
                radarChartGroup.selectAll(".axisWrapper")
                  .lower(); 
            }
            

            function calculDuree(duree){
                const [hours, minutes, seconds] = duree.split(':').map(Number);
                return hours * 3600 + minutes * 60 + seconds;
            }
                        
            function formatSecondsToHMS(totalSeconds) {
                const hours = Math.floor(totalSeconds / 3600);
                const formattedHours = String(hours).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajoute des espaces tous les 3 chiffres
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                return `${formattedHours}h ${String(minutes).padStart(2, '0')}`;
            }

            function drawDonutCharts(id, data) {
                d3.select(id).selectAll("svg").remove();
                
                nbVideos = {};
                data.forEach(d => {
                    nbVideos[d.user] = d.data.reduce((acc, { count }) => acc + count, 0);
                });
        
                const width = 200;
                const height = 200;
                const radius = Math.min(width, height) / 2;
        
                const arc = d3.arc()
                .innerRadius(radius * 0.6)
                .outerRadius(radius * 0.8);
        
                const pie = d3.pie()
                .sort(null)
                .value(d => d.totalDuree);
        
                const svg = d3.select(id)
                .selectAll("svg")
                .data(data)
                .enter()
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);
        
                svg.selectAll("path")
                .data(d => pie(d.data).map(segment => ({ ...segment, user: d.user })))
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", (d, i) => couleursDonuts[categories.indexOf(d.data.axis)])
                .on("mouseover", function (event, d) {
                    const genre = d.data.axis;
                    const duree = d.data.totalDuree;
                    const total = d3.sum(d3.select(this.parentNode).datum().data, segment => segment.totalDuree);
                    const pourcentage = ((d.data.totalDuree / total) * 100).toFixed(2);

                    d3.select(this.parentNode)
                        .selectAll("path")
                        .style("opacity", 0.3);

                    d3.select(this).style("opacity", 1);

                    d3.select("#info")
                        .style("left", event.pageX+10 + "px")
                        .style("top",  event.pageY-50 + "px")
                        .style("position", "absolute")
                        .style("padding", "10px")
                        .style("border", "1px solid #ddd")
                        .style("background-color", "#fff")
                        .style("visibility", "visible")
                        .style("box-shadow", "0px 0px 5px rgba(0, 0, 0, 0.1)")
                        .html(`<b>Genre:</b> ${genre}<br><b>Heure de vidéos:</b> ${formatSecondsToHMS(duree)}<br><b>Pourcentage:</b> ${pourcentage}%`);
                        //
                })
                .on("mouseout", function () {
                    d3.select(this.parentNode)
                        .selectAll("path")
                        .style("opacity", 1);

                    d3.select("#info").html("").style("visibility", "hidden");
                });
        
                svg.append("text")
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .text(d => d.data[0].user);
            }

    });
