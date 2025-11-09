curl https://ygocdb.com/api/v0/idChangelog.jsonp -o ../src/id_changelog.json
curl https://ygocdb.com/api/v0/cards.zip -o cards.zip
unzip cards.zip
rm cards.zip
python3 build-card-info.py
python3 split.py
cd yaml-yugi
proxychains -q git pull
cd ..
rsync -avz yaml-yugi/data/cards/ root@raye:/volume/webroot/cardtext/

python3 fetch-ocg-banlist.py
python3 fetch-tcg-banlist.py
python3 fetch-genesys.py > genesys
proxychains -q curl https://raw.githubusercontent.com/DawnbrandBots/yaml-yugi-limit-regulation/refs/heads/master/data/master-duel/current.vector.json -o mdcurrent
proxychains -q curl https://raw.githubusercontent.com/DawnbrandBots/yaml-yugi-limit-regulation/refs/heads/master/data/master-duel/$(cat mdcurrent) -o banlist-md.json

sed -i 's/K9-   Lupis/K9-ØØ Lupis/' genesys

python3 genbanlist.py > ../src/ocg_banlist.json
python3 cn-genbanlist.py > ../src/cnocg_banlist.json
python3 tcg-genbanlist.py > ../src/tcg_banlist.json
python3 md-genbanlist.py > ../src/md_banlist.json
python3 genesys-banlist.py > ../src/genesys_banlist.json
python3 genesys-point.py > ../src/genesys_point.json

rsync -avz ./card_db_parts/ root@raye:/volume/webroot/card_db_parts/
cd ..
sh deploy.sh

cd data
cp cards.json ~/ygo/cardtext-proj
cd ~/ygo/cardtext-proj
sh update.sh
