<script>
  import EventCreator from "./routes/EventCreator.svelte";
  import LoginPage from "./routes/LoginPage.svelte";
  import Scanner from "./routes/Scanner.svelte";
  import { Router, Route, Link } from "svelte-routing";
  import UserEvents from "./routes/UserEvents.svelte";
  import { Toaster } from "svelte-french-toast";
</script>

<Router>
  <Route path="/login" component={LoginPage} />
  <Route path="/event-qr-scanner" component={Scanner} />
  <Route path="/admin" component={EventCreator} />
  <Route path="/events" component={UserEvents} />
  <Route path="/" component={LoginPage} />
</Router>

<Toaster />

<style>
</style>
