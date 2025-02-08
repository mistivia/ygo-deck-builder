import { writable } from "svelte/store";
import { parseYdke } from '../utils';
import { cardDb } from '../data/cardDb';

let deck = writable({main: [], extra: [], side: []});
let deckState = {main: [], extra: [], side: []};

function setDeck(d) {
    let sortFn = (a, b) => {return cardDb[a].cid - cardDb[b].cid;}
    d.main.sort(sortFn);
    d.extra.sort(sortFn);
    d.side.sort(sortFn);
    deckState = d;
    deck.set(d);
    localStorage.setItem('cachedDeck', JSON.stringify(d));
};

const OK = 1;
const FAIL = 0;

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

function delCard(deck, id) {
    for (let i = 0; i < deck.length; i++) {
        if (deck[i] == id) {
            deck.splice(i, 1);
            return true;
        }
    }
    return false;
}

let deckOps = {
    "deleteCard": (from, id) => {
        if (from === 'main') {
            delCard(deckState.main, id);
            setDeck(deckState);
        } else if (from === 'side') {
            delCard(deckState.side, id);
            setDeck(deckState);
        } else if (from === 'extra') {
            delCard(deckState.extra, id);
            setDeck(deckState);
        }
    },
    "main2side": (id) => {
        if (delCard(deckState.main, id)) {
            deckState.side.push(id);
        }
        setDeck(deckState);
    },
    "extra2side": (id) => {
        if (delCard(deckState.extra, id)) {
            deckState.side.push(id);
        }
        setDeck(deckState);
    },
    "side2main": (id) => {
        if (cardDb[id].isExtra) return;
        if (delCard(deckState.side, id)) {
            deckState.main.push(id);
        }
        setDeck(deckState);
    },
    "side2extra": (id) => {
        if (!cardDb[id].isExtra) return;
        if (delCard(deckState.side, id)) {
            deckState.extra.push(id);
        }
        setDeck(deckState);
    },
    "add2extra": (id) => {
        if (!cardDb[id].isExtra) return;
        let d = deckState;
        if (canAdd(d, id)) {
            d.extra.push(id);
            setDeck(d);
        }
    },
    "add2main": (id) => {
        if (cardDb[id].isExtra) return;
        let d = deckState;
        if (canAdd(d, id)) {
            d.main.push(id);
            setDeck(d);
        }
    },
    "add2side": (id) => {
        let d = deckState;
        if (canAdd(d, id)) {
            d.side.push(id);
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
            window.location.replace("/");
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

initDeck();

export {
    deck,
    setDeck,
    deckOps,
};

