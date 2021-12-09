NOW=$(date +%s)
echo $NOW
curl -L -o output/game_uniform_$NOW.csv https://docs.google.com/spreadsheets/d/e/2PACX-1vQQd-ZUwYaptKGv5c51_SjnkE8Z-OvX-uzGccfejnQP1hkOgwuarZmH_v767xP5DX1cyWxZQLaTS2p-/pub?output=csv \
&& node ./build/script-bundle.js game_$NOW.csv \
&& curl -v -i -X POST http://init-db:8081/files/$NOW
