# Travail effectué pendant la seconde partie des vacances

## Récapitulatif de l'avancement au mardi 7 janvier

### Visualisation du nombre de vidéos visionnées dans le temps (Thomas)

La première visualisation qui concerne le nombre de vidéos visionnées dans le temps est presque terminée. Il s'agit d'un **graphique linéaire** qui affiche le nombre de vidéos visionnées par jour, par semaine ou par mois. Il est possible de choisir l'intervalle de temps à afficher mais il y a quelques petits problèmes au niveau des courbes qui ne s'affichent pas correctement lors du changement. 

Il y a une courbe de couleur différente pour chaque personne. Chaque personne est présente avec sa couleur dans la légende et il est possible de choisir les personnes à afficher pour ne pas surcharger le graphique. L'utilisateur remarque également que lorsqu'il survole une courbe avec sa souris, les autres courbes deviennent presque transparentes. Un tooltip apparait aussi pour indiquer le nombre de vidéos regardées par une personne au moment de l'endroit cherché. Il faut néanmoins corriger cela car les valeurs ne sont pas toujours correctes. Enfin, on peut aussi voir que le graphique est légèrement animé, notamment dans l'apparition/disparition des courbes.

### Visualisations sur la durée de visionnage en fonction du temps (Loric)

Deux visualisations ont été réalisées pour la durée de visionnage en fonction du temps :

* La première est un **graphique en barres** qui affiche la durée de visionnage pour chaque heure de la journée sur l'année 2020. Elle permet pour chaque utilisateur de voir sa répartition de visionnage sur une journée ou une semaine. Il reste à ajouter l'affichage du nombre d'heures visionnées pour chaque barre au survol.

* La seconde est un **graphique linéaire** qui montre le temps de visionnage en fonction d'un jour ou d'une semaine précise. Elle correspond en quelque sorte à un zoom de la visualisation du nombre de vidéos visionnées dans le temps. Il reste à la rattacher à la première visualisation pour que les deux soient liées.

### Visualisations sur les catégories en fonction du temps (Mathys & Angéline)

Ici ce sont également deux visualisations qui ont été implémentées.

On trouve dans un premier temps un **spyder chart** qui a été réalisé pour visualiser les catégories regardées par chaque personne. Il est possible de sélectionner une ou plusieurs personnes pour analyser les catégories qu'elles regardent. Lorsque l'on survole un point, on observe le nombre exact de vidéos regardées dans cette catégorie. Sélectionner les catégorries est également une option disponible pour ne pas surcharger le graphique.Il reste à placer le nom des catégories autour du graphique ainsi que mettre quelques animations pour rendre le graphique plus dynamique.

L'autre visualisation est quant à elle un **donut chart** permettant de voir la répartition du nombre d'heures visionnées selon le genre et la personne. L'utilisateur peut choisir les catégories à afficher. Chaque donut représente une personne sur lequel on retrouve la proportion de temps visionné pour chaque catégorie. Chacune d'entre elles est associée à une couleur et on peut voir au survol le genre, le nombre d'heures visionnées et le pourcentage qu'elle représente parmi celles affichées. Il reste à ajouter la possibilité de sélectionner uniquement certaines personnes.

## Ce qu'il reste à faire pour la présentation du 14 janvier

### Visualisation du nombre de vidéos visionnées dans le temps

- [ ] Corriger les problèmes lors du changement de l'intervalle de temps
- [ ] Régler la précision pour les tooltips
- [ ] Associer le graphique à celui de la durée de visionnage

### Visualisations sur la durée de visionnage en fonction du temps

- [ ] Afficher le nombre d'heures visionnées pour chaque barre au survol
- [ ] Rattacher la visualisation à celle du nombre de vidéos visionnées dans le temps
- [ ] Donner la possibilité de sélectionner une date précise

### Visualisations sur les catégories en fonction du temps
- [ ] Ajouter des animations lors du changement de sélection (spyder chart)
- [ ] Afficher le nom de la catégorie autour du graphique (spyder chart)
- [ ] Permettre de sélectionner uniquement certaines personnes (donut chart)
- [ ] Associer les deux visualisations
