<script lang="js">
    import CardThumb from './CardThumb.svelte';
    import { changeInput, showingCards, onPrevPage, onNextPage } from '../control/search'
    import { deckOps } from '../control/deck';

    function onChange(event) {
        changeInput(event.target.value);
    }

    function onDrop(event) {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text'));
        if (data.area === 'main' || data.area === 'side' || data.area === 'extra') {
            deckOps.deleteCard(data.area, data.idx);
        }
    }
</script>

<div class="right-panel" role="region" ondragover={(e)=>e.preventDefault()} ondrop={onDrop}>
    <div class="search-bar">
        <input type="text" placeholder="搜索卡牌..." oninput={onChange}>
    </div>
    <div class="card-list">
           {#each $showingCards as card}
               <div class="card-item">
                   <div class="card-thumbnail">
                       <CardThumb id={card.id} idx={-1} area="search" />
                   </div>
                   <span>{card.name}</span>
               </div>
           {/each}
    </div>
    <div class="pagination">
        <button class="page-btn" onclick={onPrevPage}>上一页</button>
        <button class="page-btn" onclick={onNextPage}>下一页</button>
    </div>
</div>


<style>

.right-panel {
    width: 20%;
    padding: 20px;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
}

.search-bar input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.card-list {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 15px;
}

.card-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 5px;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
}

.pagination {
    display: flex;
    gap: 10px;
}

.page-btn {
    flex: 1;
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.card-thumbnail {
    width: 50px;
    height: 70px;
    background-color: #eee;
    margin-right: 10px;
    border-radius: 3px;
}

</style>
