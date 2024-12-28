# Travail effectué pendant les vacances de Noël

## Récapitulatif de l'avancement au 27 décembre
### Scrapping des données
Angéline et Thomas ont réussi à récupérer toutes les données contenues dans le fichier d'historique fourni par Google Takeout. Nous avons donc maintenant accès aux informations suivantes pour chaque vidéo visionnée :
- Le titre de la vidéo
- l'url de la vidéo
- La chaîne
- la date et l'heure de visionnage

Grâce à ces données, nous construisons un fichier JSON. Nous avons ensuite besoin de scrapper les informations complémentaires sur YouTube pour chaque vidéo. Nous avons donc travaillé sur un script permettant de récupérer ces informations avec la bibliothèque Selenium. Nous voulions récupérer les informations suivantes :
- La durée de la vidéo
- La catégorie de la vidéo
- le pays de la chaîne

Cependant, nous avons rencontré un problème de temps d'exécution. À compter de 1 minute environ par vidéo pour 87961 vidéos, il nous faudrait environ 61 jours pour récupérer toutes les informations. Après avoir analysé ce qui pouvait prendre le plus de temps, nous avons décidé de ne plus récupérer le pays de la chaîne. Cela nous évite de devoir charger une page supplémentaire pour chaque vidéo. De plus, pour beaucoup de chaînes, nous n'arrivions pas à récupérer le pays et prenions donc beaucoup de temps pour rien.
Cela nous a permis de diviser par 2 le temps d'exécution, mais cela reste 30 jours pour récupérer les informations de toutes les vidéos.
Finalement, nous avons pris la décision de réduire notre ambition et de nous concentrer sur une année spécifique. Après discussion, nous avons choisi 2020, car il s'agit de l'année avec le plus de vidéos visionnées et donc la plus intéressante pour notre analyse. Nous avons donc 16873 vidéos à traiter. Pour cela, nous avons divisé le fichier en 5 pour que chacun exécute le programme sur une partie. En plus de cela, nous avons implémenté des threads pour récupérer les informations de plusieurs vidéos en même temps.