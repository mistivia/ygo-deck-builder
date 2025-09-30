import { writable } from 'svelte/store';
import { initSearch } from './search';
import { initDeck } from './deck';
import { initLanguage } from './language';
import { setCardDb, setAltId } from './card_db';
import idChangelog from './id_changelog.json';

let isLoading = writable(true);

async function noCacheFetch(url) {
    const timestamp = new Date().getTime();
    return fetch(url + '?t=' + timestamp);
}

const DB_NAME = 'CardDatabase';
const STORE_NAME = 'cardStore';

async function openidxdb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getidxdbitem(key) {
    let db = await openidxdb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

async function setidxdbitem(key, value) {
    const db = await openidxdb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function fetchCardDb() {
    initLanguage(); // Load language before showing loading screen
    let localVer = localStorage.getItem('card_db_ver');
    try {
        // load card db
        let response = await noCacheFetch("https://raye.mistivia.com/card_db_parts/version.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        data = String(data)
        if (localVer === data && await getidxdbitem('card_db') !== null) {
            setCardDb(JSON.parse(await getidxdbitem('card_db')));
        } else {
            localVer = data;
            response = await noCacheFetch("https://raye.mistivia.com/card_db_parts/index.json");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            let tasks = data.map((i)=>noCacheFetch('https://raye.mistivia.com/card_db_parts/' + i));
            let datas = await Promise.all(tasks);
            datas = await Promise.all(datas.map((x) => x.text()));
            data = JSON.parse(datas.join(''));
            setCardDb(data);
            localStorage.setItem('card_db_ver', localVer);
            await setidxdbitem('card_db', datas.join(''));
        }
        setAltId(idChangelog);
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
