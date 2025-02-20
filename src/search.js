import { writable } from 'svelte/store';
import { getCardDb } from './card_db';

let showingCards = writable([]);
let resultCards = [];

let curVer = 0;
let curPage = 0;

function showCards() {
    showingCards.set(resultCards.slice(curPage * 10, curPage * 10 + 10));
}

function changeInput(query) {
    curVer += 1;
    query = query.split(' ');
    setTimeout(()=>{doSearch(curVer, query)}, 0);
}

function doSearch(ver, query) {
    let cardDb = getCardDb();
    let result = [];
    for (let key in cardDb) {
        if (ver !== curVer) {
            return;
        }
        let hit = true;
        for (let word of query) {
            let matched = false;
            for (let name of cardDb[key].names) {
                if (name.toLowerCase().includes(word.toLowerCase())) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                hit = false;
                break;
            }
        }
        if (hit) {
            result.push({"id": key, "name": cardDb[key].names[0]})
        }
    }
    if (ver !== curVer) return;
    result.sort((a, b) => {
        return cardDb[a.id].cid - cardDb[b.id].cid;
    });
    resultCards = result;
    curPage = 0;
    showCards();
}

function initSearch() {
    doSearch(curVer, "");
}

function onPrevPage() {
    if (curPage > 0) {
        curPage -= 1;
        showCards();
    }
}

function onNextPage() {
    if (curPage < Math.floor((resultCards.length - 1) / 10)) {
        curPage += 1;
        showCards();
    }
}


export {
    changeInput,
    onPrevPage,
    onNextPage,
    showingCards,
    initSearch,
};
