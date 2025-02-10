curl https://ygocdb.com/api/v0/cards.zip -o cards.zip
unzip cards.zip
rm cards.zip
python3 build-card-info.py

