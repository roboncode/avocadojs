cd server/tools 
docker-compose up -d
cd -

sleep 10

cd server
yarn
node setup.js
cd -

cd client
yarn
cd -
