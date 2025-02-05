<script lang="js">

import {
    leftPanelCardId,
    leftPanelCardDesc,
} from '../control/left_panel.svelte'

</script>

<div class="left-panel">
    <div class="card-preview">
        <div class="card-image-large">
            {#if $leftPanelCardId}
                <img height="100%" src="https://cdn.233.momobako.com/ygopro/pics/{$leftPanelCardId}.jpg" alt="card img">
            {/if}
        </div>
        <div class="card-description">
            <pre class="card-desc-text">{$leftPanelCardDesc}</pre>
        </div>
    </div>
</div>

<style>

.left-panel {
    width: 25%;
    padding: 20px;
    background-color: #f5f5f5;
}

.card-image-large {
    height: 400px;
    text-align: center;
    background-color: #ddd;
    margin-bottom: 20px;
    border-radius: 8px;
}

.card-description {
    line-height: 1.6;
    font-size: 14px;
}

.card-desc-text {
      white-space: pre-wrap;
      word-wrap: break-word;
}

</style>
