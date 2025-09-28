import json

cardId = dict()
cards = None
with open('cards.json', 'r') as fp:
    cards = json.load(fp)

result = dict()

for k in cards:
    card = cards[k]
    if 'en_name' not in card:
        continue
    cardId[card['en_name']] = card['id']

with open('genesys', 'r') as fp:
    i = 0
    name = ''
    point = 0
    for line in fp:
        i = i + 1
        if i % 2 == 1:
            name = line.strip()
            name = name.replace('&amp;', '&')
        if i % 2 == 0:
            point = int(line)
            result[str(cardId[name])] = point

print(json.dumps(result, indent=4))
