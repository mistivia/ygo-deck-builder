import { writable } from "svelte/store";
import { parseYdke } from '../utils';

let deck = writable({main: [], extra: [], side: []});

function setDeck(d) {
    d.main.sort();
    d.extra.sort();
    d.side.sort();
    deck.set(d);
    localStorage.setItem('cachedDeck', JSON.stringify(d));
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
};

