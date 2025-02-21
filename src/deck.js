import { writable } from "svelte/store";
import { parseYdke } from './utils';
import { getCardDb, getAltId, cardLimit } from './card_db';

let deck = writable({main: [], extra: [], side: []});
let deckState = {main: [], extra: [], side: []};

let defaultFormat = 'none';
let format = writable(defaultFormat);
let formatState = defaultFormat;

function sanitizeDeck(cardCnt, deck) {
    let cardDb = getCardDb();
    let altId = getAltId();
    let ret = [];
    for (let id of deck) {
        if (altId[id] !== undefined) {
            id = altId[id];
        }
        if (cardDb[id] === undefined) {
            continue;
        }
        if (!cardCnt.has(id)) {
            cardCnt.set(id, 0);
        }
        if (cardCnt.get(id) >= cardLimit(id, formatState)) {
            continue;
        }
        ret.push(id);
        cardCnt.set(id, cardCnt.get(id) + 1);
    }
    return ret;
}

function setDeck(d) {
    let cardCnt = new Map();
    d.main = sanitizeDeck(cardCnt, d.main);
    d.side = sanitizeDeck(cardCnt, d.side);
    d.extra = sanitizeDeck(cardCnt, d.extra);
    deckState = d;
    deck.set(d);
    localStorage.setItem('cachedDeck', JSON.stringify(d));
};

function canAdd(d, id) {
    let count = 0;
    for (let c of d.main) {
        if (c === id) count += 1;
    }
    for (let c of d.side) {
        if (c === id) count += 1;
    }
    for (let c of d.extra) {
        if (c === id) count += 1;
    }
    if (count + 1 > 3) return false;
    return true;
}

let deckOps = {
    "deleteCard": (from, idx) => {
        if (from === 'main') {
            deckState.main.splice(idx, 1);
            setDeck(deckState);
        } else if (from === 'side') {
            deckState.side.splice(idx, 1);
            setDeck(deckState);
        } else if (from === 'extra') {
            deckState.extra.splice(idx, 1);
            setDeck(deckState);
        }
    },
    "move": (from, to, fromIdx, toIdx) => {
        let cardDb = getCardDb();
        let id = deckState[from][fromIdx];
        if (cardDb[id].isExtra && to === 'main') return;
        if (!cardDb[id].isExtra && to === 'extra') return;
        deckState[from].splice(fromIdx, 1);
        if (toIdx === -1) deckState[to].push(id);
        else deckState[to].splice(toIdx, 0, id);
        setDeck(deckState);
    },
    "add2extra": (id, targetIdx) => {
        let cardDb = getCardDb();
        if (!cardDb[id].isExtra) return;
        let d = deckState;
        if (canAdd(d, id)) {
            if (targetIdx === -1) 
                d.extra.push(id);
            else {
                d.extra.splice(targetIdx, 0, id);
            }
            setDeck(d);
        }
    },
    "add2main": (id, targetIdx) => {
        let cardDb = getCardDb();
        if (cardDb[id].isExtra) return;
        let d = deckState;
        if (canAdd(d, id)) {
            if (targetIdx === -1) 
                d.main.push(id);
            else {
                d.main.splice(targetIdx, 0, id);
            }
            setDeck(d);
        }
    },
    "add2side": (id, targetIdx) => {
        let d = deckState;
        if (canAdd(d, id)) {
            if (targetIdx === -1) 
                d.side.push(id);
            else {
                d.side.splice(targetIdx, 0, id);
            }
            setDeck(d);
        }
    }
};

function initDeck() {
    let url = window.location.href.split('#');
    if (url.length === 2) {
        let deck = parseYdke(url[1]);
        if (deck.main.length > 0 || deck.extra.length > 0 || deck.extra.length > 0) {
            setDeck(deck);
            window.location.href = url[0];
            return;
        }
    }
    let cachedFormat = localStorage.getItem('format');
    if (cachedFormat !== null) {
        setFormat(cachedFormat);
    }
    let cachedDeck = localStorage.getItem('cachedDeck');
    if (cachedDeck !== null) {
        cachedDeck = JSON.parse(cachedDeck); 
        setDeck(cachedDeck)
        return;
    }
}

function setFormat(newFormat) {
    if (newFormat === 'none' || newFormat === 'ocg') {
        localStorage.setItem('format', newFormat);
        formatState = newFormat;
        format.set(newFormat);
        setDeck(deckState);
    }
}

export {
    deck,
    format,
    setFormat,
    setDeck,
    deckOps,
    initDeck,
};

