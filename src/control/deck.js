import { writable } from "svelte/store";

let deck = writable({main: [], extra: [], side: []});

let setDeck = (d) => {
    deck.set(d);
};

export {
    deck,
    setDeck,
};

