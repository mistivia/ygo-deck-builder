<script>
    import { isLoading } from '../loading';
    import { currentTranslations } from '../language';
</script>

{#if $isLoading}
    <div id="loading">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <br>
            <p>{$currentTranslations.loading}</p>
        </div>
    </div>
{/if}


<style>
    /* 全屏 loading 样式 */
    #loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9); /* 半透明背景 */
        z-index: 9999; /* 确保在最前面 */
        display: block; /* 默认隐藏 */
    }

    /* loading 内容区域 */
    .loading-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    /* loading 动画 */
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
