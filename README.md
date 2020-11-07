## overview

MB Shop is an Angular client with a node/express backend.
The backend ('server') serves the the client and acts as API (classic web client/server app)
Some environment vars are mandatory for the app to run, see .env-template in ./server folder.

## development

prerequisites: node, npm, for deploy:

./client - $npm install
./client - $ng serve

./server - $npm install
./server - $npm run dev

## jobs

One time jobs for cleanup / data migration / etc. Used for dvelopment/maintenance, only to be run locally by developers.

\$npm run add-delivery-days

## database

MB Shop connects to a MySql database. Database is altered by updating server/database/index.ts and running '\$node ./server/database'

## deploy

Deploy requires that a git Heroku remote is added to your local repository, see https://devcenter.heroku.com/articles/git#creating-a-heroku-remote

- Pre-deploy, run production build locally to make sure everything works:
  ./server - $npm run build
  ./client - $ng build --aot --prod
- Commit to "master" branch
- Trigger Deploy to Heroku:
  ./ - sudo git push heroku master
