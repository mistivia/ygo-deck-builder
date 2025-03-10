curl https://ygocdb.com/api/v0/cards.zip -o cards.zip
unzip cards.zip
rm cards.zip
python3 build-card-info.py
python3 split.py
python3 genbanlist.py > ../src/ocg_banlist.json
python3 cn-genbanlist.py > ../src/cnocg_banlist.json
python3 md-genbanlist.py > ../src/md_banlist.json

rsync -avz ./card_db_parts/ root@raye:/volume/webroot/card_db_parts/
cd ..
sh deploy.sh
