<script lang="ts">

import {setLeftPanelCard} from '../control/left_panel.svelte.js';

let {id} = $props();

function onhover() {
    setLeftPanelCard(id); 
}

</script>

{#if id}
    <img
        onmouseover={onhover}
        onfocus={onhover}
        height="100%"
        src="https://cdn.233.momobako.com/ygopro/pics/{id}.jpg!half"
        alt="yugioh card {id}"
    />
{/if}

<style>

.card-thumbnail {
    width: 50px;
    height: 70px;
    background-color: #eee;
    margin-right: 10px;
    border-radius: 3px;
}

</style>
