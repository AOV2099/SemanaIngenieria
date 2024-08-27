<script>
  import UserEventCard from "./UserEventCard.svelte";


</script>
<div id="main-container">

    <UserEventCard />
    <UserEventCard />
    <UserEventCard />
    <UserEventCard />
    <UserEventCard />

</div>

<style>

    #main-container {
        background-color: #212121  ;
        height: 100vh;
        padding: 8px;
        line-height: 0.9;
        overflow: auto;
    }
</style>