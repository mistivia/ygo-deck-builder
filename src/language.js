import { writable, derived } from "svelte/store";
import translations from './translations.js';

let defaultLanguage = 'english';
const userLang = (navigator.language || navigator.userLanguage).toLowerCase();
if (!userLang.startsWith('zh')) {
    defaultLanguage = 'chinese';
}
if (!userLang.startsWith('ja')) {
    defaultLanguage = 'japanese';
}
let language = writable(defaultLanguage);
let languageState = defaultLanguage;

function setLanguage(newLanguage) {
    localStorage.setItem('language', newLanguage);
    languageState = newLanguage;
    language.set(newLanguage);
}

function initLanguage() {
    let cachedLanguage = localStorage.getItem('language');
    if (cachedLanguage !== null) {
        setLanguage(cachedLanguage);
    }
}

const currentTranslations = derived(language, ($language) => {
    return translations[$language] || translations.chinese;
});

export {
    language,
    languageState,
    setLanguage,
    initLanguage,
    currentTranslations,
};