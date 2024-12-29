# Travail effectué pendant la première partie des vacances

## Récapitulatif de l'avancement au jeudi 26 décembre

### Scrapping des données

<u>Angéline</u> et <u>Thomas</u> sont parvenus à récupérer toutes les données contenues dans les fichiers d'historique fournis par Google Takeout. Ceci nous a donné accès aux informations suivantes pour chaque vidéo visionnée :
- Le titre de la vidéo
- Son url
- La chaîne qui l'a publiée
- La date et l'heure de visionnage

Grâce à ces données, nous construisons un fichier JSON. Nous avons ensuite besoin de scrapper les informations complémentaires sur YouTube pour chaque vidéo. <u>Angéline</u> a donc travaillé sur un script permettant de récupérer ces informations avec la bibliothèque **Selenium**. Nous voulions récupérer les informations suivantes :
- La durée de la vidéo
- La catégorie de la vidéo
- Le pays de la chaîne

### Problème rencontré

Cependant, nous avons rencontré un problème de temps d'exécution. Etant donné que le traitement pour une vidéo prend environ 1 minute et que notre fichier contient **87961** vidéos, il nous faudrait **environ 61 jours pour récupérer toutes les informations**.

Après avoir analysé ce qui pouvait prendre le plus de temps, nous avons pris la décision de ne **plus récupérer le pays de la chaîne**. Cela nous évite de devoir charger une page supplémentaire pour chaque vidéo. De plus, pour beaucoup de chaînes, nous n'arrivions pas à récupérer le pays et prenions donc beaucoup de temps pour rien.

Cela nous a permis de diviser par 2 le temps d'exécution, mais il reste toutefois une **durée effective de 30 jours pour récupérer les informations** de toutes les vidéos.

## Evolution du projet à la date du dimanche 29 décembre

### Scrapping des données

#### Diminution du problème de temps

Finalement, nous avons pris la décision de réduire notre ambition et de nous **concentrer sur une année spécifique**. Après discussion, nous avons choisi 2020, car il s'agit de l'année avec le plus de vidéos visionnées et donc la plus intéressante pour notre analyse. Nous avons donc réduit le nombre de vidéos à traiter à **15488**.

Malgré tout, le temps d'exécution étant toujours trop conséquent pour une seule personne, nous avons choisi de mettre à contributions plusieurs ordinateurs. Nous avons donc divisé le fichier en 5 et appelé une aide extérieure pour que chacun exécute le programme sur une partie. En plus de cela, nous avons implémenté des threads pour récupérer les informations de plusieurs vidéos en même temps et ainsi réduire le temps d'exécution.

#### Résultats

Suite à l'exécution du programme sur les 5 ordinateurs et du travail combiné d'<u>Angéline</u> et <u>Thomas</u> pour corriger les erreurs, nous avons réussi à récupérer toutes les informations pour **15177** vidéos visionnées pendant l'année 2020. Les erreurs provenaient soit du fait que la durée prise en compte était celle de la publicité avant la vidéo, soit de vidéos supprimées ou privées, qui ne pouvaient donc pas être récupérées.
Nous avons donc maintenant un fichier JSON complet qui peut être utilisé pour réaliser les visualisations.

#### Conséquence des modifications sur nos visualisations

La réduction nécessaire du nombre de vidéos a forcément un impact sur la réalisation de nos visualisations.
Nous avions prévu de réaliser des visualisations sur l'évolution du nombre de vidéos visionnées dans le temps, la localisation des vidéos visionnées, les catégories regardées par chacun et la temporalité des vidéos visionnées.

Dans un premier temps, nous avons dû faire un sacrifice en ne prenant plus en compte le pays de la chaîne. Cela a pour conséquence de nous **retirer la possibilité de faire une visualisation sur la localisation des vidéos visionnées**. 

De plus, avec seulement une année de données, la première visualisation basée sur l'évolution du nombre de vidéos visionnées dans le temps doit être revue. Nous avons donc décidé de toujours réaliser cette visualisation, mais en la basant sur les mois de l'année 2020.

Enfin, nous avons décidé de **garder les visualisations sur les catégories regardées par chacun et la temporalité des vidéos visionnées**. Cependant, nous devrons adapter ces visualisations pour qu'elles soient basées sur l'année 2020 et non plus sur l'ensemble des données, ce qui n'est pas un problème majeur.

### Visualisation des données

En ce qui concernent le travail sur les visualisation, celui-ci progresse et nous avons désormais accès aux données réelles pour construire les graphiques.