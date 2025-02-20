<script lang="js">

    import {
        leftPanelCardId,
        leftPanelCardDesc,
    } from '../left_panel';

    import { cardImageUrl } from '../utils';


</script>

<div class="left-panel">
    <div class="card-preview">
        <div class="card-image-large">
            {#if $leftPanelCardId}
                <img height="100%" src={cardImageUrl($leftPanelCardId)} alt="card img">
            {/if}
        </div>
        <div class="card-description">
            <pre class="card-desc-text">{$leftPanelCardDesc}</pre>
            <div style="height:3em;line-height:1.0;overflow:hidden;">
                <div style="break-inside:avoid;"><p style="text-align:center;"><small>
                    <a class="link" href="https://github.com/mistivia/ygo-deck-builder">GitHub</a>
                    <br>关注 <a class="link" href="https://mistivia.com">Mistivia</a> 谢谢喵~
                </small></p></div>
            </div>
        </div>
    </div>
</div>

<style>

.left-panel {
    width: 25%;
    padding: 2vh 20px;
    background-color: #f5f5f5;
}

.card-image-large {
    height: 40vh;
    text-align: center;
    background-color: #ddd;
    margin-bottom: 20px;
    border-radius: 8px;
}

.card-description {
    line-height: 1.4;
    font-size: 14px;
    height: 50vh;
}

.card-desc-text {
      height: calc(50vh - 3em); 
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: auto;
}

a.link {
    color: #000000; /* 文本颜色设置为黑色 */
    text-decoration: underline; /* 添加下划线 */
    cursor: pointer; /* 鼠标悬停时显示手形指针 */
}

a.link:visited {
    color: #000000; /* 已访问链接颜色保持黑色 */
}

a.link:hover {
    color: #000000; /* 悬停时颜色不变 */
    text-decoration: underline; /* 悬停时保持下划线 */
}

a.link:active {
    color: #000000; /* 点击时颜色不变 */
}

</style>
