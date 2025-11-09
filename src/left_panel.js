import { writable } from 'svelte/store';
import { cardImageUrl } from './utils';
import { currentTranslations } from './language';
import { get } from 'svelte/store';

let leftPanelCardId = writable('89631139');
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

function leftPanelUpdateLang(lang) {
    let id = get(leftPanelCardId);
    setLeftPanelCard(id, lang);
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

const monsterTypeTable = {
    'Divine-Beast': '幻神獣族',
    'Beast-Warrior': '獣戦士族',
    'Creator God': '創造神',
    'Aqua': '水族',
    'Beast': '獣族',
    'Cyberse': 'サイバース族',
    'Dinosaur': '恐竜族',
    'Dragon': 'ドラゴン族',
    'Effect': '効果',
    'Fairy': '天使族',
    'Fiend': '悪魔族',
    'Fish': '魚族',
    'Flip': 'リバース',
    'Fusion': '融合',
    'Gemini': 'デュアル',
    'Illusion': '幻想魔族',
    'Insect': '昆虫族',
    'Link': 'リンク',
    'Machine': '機械族',
    'Normal': '通常',
    'Pendulum': 'ペンデュラム',
    'Plant': '植物族',
    'Psychic': 'サイキック族',
    'Pyro': '炎族',
    'Reptile': '爬虫類族',
    'Ritual': '儀式',
    'Rock': '岩石族',
    'Sea': '海竜族',
    'Serpent': '海竜族',
    'Spellcaster': '魔法使い族',
    'Spirit': 'スピリット',
    'Synchro': 'シンクロ',
    'Thunder': '雷族',
    'Toon': 'トゥーン',
    'Tuner': 'チューナー',
    'Union': 'ユニオン',
    'Warrior': '戦士族',
    'Winged': '鳥獣族',
    'Wyrm': '幻竜族',
    'Xyz': 'エクシーズ',
    'Zombie': 'アンデット族',
};

const monsterAttrTable = {
    'DARK': '闇属性',
    'DIVINE': '神属性',
    'EARTH': '地属性',
    'FIRE': '炎属性',
    'LIGHT': '光属性',
    'WATER': '水属性',
    'WIND': '風属性',
}

function removeRuby(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const rtElements = tempDiv.querySelectorAll('rt');
  rtElements.forEach(rt => rt.remove());
  return tempDiv.textContent;
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
            ret += 'LINK-' + meta.link_arrows.length.toString();
        }
        if (meta.hasOwnProperty('atk')) {
            ret += ' | ATK ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('def')) {
            ret += ' | DEF ' + meta.def.toString();
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

const cardTypeTable = {
    'Spell': '魔法',
    'Trap': '罠カード',
};

const cardPropTable = {
    'Continuous': '永続',
    'Normal': '通常',
    'Equip': '装備',
    'Field': 'フィールド',
    'Ritual': '儀式',
    'Quick-Play': '速攻',
    'Counter': 'カウンター',
};

function toJapanese(meta) {
    let ruby = '';
    let ret = '';
    ruby = meta.name.ja;
    if (meta.card_type === 'Monster') {
        if (meta.hasOwnProperty('monster_type_line')) {
            let types = meta.monster_type_line;
            for (let k in monsterTypeTable) {
                types = types.replace(k, monsterTypeTable[k]);
            }
            ret += '[' + types + '] ';
        }
        if (meta.hasOwnProperty('attribute')) {
            ret += monsterAttrTable[meta.attribute] + ' ';
        }
        ret += '\n'
        if (meta.hasOwnProperty('level')) {
            ret += 'レベル ' + meta.level.toString();
        }
        if (meta.hasOwnProperty('rank')) {
            ret += 'ランク ' + meta.rank.toString();
        }
        if (meta.hasOwnProperty('link_arrows')) {
            ret += 'LINK-' + meta.link_arrows.length.toString();
        }
        if (meta.hasOwnProperty('atk')) {
            ret += ' | ATK ' + meta.atk.toString();
        }
        if (meta.hasOwnProperty('def')) {
            ret += ' | DEF ' + meta.def.toString();
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
        ret += '[' + cardTypeTable[meta.card_type];
        if (meta.hasOwnProperty('property')) {
            ret += ' / ' + cardPropTable[meta.property];
        }
        ret += ']\n';
    }
    let text = meta.text.ja;
    if (text.indexOf('<ruby>') !== -1) {
        text = removeRuby(text);
    }
    ret += text;
    
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

const specialCards = {
    '10000020': 'kdb4999',
    '10000040': 'kdb10112',
    '10000030': 'kdb10113',
    '10000080': 'kdb11927',
    '10000090': 'kdb12234',
    '5405695': 'kdb19092',
    '100238301': 'kdb22185',
    '10000000': 'kdb4998',
    '10000010': 'kdb5000',
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
        let urlId = id;
        if (specialCards.hasOwnProperty(urlId)) {
            urlId = specialCards[urlId];
        } else {
            urlId = urlId.padStart(8, '0');
        }
        let descUrl = 'https://raye.mistivia.com/cardtext/' + urlId + '.json';
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
    leftPanelCardRuby,
    leftPanelUpdateLang,
};
