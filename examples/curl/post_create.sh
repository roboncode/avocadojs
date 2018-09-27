curl -X POST \
  http://localhost:3000/posts \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"user": "rob",
	"title": "Orango works!",
	"content": "This is an example post"
}'
echo ''