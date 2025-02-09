<script lang="js">

    import {setLeftPanelCard} from '../control/left_panel';
    import { cardImageUrl } from '../utils';

    let {id, area, idx} = $props();

    function onhover() {
        setLeftPanelCard(id); 
    }

    function onDragStart(e) {
        e.dataTransfer.setData('text', JSON.stringify({id, area, idx}))
    }

</script>

{#if id}
    <img
        style="margin:2px;"
        draggable="true"
        onmouseover={onhover}
        onfocus={onhover}
        ondragstart={onDragStart}
        height="100%"
        src={cardImageUrl(id)}
        alt="yugioh card {id}"
    />
{/if}

<style>



</style>
