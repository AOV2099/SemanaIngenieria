<script>
  import EventCreator from './routes/EventCreator.svelte';
  import LoginPage from './routes/LoginPage.svelte';
  import Scanner from './routes/Scanner.svelte';
  import {Router, Route, Link} from 'svelte-routing';
  import UserEvents from './routes/UserEvents.svelte';

</script>

<Router>
      <Route path="/login" component={LoginPage} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/create" component={EventCreator} />
      <Route path="/events" component={UserEvents} />

  </Router>
<style>
</style>
