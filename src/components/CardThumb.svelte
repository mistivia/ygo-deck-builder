<script lang="ts">
    let {id} = $props()
</script>

<div class="card-thumbnail">
    {#if id}
        <img height="100%" src="https://cdn.233.momobako.com/ygopro/pics/{id}.jpg!half" alt="yugioh card {id}">
    {/if}
</div>

<style>

.card-thumbnail {
    width: 50px;
    height: 70px;
    background-color: #eee;
    margin-right: 10px;
    border-radius: 3px;
}

</style>
