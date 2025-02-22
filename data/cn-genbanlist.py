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
    cardId[k] = cards[k]['id']
    if 'sc_name' not in cards[k]:
        result['ban'].append(str(cardId[k]))

banlist = None
with open('banlist-cn.json', 'r') as fp:
    banlist = json.load(fp)

regulation = banlist['regulation']
for cid in regulation:
    sid = str(cardId[cid])
    if regulation[cid] == 0:
        result['ban'].append(sid)
    if regulation[cid] == 1:
        result['limit'].append(sid)
    if regulation[cid] == 2:
        result['semiLimit'].append(sid)
result['ban'] = list(set(result['ban']))
print(json.dumps(result, indent=4))
    
