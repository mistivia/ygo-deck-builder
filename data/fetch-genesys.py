import re
from urllib.request import urlopen

url = "https://www.yugioh-card.com/en/genesys/"
html = urlopen(url).read().decode("utf-8")

inside = False
rows = []

for line in html.splitlines():
    if '<tbody class="row-hover">' in line:
        inside = True
        continue
    if '</tbody>' in line and inside:
        break
    if inside:
        rows.append(line.strip())

pattern = re.compile(r"<td[^>]*>(.*?)</td>")
data = []
for row in rows:
    matches = pattern.findall(row)
    for m in matches:
        text = m.strip()
        if text:
            data.append(text)

for item in data:
    print(item)
