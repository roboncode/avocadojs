cd server/tools 
docker-compose up -d
cd -

while ! nc -z localhost 10529; do   
  sleep 0.1 # wait for 1/10 of the second before check again
done

cd server
yarn
yarn populate
cd -

cd client
yarn
cd -
