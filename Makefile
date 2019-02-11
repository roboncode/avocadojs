default: tests-only

publish-docs:
	./publish-docs.sh

publish:
	bump --prompt --tag --push --all
	npm publish

tests:
	npm run test

tests-only:
	npm run test-no-coverage