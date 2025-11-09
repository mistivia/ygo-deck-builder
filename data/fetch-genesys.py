import re
from urllib.request import urlopen

url = "https://www.yugioh-card.com/en/genesys/"
html = urlopen(url).read().decode("utf-8")

inside = False
rows = []

for line in html.splitlines():
    if '<td class="column-1">' in line:
        pattern = r'lass="column-1">([^<>]+?)</td>'
        match = re.search(pattern, line)
        if match:
            print(match.group(1).strip())
        else:
            raise RuntimeError("error")
        pattern = r'lass="column-2">([^<>]+?)$'
        match = re.search(pattern, line)
        if match:
            print(match.group(1).strip())
        else:
            raise RuntimeError("error")



