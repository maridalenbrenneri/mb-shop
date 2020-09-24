develop

./server - npm install
./client - npm install

./server - npm run dev
./client - ng serve

## jobs

npm run add-delivery-days

- Before deploying, make sure build works:
  ./server/$yarn build
    ./client/$ng build --aot --prod
- Commit to "master" branch
- Trrigger Deploy to heroku:
  \$sudo git push heroku master
