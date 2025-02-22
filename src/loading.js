import { writable } from 'svelte/store';
import { initSearch } from './search';
import { initDeck } from './deck';
import { setCardDb, setAltId } from './card_db';

let isLoading = writable(true);

async function fetchCardDb() {
    let localVer = localStorage.getItem('card_db_ver');
    try {
        // load card db
        let response = await fetch("https://raye.mistivia.com/card_db_parts/version.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        data = String(data)
        if (localVer === data && localStorage.getItem('card_db') !== null) {
            setCardDb(JSON.parse(localStorage.getItem('card_db')));
        } else {
            localVer = data;
            response = await fetch("https://raye.mistivia.com/card_db_parts/index.json");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            let tasks = data.map((i)=>fetch('https://raye.mistivia.com/card_db_parts/' + i));
            let datas = await Promise.all(tasks);
            datas = await Promise.all(datas.map((x) => x.text()));
            data = JSON.parse(datas.join(''));
            setCardDb(data);
            localStorage.setItem('card_db_ver', localVer);
            localStorage.setItem('card_db', datas.join(''));
        }

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
