import json
import urllib.request
import re

url = "https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=ja"

source_data = ""
with urllib.request.urlopen(url) as response:
    data = response.read().decode('utf-8')

current_status = -1

output_data = {"regulation": {}}

for line in data.split('\n'):
    if '</div><!-- #list_semi_limited .list_set -->' in line:
        current_status = -1
    if '<div id="list_semi_limited" class="list_set">' in line:
        current_status = 2
    if '<div id="list_forbidden" class="list_set">' in line:
        current_status = 0
    if '<div id="list_limited" class="list_set">' in line:
        current_status = 1

    pattern = r'<input type="hidden" class="link_value" value="/yugiohdb/card_search\.action\?ope=\d+&cid=(\d+)">'
    match = re.search(pattern, line)
    if match and current_status >= 0:
        cid = match.group(1)
        output_data["regulation"][cid] = current_status


with open('banlist.json', 'w') as fp:
    json.dump(output_data, fp)


