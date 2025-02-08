import { writable } from 'svelte/store';

let resultCards = writable([]);

export {
    resultCards,
};
