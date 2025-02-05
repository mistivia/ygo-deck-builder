<script lang="ts">

import {setLeftPanelCard} from '../control/left_panel';

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



</style>
