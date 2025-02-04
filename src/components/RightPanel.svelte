<script lang="ts">

import CardThumb from './CardThumb.svelte';

let cardList = $state([]);

</script>

<div class="right-panel">
    <div class="search-bar">
        <input type="text" placeholder="搜索卡牌...">
    </div>
    <div class="card-list">
        {#if cardList.length > 0}
            <div class="card-item">
                {#each cardList as card}
                    <CardThumb id= {card.id} />
                    <span>{card.name}</span>
                {/each}
            </div>
        {/if}
    </div>
    <div class="pagination">
        <button class="page-btn">上一页</button>
        <button class="page-btn">下一页</button>
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

</style>
