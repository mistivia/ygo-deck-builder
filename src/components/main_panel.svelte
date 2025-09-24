<script lang="js">
    import CardThumb from './card_thumb.svelte';
    import { deck, setDeck, deckOps, format, setFormat, formatState } from '../deck';
    import { cornerMark } from '../card_db';
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

    function clearDeck() {
        setDeck({
            'main': [],
            'extra': [],
            'side': [],
        });
    }

    function saveDeck() {
        let deckString = genYdk($deck);
        downloadStringAsFile(deckString)
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

    function onDrop(to, event, targetIdx) {
        event.preventDefault();
        event.stopPropagation();
        const data = JSON.parse(event.dataTransfer.getData('text'));
        let from = data.area;
        if (from === 'search') {
            if (to === 'main') {
                deckOps.add2main(data.id, targetIdx);
            } else if (to === 'side') {
                deckOps.add2side(data.id, targetIdx);
            } else if (to === 'extra') {
                deckOps.add2extra(data.id, targetIdx);
            }
        } else {
            deckOps.move(from, to, data.idx, targetIdx);
        }
    }




</script>

<input bind:this={fileInput} style="display:none;" onchange={loadDeck} type="file" class="file-input" accept=".ydk" />

<div class="middle-panel">
    <div class="control-bar">
        <button class="btn" onclick={openDeck}>打开</button>
        <button class="btn" onclick={saveDeck}>保存</button>
        <button class="btn" onclick={clearDeck}>清空</button>
        <button class="btn" onclick={copyDeck}>复制到剪贴板</button>
        <button class="btn" onclick={shareDeck}>分享</button>
        <select bind:value={$format} class="select-format" id="format" onchange={()=>setFormat($format)}>
            <option value="none">无禁限</option>
            <option value="ocg">OCG</option>
            <option value="tcg">TCG</option>
            <option value="md">大师决斗</option>
            <option value="cnocg">简中</option>
            <option value="genesys">Genesys</option>
        </select>
        {#if $format === 'genesys'}
            <span>点数：{$deck.point} </span>
        {/if}

    </div>
    <div class="deck-section">
        <div class="deck-group">
            <h3>主卡组（{$deck.main.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("main", e, -1)} class="card-grid main-deck">
                {#each $deck.main as card, i}
                    <div class="card-grid-thumb" role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("main", e, i)}>
                        <CardThumb id={card} idx={i} area="main" limitNum={cornerMark(card, $format)} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>额外卡组（{$deck.extra.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("extra", e, -1)} class="card-grid extra-deck">
                {#each $deck.extra as card, i}
                    <div class="card-grid-thumb" role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("extra", e, i)}>
                        <CardThumb id={card} idx={i} area="extra" limitNum={cornerMark(card, $format)} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>副卡组（{$deck.side.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("side", e, -1)} class="card-grid side-deck">
                {#each $deck.side as card, i}
                    <div class="card-grid-thumb" role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("side", e, i)}>
                        <CardThumb id={card} idx={i} area="side" limitNum={cornerMark(card, $format)} />
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
    @media screen and (max-width: 768px) {
        .middle-panel {
            width: 100%;
        }
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
    
    
    .select-format {
        padding: 8px 8px;
        margin-right: 10px;
        cursor: pointer;
        font-size: 1.1em;
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
        grid-auto-flow: dense;
        overflow-y: auto;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-height: 80px;
    }
    
    .card-grid-thumb {
        position: relative;
        aspect-ratio: 1/1.4;
        border-radius: 5px;
    }


</style>
