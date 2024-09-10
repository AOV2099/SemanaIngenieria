<script>
  import EventCreator from './routes/EventCreator.svelte';
  import LoginPage from './routes/LoginPage.svelte';
  import Scanner from './routes/Scanner.svelte';
  import {Router, Route, Link} from 'svelte-routing';
  import UserEvents from './routes/UserEvents.svelte';
  import { Toaster } from "svelte-french-toast";

</script>

<Router>
      <Route path="/login" component={LoginPage} />
      <Route path="/scanner-event-qr" component={Scanner} />
      <Route path="/create-event-admin" component={EventCreator} />
      <Route path="/events" component={UserEvents} />

  </Router>


<Toaster />
<style>
</style>
