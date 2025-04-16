import json
import urllib.request

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


def transform_card_data(input_json):
   output_data = {"regulation": {}}
   for item in input_json["list"]:
       for card in item["list"]:
           card_no = card["cardNo"]
           forbidden_type = card["type"]
           if "禁止卡" == forbidden_type:
               output_data["regulation"][card_no] = 0
           elif "限制卡" == forbidden_type:
               output_data["regulation"][card_no] = 1
           elif "准限制卡" == forbidden_type:
               output_data["regulation"][card_no] = 2
   return output_data

url = "https://yxwdbapi.windoent.com/forbiddenCard/forbiddencard/cachelist?groupId=1"

source_data = ""
with urllib.request.urlopen(url) as response:
    data = response.read().decode('utf-8')
    source_data = json.loads(data)

with open('banlist-cn.json', 'w') as fp:
    json.dump(transform_card_data(source_data), fp)

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

