#!/usr/bin/env python3

import json

j = None
with open('cards.json') as fp:
    j = json.load(fp)

outData = dict()

def convert(card):
    newCard = dict()
    newCard['names'] = []
    for namek in ['cn_name', 'sc_name', 'md_name', 'nwbbs_n', \
                  'cnocg_n', 'jp_ruby', 'jp_name', 'en_name']:
        if namek in card and len(card[namek]) > 0:
            newCard['names'].append(card[namek])
    newCard['isExtra'] = False
    for t in ['超量', '链接', '同调', '融合']:
        if t in card['text']['types']:
            newCard['isExtra'] = True
    newCard['cid'] = card['cid']
    return newCard

for k in j:
    outData[j[k]['id']] = convert(j[k])

outStr = 'export const cardDb = ' + json.dumps(outData) + ';'

with open('../src/data/cardDb.js', 'w') as fp:
    fp.write(outStr)
