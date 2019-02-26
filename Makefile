default: tests-only

publish-docs:
	./publish-docs.sh

publish:
	bump --prompt --tag --push --all
	npm publish

db:
	cd docker && docker-compose up -d

tests:
	npm run test

tests-only:
	npm run test-no-coverage