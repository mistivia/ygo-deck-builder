function parseYdk(ydkContent) {
    const lines = ydkContent.split('\n');
    const deck = {
        main: [],
        extra: [],
        side: [],
    };
    let currentSection = null;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') && !['#main', '#extra'].includes(trimmedLine)) {
            continue;
        }
        if (trimmedLine === '#main') {
            currentSection = 'main';
        } else if (trimmedLine === '#extra') {
            currentSection = 'extra';
        } else if (trimmedLine === '!side') {
            currentSection = 'side';
        } else if (currentSection) {
            const cardId = parseInt(trimmedLine, 10);
            if (!isNaN(cardId)) {
                deck[currentSection].push(String(cardId));
            }
        }
    }
    return deck;
}

function genYdk(deck) {
    let ydkContent = '#created by mistivia.com\n';

    ydkContent += '#main\n';
    ydkContent += deck.main.join('\n') + '\n';

    ydkContent += '#extra\n';
    ydkContent += deck.extra.join('\n') + '\n';

    ydkContent += '!side\n';
    ydkContent += deck.side.join('\n') + '\n';

    return ydkContent;
}

function downloadStringAsFile(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    let filename= `ygodeck_${Date.now()}.ydk`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function ydkeEncode(d) {
    let deck = [];
    for (let card of d) {
        let num = parseInt(card);
        if (isNaN(num)) continue;
        deck.push(num);
    }
    const buffer = new ArrayBuffer(deck.length * 4);
    const view = new DataView(buffer);
    for (let i = 0; i < deck.length; i++) {
        // Little-endian
        view.setUint32(i * 4, deck[i], true);
    }
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function ydkeDecode(encodedDeck) {
    const binaryString = atob(encodedDeck);
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new DataView(buffer);
    for (let i = 0; i < binaryString.length; i++) {
        view.setUint8(i, binaryString.charCodeAt(i));
    }
    const deck = [];
    for (let i = 0; i < buffer.byteLength; i += 4) {
        deck.push(String(view.getUint32(i, true))); // Little-endian
    }
    return deck;
}

function parseYdke(ydkeString) {
    const [mainEncoded, extraEncoded, sideEncoded] = ydkeString.split('!');
    const main = ydkeDecode(mainEncoded);
    const extra = ydkeDecode(extraEncoded);
    const side = ydkeDecode(sideEncoded);
    return { main, extra, side };
}

function genYdke(deck) {
    const mainEncoded = ydkeEncode(deck.main);
    const extraEncoded = ydkeEncode(deck.extra);
    const sideEncoded = ydkeEncode(deck.side);
    return `${mainEncoded}!${extraEncoded}!${sideEncoded}`;
}

function cardImageUrl(id) {
    if (id.length <= 8) {
        return "https://cdn.233.momobako.com/ygopro/pics/" + id + '.jpg';
    }
    return 'https://cdn02.moecube.com:444/ygopro-super-pre/data/pics/' + id + '.jpg';
}

export {
    parseYdk,
    genYdk,
    parseYdke,
    genYdke,
    downloadStringAsFile,
    cardImageUrl,
};

