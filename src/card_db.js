import ocgBanList from "./ocg_banlist.json";
import tcgBanList from "./tcg_banlist.json";
import cnocgBanList from './cnocg_banlist.json';
import mdBanList from './md_banlist.json';

let cardDb = {};
let altId = {};
let banList = {
    none: {
        ban: [],
        limit: [],
        semiLimit: [],
    },
    ocg: ocgBanList,
    cnocg: cnocgBanList,
    md: mdBanList,
    tcg: tcgBanList,
};

function cardLimit(id, env) {
    let lst = banList[env];
    if (lst.ban.includes(id)) return 0;
    if (lst.limit.includes(id)) return 1;
    if (lst.semiLimit.includes(id)) return 2;
    return 3;
}

function setCardDb(d) {
    cardDb = d;
}

function getCardDb() {
    return cardDb;
}

function getAltId() {
    return altId;
}

function setAltId(x) {
    altId = x;
}

export {
    getCardDb,
    setCardDb,
    getAltId,
    setAltId,
    cardLimit,
};
