pour lancer le projet : il suffit de lancer la commande ´docker-compose up´
le projet est réparti en 4 containers : le premier pour rabbitmq, 
                                        le second pour la base de donnees, 
                                        le troisieme pour l'api, 
                                        le dernier pour le worker

l'api écoute sur le port 4001, elle contient deux routes : 
la premiere POST : '/send-msg' qui permet d'enregistrer une commande en base avec comme status 'Commande en cours de traitement' et d'envoyer un message a rabbitmq
elle renverra une erreur 500 si l'objet n'a pas pu etre inséré en base.

la seconde GET : '/get-state/:user_id' qui permet de recuperer l etat de commande d un utilisateur le parametre user_id devra etre 1 car c'est le seul utilisateur enregistré sur ce projet
elle renverra une erreur 404 si l onjet n existe pas

le worker contient une méthode qui permet d'ecouter les messages sur rabbitmq : s'il y a un message il va le consommer et mettre l'etat de la commande en base comme ceci 'commande traitée'.

la base de données est un volume que se partage l'api et le worker. elle est en sqlite3 car c'est le plus simple à mettre en place pour de petits projets.
Elle contient deux tables : 
une table users avec un id et un username prérempli avec un user (1, ratata) pour faciliter l'éxécution du projet.
la seconde est la table commands qui contient un id, une référence vers un user et un état de commande.
