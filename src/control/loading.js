import { writable } from 'svelte/store';
import { initSearch } from './search';
import { initDeck } from './deck';
import { setCardDb } from '../data/cardDb';

let isLoading = writable(true);

async function fetchCardDb() {
    try {
        const response = await fetch("https://121.40.137.206/ygo-deck-builder/card_db.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCardDb(data);
    } catch (error) {
        alert("加载失败！请刷新重试");
        return;
    }
    isLoading.set(false);
    initDeck();
    initSearch();
}

fetchCardDb();

export {
    isLoading,
};
