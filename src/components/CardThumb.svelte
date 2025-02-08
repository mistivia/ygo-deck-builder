<script lang="js">

    import {setLeftPanelCard} from '../control/left_panel';

    let {id, area} = $props();

    function onhover() {
        setLeftPanelCard(id); 
    }

    function onDragStart(e) {
        e.dataTransfer.setData('text', JSON.stringify({id, area}))
    }

</script>

{#if id}
    <img
        draggable="true"
        onmouseover={onhover}
        onfocus={onhover}
        ondragstart={onDragStart}
        height="100%"
        src="https://cdn.233.momobako.com/ygopro/pics/{id}.jpg"
        alt="yugioh card {id}"
    />
{/if}

<style>



</style>
