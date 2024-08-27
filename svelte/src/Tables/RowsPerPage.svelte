<script>
    export let handler
    const rowsPerPage = handler.getRowsPerPage()
    const options = [5, 10, 15, 20, 50, 100]
</script>


<aside>
    Mostrando
    <select bind:value={$rowsPerPage}>
        {#each options as option}
            <option value={option}>
                {option}
            </option>
        {/each}
    </select>
 
</aside>


<style>
    aside{
        display:flex;
        justify-content:flex-start;
        align-items: center;
        height:32px;
        color:#616161;
    }
    select{
        margin:0 2px;
    }
</style>
        