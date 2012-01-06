.PHONY: build clean

build:
	mkdir -p build
	zip -j build/google-incognito-opt-out_`jq -r '.version' src/manifest.json`.zip src/*

clean:
	rm build/*.zip