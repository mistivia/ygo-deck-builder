<script lang="js">
    import { setLeftPanelCard, showMobileInfo } from '../left_panel';
    import { cardImageUrl } from '../utils';
    import { currentTranslations } from '../language';
    import { deckOps } from '../deck';
    import { getCardDb } from '../card_db';

    let {id, area, idx, limitNum} = $props();

    function onhover() {
        setLeftPanelCard(id, $currentTranslations.key); 
    }

    function onDragStart(e) {
        e.dataTransfer.setData('text', JSON.stringify({id, area, idx}))
    }

    function adjustCardCount(e) {
      e.preventDefault();

      if (area !== 'search') {
        deckOps.deleteCard(area, idx)
        return;
      }

      const cardDB = getCardDb();
      const isExtra = cardDB[id]?.isExtra;

      if (isExtra) {
        deckOps.add2extra(id, -1);
      } else {
        deckOps.add2main(id, -1);
      }
    }

    function thumbImage(id) {
        let url = cardImageUrl(id)
        if (url.includes('ygopro-super-pre')) {
            return url;
        }
        return url + '!thumb2';
    }
</script>

{#if id}
   <img
       style="margin:2px;"
       draggable="true"
       onmouseover={onhover}
       onfocus={onhover}
       ondragstart={onDragStart}
       onclick={()=>{onhover();showMobileInfo();}}
       oncontextmenu={adjustCardCount}
       height="100%"
       src={thumbImage(id)}
       alt="yugioh card {id}"
   />
   {#if limitNum > 0}
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
        font-size: 13px;
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
