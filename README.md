lancer la commande npm i
lancer la commande node indexProvider.js dans provider_app
lancer la commande node index.js dans client_app
la route pour lancer la commande est /send-msg
la route pour récupérer l'état de la commande est /get-state
le worker est dans client_app
l'api est dans provider_app

Projet AMQP : TODO
 

API route POST
- Créer un objet en BDD (id, statut)
- Envoyer message dans RABBITMQ

 

API route GET
- Récupérer objet depuis la BDD

 

Worker
- Consomme le message émis par l'API précédemment
- Met à jour le statut dans la BDD
 
Critères d'évaluation :
 
- Programme fonctionnel avec docker-compose
- Code propre, sans constantes (utiliser les variables d'environnement)
- Documentation : HOWTO (prérequis, configuration, lancement)
- Documentation architecture, contenu message, contenu BDD, routes de l'API (avec réponses et erreurs)
- Aller plus loin que les consignes
 
 
Deadline : Mercredi 1er Février à 23h59:59