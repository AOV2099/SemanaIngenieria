<script>
    export let handler
    const rowCount = handler.getRowCount()
</script>

<aside>
    {#if $rowCount.total > 0}
        Mostrando <b>{$rowCount.start}</b>
        a <b>{$rowCount.end}</b>
        de <b>{$rowCount.total}</b>
    {:else}
        Sin resultados
    {/if}
</aside>

<style>
    aside{
        color:#616161;
        line-height:32px;
        font-size:14px;
    }
</style>
