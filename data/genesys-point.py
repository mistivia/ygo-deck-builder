import json
import sys

cardId = dict()
cards = None
with open('cards.json', 'r') as fp:
    cards = json.load(fp)

result = dict()

for k in cards:
    card = cards[k]
    if 'en_name' in card:
        cardId[card['en_name']] = card['id']
    elif 'wiki_en' in card:
        cardId[card['wiki_en']] = card['id']
    else:
        continue

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
            if name in cardId:
                result[str(cardId[name])] = point
            else:
                print('card not found: ' + name, file=sys.stderr)

print(json.dumps(result, indent=4))
