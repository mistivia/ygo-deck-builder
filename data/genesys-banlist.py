import json

cardId = dict()
cards = None
with open('cards.json', 'r') as fp:
    cards = json.load(fp)

result = dict()
result['ban'] = []
result['limit'] = []
result['semiLimit'] = []

for k in cards:
    card = cards[k]
    cardId[k] = cards[k]['id']
    if 'en_name' not in card:
        result['ban'].append(str(cardId[k]))
        continue
    if 'text' in card:
        if 'types' in card['text']:
            if '连接' in card['text']['types'] or '灵摆' in card['text']['types']:
                result['ban'].append(str(cardId[k]))

print(json.dumps(result, indent=4))
