import { writable } from 'svelte/store';
import { initSearch } from './search';
import { initDeck } from './deck';
import { setCardDb, setAltId } from '../data/cardDb';

let isLoading = writable(true);

async function fetchCardDb() {
    try {
        // load card db
        let response = await fetch("https://raye.mistivia.com/card_db_parts/index.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        let tasks = data.map((i)=>fetch('https://raye.mistivia.com/card_db_parts/' + i));
        let datas = await Promise.all(tasks);
        datas = await Promise.all(datas.map((x) => x.text()));
        data = JSON.parse(datas.join(''));
        setCardDb(data);
        // load alt id
        response = await fetch("https://ygocdb.com/api/v0/idChangelog.jsonp");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        setAltId(data);
    } catch (error) {
        console.log(error);
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
