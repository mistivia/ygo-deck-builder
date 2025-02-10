import { writable } from "svelte/store";
import { parseYdke } from '../utils';
import { getCardDb } from '../data/cardDb';

let deck = writable({main: [], extra: [], side: []});
let deckState = {main: [], extra: [], side: []};

function sanitizeDeck(deck) {
    let cardDb = getCardDb();
    let ret = [];
    for (let id of deck) {
        if (cardDb[id] !== undefined) {
            ret.push(id);
        }
    }
    return ret;
}

function setDeck(d) {
    d.main = sanitizeDeck(d.main);
    d.side = sanitizeDeck(d.side);
    d.extra = sanitizeDeck(d.extra);
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
        console.log(targetIdx);
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
    let cachedDeck = localStorage.getItem('cachedDeck');
    if (cachedDeck !== null) {
        cachedDeck = JSON.parse(cachedDeck); 
        setDeck(cachedDeck)
        return;
    }
}

export {
    deck,
    setDeck,
    deckOps,
    initDeck,
};

