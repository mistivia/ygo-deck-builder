import { writable } from 'svelte/store';
import { cardImageUrl } from './utils';

let leftPanelCardId = writable('');
let leftPanelCardDesc = writable('');
let isMobileInfoVisible = writable(false);
let leftPanelCardImgUrl = writable('');

let curVersion = 0;
let descCache = new Map();

function showMobileInfo() {
    isMobileInfoVisible.set(true);
}

function closeMobileInfo() {
    isMobileInfoVisible.set(false);
}

function preloadImage(url, callback, errorCallback) {
    const img = new Image();
    img.onload = () => {
        if (typeof callback === 'function') {
            callback(img);
        }
    };
    img.src = url;
}


function setLeftPanelCard(id, lang) {
    leftPanelCardId.set(id);
    leftPanelCardImgUrl.set('');
    curVersion += 1;
    leftPanelCardDesc.set('加载中...');
    let ver = curVersion;
    setDesc(ver, id);
    let url = '';
    if (lang == 'cn') {
        url = cardImageUrl(id);
    } else if (lang == 'en') {
        url = 'https://images.ygoprodeck.com/images/cards/' + id + '.jpg';
    } else if (lang == 'jp') {
        url = 'https://images.ygoprodeck.com/images/cards/' + id + '.jpg';
    }
    preloadImage(url, () => {
        leftPanelCardImgUrl.set(url);
    });
}

function setDesc(version, id) {
    if (descCache.has(id)) {
        leftPanelCardDesc.set(descCache.get(id));
        return;
    }
    let descUrl = 'https://raye.mistivia.com/cardtext/' + id + '.txt';
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
    showMobileInfo,
    closeMobileInfo,
    isMobileInfoVisible,
    leftPanelCardImgUrl,
};
