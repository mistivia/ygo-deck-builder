<script lang="js">
    import CardThumb from './CardThumb.svelte';
    import { deck, setDeck, deckOps } from '../control/deck';
    import {
        parseYdk,
        genYdk,
        genYdke,
        downloadStringAsFile,
    } from '../utils';

    let fileInput;
    
    function openDeck() {
        fileInput.click();
    }

    function loadDeck(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                let content = event.target.result;
                setDeck(parseYdk(content));
            };
            reader.readAsText(file); 
        }
    }

    function saveDeck() {
        let deckString = genYdk($deck);
        downloadStringAsFile('mydeck.ydk', deckString)
    }

    function copyDeck() {
        let deckString = genYdk($deck);
        navigator.clipboard.writeText(deckString)
            .then(() => {
              alert('YDK卡组码已复制到剪贴板');
            })
            .catch(err => {
              alert("失败！");
            });
    }

    function shareDeck() {
        let url = window.location.href;
        url = url.split('#')[0]
        url = url + '#' + genYdke($deck);
        navigator.clipboard.writeText(url)
            .then(() => {
              alert('分享链接已复制到剪贴板');
            })
            .catch(err => {
              alert("失败！");
            });
    }

    function onDrop(to, event) {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text'));
        let from = data.area;
        if (from === 'search') {
            if (to === 'main') {
                deckOps.add2main(data.id);
            } else if (to === 'side') {
                deckOps.add2side(data.id);
            } else if (to === 'extra') {
                deckOps.add2extra(data.id);
            }
        } else if (from === 'main') {
            if (to == 'side') {
                deckOps.main2side(data.id);
            }
        } else if (from === 'extra') {
            if (to == 'side') {
                deckOps.extra2side(data.id);
            }
        } else if (from === 'side') {
            if (to == 'main') {
                deckOps.side2main(data.id);
            } else if (to == 'extra') {
                deckOps.side2extra(data.id);
            }
        }
    }


</script>

<input bind:this={fileInput} style="display:none;" onchange={loadDeck} type="file" class="file-input" accept=".ydk" />

<div class="middle-panel">
    <div class="control-bar">
        <button class="btn" onclick={openDeck}>打开</button>
        <button class="btn" onclick={saveDeck}>保存</button>
        <button class="btn" onclick={copyDeck}>复制到剪贴板</button>
        <button class="btn" onclick={shareDeck}>分享</button>
    </div>
    <div class="deck-section">
        <div class="deck-group">
            <h3>主卡组（{$deck.main.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("main", e)} class="card-grid main-deck">
                {#each $deck.main as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} area="main" />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>额外卡组（{$deck.extra.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("extra", e)} class="card-grid extra-deck">
                {#each $deck.extra as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} area="extra" />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>副卡组（{$deck.side.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("side", e)} class="card-grid side-deck">
                {#each $deck.side as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} area="side" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>

.middle-panel {
    width: 55%;
    padding: 20px;
    background-color: #fff;
    overflow-y: auto;
}

.control-bar {
    margin-bottom: 20px;
}

.btn {
    padding: 8px 20px;
    margin-right: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.deck-group {
    margin-bottom: 30px;
}

.deck-group h3 {
    margin-bottom: 10px;
    color: #333;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
    gap: 5px;
    grid-auto-flow: dense;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 80px;
}

.card-grid-thumb {
    background-color: #eee;
    aspect-ratio: 1/1.4;
    border-radius: 5px;
}


</style>
