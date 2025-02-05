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
    let ydkContent = '#created by ygodeck.mistivia.com\n';

    ydkContent += '#main\n';
    ydkContent += deck.main.join('\n') + '\n';

    ydkContent += '#extra\n';
    ydkContent += deck.extra.join('\n') + '\n';

    ydkContent += '!side\n';
    ydkContent += deck.side.join('\n') + '\n';

    return ydkContent;
}

function downloadStringAsFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}


export {
    parseYdk,
    genYdk,
    downloadStringAsFile,
};

