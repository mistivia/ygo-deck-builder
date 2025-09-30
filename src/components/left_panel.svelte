<script lang="js">

    import {
        leftPanelCardId,
        leftPanelCardImgUrl,
        leftPanelCardDesc,
        isMobileInfoVisible,
        closeMobileInfo,
    } from '../left_panel';

    import { cardImageUrl } from '../utils';
    import { currentTranslations } from '../language';


</script>

<div class="left-panel">
    <div class="card-preview">
        <div class="card-image-large">
            {#if $leftPanelCardImgUrl !== ''}
                <img height="100%" src={$leftPanelCardImgUrl} alt="card img">
            {/if}
        </div>
        <div class="card-description">
            <pre class="card-desc-text">{$leftPanelCardDesc}</pre>
            <div style="height:3em;line-height:1.0;overflow:hidden;">
                <div style="break-inside:avoid;"><p style="text-align:center;"><small>
                    <a class="link" href="https://github.com/mistivia/ygo-deck-builder">{$currentTranslations.sourceCode}</a>
                    <br>{$currentTranslations.followMistivia} <a class="link" href="https://mistivia.com">Mistivia</a> {$currentTranslations.thankYou}
                </small></p></div>
            </div>
        </div>
    </div>
</div>

{#if $isMobileInfoVisible}
<div class="overlay">
    <div class="mobile-info">
        <button class="close-btn" onclick={closeMobileInfo}>×</button>
        <div class="content">
            <div class="card-image-large">
                {#if $leftPanelCardId}
                    <img height="100%" src={cardImageUrl($leftPanelCardId)} alt="card img">
                {/if}
            </div>
            <div class="card-description">
                <pre class="card-desc-text">{$leftPanelCardDesc}</pre>
            </div>
        </div>
    </div>
</div>
{/if}

<style>

    .left-panel {
        width: 25%;
        padding: 2vh 20px;
        background-color: #f5f5f5;
    }

    .overlay{
        display: none;
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

    @media screen and (max-width: 768px) {
        .left-panel {
            display: none;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            display: block;
            z-index: 1000;
        }
        .mobile-info {
            background-color: rgba(0, 0, 0, 0);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .close-btn {
            position: absolute;
            right: 30px;
            top: 30px;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background-color: #444;
            color: white;
            cursor: pointer;
            font-size: 24px;
        }

        .close-btn:hover {
            background-color: #666;
            transform: scale(1.1);
        }
        .content {
            width: 100%;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    }

</style>
