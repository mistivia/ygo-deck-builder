<script lang="js">
    import CardThumb from './CardThumb.svelte';
    import { deck, setDeck } from '../control/deck';
    import { parseYdk } from '../utils'

    let fileInput;
    
    let openDeck = () => {
        fileInput.click();
    };

    let loadDeck = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                let content = event.target.result;
                setDeck(parseYdk(content));
            };
            reader.readAsText(file); 
        }
    };

</script>

<input bind:this={fileInput} style="display:none;" onchange={loadDeck} type="file" class="file-input" accept=".ydk" />

<div class="middle-panel">
    <div class="control-bar">
        <button class="btn" onclick={openDeck}>打开</button>
        <button class="btn">保存</button>
    </div>
    <div class="deck-section">
        <div class="deck-group">
            <h3>主卡组（{$deck.main.length}）</h3>
            <div class="card-grid main-deck">
                {#each $deck.main as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>额外卡组（{$deck.extra.length}）</h3>
            <div class="card-grid extra-deck">
                {#each $deck.extra as card}
                    <div class="card-grid-thumb">
                        <CardThumb id={card} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="deck-group">
            <h3>副卡组（{$deck.side.length}）</h3>
            <div class="card-grid side-deck">
                {#each deck.side as card}
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
