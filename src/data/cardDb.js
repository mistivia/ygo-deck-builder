let cardDb = {};

function setCardDb(d) {
    cardDb = d;
}

function getCardDb() {
    return cardDb;
}

export {
    getCardDb,
    setCardDb,
};
