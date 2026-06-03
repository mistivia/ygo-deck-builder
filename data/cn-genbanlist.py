import json
import urllib.request

cardId = dict()
cards = None
with open('cards.json', 'r', encoding='utf-8') as fp:
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


# 更新了 groupId=2
url = "https://yxwdbapi.windoent.com/forbiddenCard/forbiddencard/cachelist?groupId=2"

# 将 curl 中的 headers 转换为字典
headers = {
    'accept': '*/*',
    'accept-language': 'zh,en;q=0.9,zh-CN;q=0.8',
    'origin': 'https://db.yugioh-card-cn.com',
    'referer': 'https://db.yugioh-card-cn.com/',
    'signature': '3pk1WBpfwCbASNE0zv5Cbw==',
    'token': '',  # curl 中是 'token;'，这里传空字符串
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
}

# 使用 urllib.request.Request 包装 url 和 headers
req = urllib.request.Request(url, headers=headers)

source_data = ""
# 发送带有 headers 的请求
with urllib.request.urlopen(req) as response:
    data = response.read().decode('utf-8')
    source_data = json.loads(data)

with open('banlist-cn.json', 'w', encoding='utf-8') as fp:
    json.dump(transform_card_data(source_data), fp, ensure_ascii=False, indent=4)

banlist = None
with open('banlist-cn.json', 'r', encoding='utf-8') as fp:
    banlist = json.load(fp)

regulation = banlist['regulation']
for cid in regulation:
    # 确保 cid 在字典中，防止 KeyError
    if cid in cardId:
        sid = str(cardId[cid])
        if regulation[cid] == 0:
            result['ban'].append(sid)
        if regulation[cid] == 1:
            result['limit'].append(sid)
        if regulation[cid] == 2:
            result['semiLimit'].append(sid)

result['ban'] = list(set(result['ban']))
result['limit'] = list(set(result['limit']))
result['semiLimit'] = list(set(result['semiLimit']))

print(json.dumps(result, indent=4))
