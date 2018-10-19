cd server/tools 
docker-compose up -d
cd -

sleep 5

cd server
yarn
yarn populate
cd -

cd client
yarn
cd -
