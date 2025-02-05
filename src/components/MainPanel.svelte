<script lang="ts">

import CardThumb from './CardThumb.svelte';

let mainDeck = $state([]);
let extraDeck = $state([]);
let sideDeck = $state([]);
let mainNum = $derived(mainDeck.length);
let extraNum = $derived(extraDeck.length);
let sideNum = $derived(sideDeck.length);

</script>

<div class="middle-panel">
    <div class="control-bar">
        <button class="btn">打开</button>
        <button class="btn">保存</button>
    </div>
    <div class="deck-section">
        <div class="deck-group">
            <h3>主卡组（{mainNum}）</h3>
            <div class="card-grid main-deck">
                    <div class="card-grid-thumb">
                        <CardThumb id="89631139" />
                    </div>
                {#each mainDeck as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>额外卡组（{extraNum}）</h3>
            <div class="card-grid extra-deck">
                {#each extraDeck as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>副卡组（{sideNum}）</h3>
            <div class="card-grid side-deck">
                {#each sideDeck as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} />
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
