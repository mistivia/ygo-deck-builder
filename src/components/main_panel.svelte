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
    import { language, setLanguage, currentTranslations } from '../language';

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
              alert($currentTranslations.ydkCopied);
            })
            .catch(err => {
              alert($currentTranslations.failed);
            });
    }

    function shareDeck() {
        let url = window.location.href;
        url = url.split('#')[0]
        url = url + '#' + genYdke($deck);
        navigator.clipboard.writeText(url)
            .then(() => {
              alert($currentTranslations.shareLinkCopied);
            })
            .catch(err => {
              alert($currentTranslations.failed);
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
        <button class="btn" onclick={openDeck}>{$currentTranslations.open}</button>
        <button class="btn" onclick={saveDeck}>{$currentTranslations.save}</button>
        <button class="btn" onclick={clearDeck}>{$currentTranslations.clear}</button>
        <button class="btn" onclick={copyDeck}>{$currentTranslations.copyToClipboard}</button>
        <button class="btn" onclick={shareDeck}>{$currentTranslations.share}</button>
        <select bind:value={$language} class="select-language" id="language" onchange={()=>setLanguage($language)}>
            <option value="chinese">中文</option>
            <option value="english">English</option>
            <option value="japanese">日本語</option>
        </select>
        <select bind:value={$format} class="select-format" id="format" onchange={()=>setFormat($format)}>
            <option value="none">{$currentTranslations.noLimit}</option>
            <option value="ocg">OCG</option>
            <option value="tcg">TCG</option>
            <option value="md">{$currentTranslations.masterDuel}</option>
            <option value="cnocg">{$currentTranslations.cnSimplified}</option>
            <option value="genesys">Genesys</option>
        </select>
        {#if $format === 'genesys'}
            <span>{$currentTranslations.points}{$deck.point} </span>
        {/if}

    </div>
    <div class="deck-section">
        <div class="deck-group">
            <h3>{$currentTranslations.mainDeck}（{$deck.main.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("main", e, -1)} class="card-grid main-deck">
                {#each $deck.main as card, i}
                    <div class="card-grid-thumb" role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("main", e, i)}>
                        <CardThumb id={card} idx={i} area="main" limitNum={cornerMark(card, $format)} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>{$currentTranslations.extraDeck}（{$deck.extra.length}）</h3>
            <div role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("extra", e, -1)} class="card-grid extra-deck">
                {#each $deck.extra as card, i}
                    <div class="card-grid-thumb" role="region" ondragover={(e)=>e.preventDefault()} ondrop={(e)=>onDrop("extra", e, i)}>
                        <CardThumb id={card} idx={i} area="extra" limitNum={cornerMark(card, $format)} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>{$currentTranslations.sideDeck}（{$deck.side.length}）</h3>
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
    
    
    .select-format,
    .select-language {
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
