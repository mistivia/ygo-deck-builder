<script lang="js">

    import {setLeftPanelCard} from '../control/left_panel';
    import { cardImageUrl } from '../utils';

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
        src={cardImageUrl(id)}
        alt="yugioh card {id}"
    />
{/if}

<style>



</style>
