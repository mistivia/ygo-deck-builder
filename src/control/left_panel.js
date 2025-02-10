import { writable } from 'svelte/store';

let leftPanelCardId = writable('');
let leftPanelCardDesc = writable('');

let curVersion = 0;
let descCache = new Map();

function setLeftPanelCard(id) {
    leftPanelCardId.set(id);
    curVersion += 1;
    leftPanelCardDesc.set('加载中...');
    let ver = curVersion;
    setDesc(ver, id);
}

function setDesc(version, id) {
    if (descCache.has(id)) {
        leftPanelCardDesc.set(descCache.get(id));
        return;
    }
    let descUrl = 'https://oss.nebula.moe/ygo-card-text/' + id + '.txt';
    fetch(descUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); 
        })
        .then((desc) => {
            descCache.set(id, desc);
            if (version === curVersion) {
                leftPanelCardDesc.set(desc);
            }
        })
        .catch((error) => {
            console.error('Error fetching the file:', error);
        });
}

export {
    leftPanelCardId,
    leftPanelCardDesc,
    setLeftPanelCard,
};
