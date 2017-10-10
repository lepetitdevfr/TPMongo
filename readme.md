## Synopsis

##### Collecte des Open Data Transillien dans un serveur mongoDB.
https://data.sncf.com/explore/dataset/ponctualite-mensuelle-transilien/?sort=date
##### Permet à un utilisateur de formuler un nombre réduit de requêtes simples sur cette base de données.

## Installation
##### Start Nginx & MongoDB

```sh
docker run -v yourPath/TpMongo/:/usr/share/nginx/html -d -p 80:80 nginx
docker run -p 27017:27017 -d mongo
```
##### Clone git & start node server
```sh
git clone https://github.com/lepetitdevfr/TPMongo.git .
cd TPMongo
node server.js
```
[[https://github.com/lepetitdevfr/TPMongo/blob/master/ligneA.png|alt=octocat]]
[[https://github.com/lepetitdevfr/TPMongo/blob/master/ligneC.png|alt=octocat]]
