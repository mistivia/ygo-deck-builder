import { writable } from 'svelte/store';
import { cardImageUrl } from './utils';
import { currentTranslations } from './language';
import { get } from 'svelte/store';

let leftPanelCardId = writable('');
let leftPanelCardDesc = writable('');
let leftPanelCardRuby = writable('');
let isMobileInfoVisible = writable(false);
let leftPanelCardImgUrl = writable('');

let curVersion = 0;
let rubyCache = new Map();
let descCache = {};
descCache.cn = new Map();
descCache.en = new Map();
descCache.jp = new Map();

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
    leftPanelCardDesc.set('Loading...');
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

function toEnglish(meta) {
    let ret = "";
    ret += meta.name.en + '\n';
    if (meta.card_type === 'Monster') {
        if (meta.hasOwnProperty('monster_type_line')) {
            ret += '[' + meta.monster_type_line + '] '
        }
        if (meta.hasOwnProperty('attribute')) {
            ret += meta.attribute + ' ';
        }
        ret += '\n'
        if (meta.hasOwnProperty('level')) {
            ret += 'Level ' + meta.level.toString();
        }
        if (meta.hasOwnProperty('rank')) {
            ret += 'Rank ' + meta.rank.toString();
        }
        if (meta.hasOwnProperty('link_arrows')) {
            ret += 'Link ' + meta.link_arrows.length.toString();
        }
        if (meta.hasOwnProperty('atk')) {
            ret += ' | ATK ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('def')) {
            ret += ' | DEF ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('link_arrows')) {
            ret += ' | [' + meta.link_arrows.join(' ') + ']'
        }
        if (meta.hasOwnProperty('pendulum_scale')) {
            ret += ' | P' + meta.pendulum_scale.toString();
        }
        if (meta.hasOwnProperty('pendulum_effect')) {
            ret += '\n---\n' + meta.pendulum_effect.en + '\n---';
        }
        ret += '\n'
    } else {
        ret += '[' + meta.card_type;
        if (meta.hasOwnProperty('property')) {
            ret += ' / ' + meta.property;
        }
        ret += ']\n';
    }
    ret += meta.text.en;

    return [ret, ''];
}

function toJapanese(meta) {
    let ruby = '';
    let ret = '';
    ruby = meta.name.ja;
    if (meta.card_type === 'Monster') {
        if (meta.hasOwnProperty('monster_type_line')) {
            ret += '[' + meta.monster_type_line + '] '
        }
        if (meta.hasOwnProperty('attribute')) {
            ret += meta.attribute + ' ';
        }
        ret += '\n'
        if (meta.hasOwnProperty('level')) {
            ret += 'Level ' + meta.level.toString();
        }
        if (meta.hasOwnProperty('rank')) {
            ret += 'Rank ' + meta.rank.toString();
        }
        if (meta.hasOwnProperty('link_arrows')) {
            ret += 'Link ' + meta.link_arrows.length.toString();
        }
        if (meta.hasOwnProperty('atk')) {
            ret += ' | ATK ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('def')) {
            ret += ' | DEF ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('link_arrows')) {
            ret += ' | [' + meta.link_arrows.join(' ') + ']'
        }
        if (meta.hasOwnProperty('pendulum_scale')) {
            ret += ' | P' + meta.pendulum_scale.toString();
        }
        if (meta.hasOwnProperty('pendulum_effect')) {
            ret += '\n---\n' + meta.pendulum_effect.ja + '\n---';
        }
        ret += '\n'
    } else {
        ret += '[' + meta.card_type;
        if (meta.hasOwnProperty('property')) {
            ret += ' / ' + meta.property;
        }
        ret += ']\n';
    }
    ret += meta.text.ja;
    
    return [ret, ruby];
}

function cardJsonToText(meta, lang) {
    try {
        if (lang === 'en')
            return toEnglish(meta);
        else
            return toJapanese(meta);
    } catch(e) {
        console.log(e);
        return "Err!";
    }
}

function setDesc(version, id) {
    let lang = get(currentTranslations).key;
    leftPanelCardRuby.set('');
    if (rubyCache.has(id) && lang === 'jp') {
        leftPanelCardRuby.set(rubyCache.get(id));
    }
    if (descCache[lang].has(id)) {
        leftPanelCardDesc.set(descCache[lang].get(id));
        return;
    }
    if (lang === 'cn') {
        let descUrl = 'https://raye.mistivia.com/cardtext/' + id + '.txt';
        fetch(descUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); 
            })
            .then((desc) => {
                descCache[lang].set(id, desc);
                if (version === curVersion) {
                    leftPanelCardDesc.set(desc);
                }
            })
            .catch((error) => {
                console.error('Error fetching the file:', error);
            });
    } else {
        let descUrl = 'https://raye.mistivia.com/cardtext/' + id.padStart(8, '0') + '.json';
        fetch(descUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((descJson) => {
                let ret = cardJsonToText(descJson, lang);
                let ruby = ret[1];
                let desc = ret[0];
                descCache[lang].set(id, desc);
                if (ruby !== '') {
                    rubyCache.set(id, ruby);
                }
                if (version === curVersion) {
                    leftPanelCardRuby.set(ruby);
                    leftPanelCardDesc.set(desc);
                }
            })
            .catch((error) => {
                console.error('Error fetching the file:', error);
            });
    }
}

export {
    leftPanelCardId,
    leftPanelCardDesc,
    setLeftPanelCard,
    showMobileInfo,
    closeMobileInfo,
    isMobileInfoVisible,
    leftPanelCardImgUrl,
    leftPanelCardRuby
};
