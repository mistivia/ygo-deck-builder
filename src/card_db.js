let cardDb = {};
let altId = {};

function setCardDb(d) {
    cardDb = d;
}

function getCardDb() {
    return cardDb;
}

function getAltId() {
    return altId;
}

function setAltId(x) {
    altId = x;
}

export {
    getCardDb,
    setCardDb,
    getAltId,
    setAltId,
};
