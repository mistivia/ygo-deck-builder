<script lang="js">
    import { setLeftPanelCard } from '../left_panel';
    import { cardImageUrl } from '../utils';

    let {id, area, idx, limitNum} = $props();

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
   {#if limitNum === 1 || limitNum == 2}
       <div class="overlay">{limitNum}</div>
   {:else if limitNum === 0}
       <div class="ban-overlay"></div>
   {/if}
{/if}

<style>
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        border: 3px solid red;
        border-radius: 50%;
        background-color: black;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: yellow;
        font-size: 15px;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
        pointer-events: none;
    }
    
    .ban-overlay {
        position: absolute;
        top: 0;
        left: 0;
        border: 3px solid red;
        border-radius: 50%;
        background-color: black;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: yellow;
        font-size: 15px;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
        pointer-events: none;
    }

    .ban-overlay::after {
        content: '';
        width: 15px;
        height: 3px;
        background-color: red;
        transform: rotate(45deg);
        position: absolute;
        pointer-events: none;
    }
</style>
