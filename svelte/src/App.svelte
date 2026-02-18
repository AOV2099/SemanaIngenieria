<script>
  import EventCreator from "./routes/EventCreator.svelte";
  import LoginPage from "./routes/LoginPage.svelte";
  import Scanner from "./routes/Scanner.svelte";
  import { Router, Route, Link } from "svelte-routing";
  import UserEvents from "./routes/UserEvents.svelte";
  import { Toaster } from "svelte-french-toast";
  import { API_URL } from "./store";


  //API_URL.set(`${window.location.origin}`);
  //url = origen + puerto del backend
  API_URL.set(window.location.origin + ":3002");
  console.log($API_URL);
  

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
