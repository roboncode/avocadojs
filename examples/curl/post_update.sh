curl -X PUT \
  http://localhost:3000/posts/first \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 35b73b1e-f4b2-4baa-8d4b-1c48488ec0f6' \
  -d '{
	"title": "My First Post [updated]",
	"content": "This post has been updated"
}'
echo ''