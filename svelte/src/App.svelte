<script>
  import EventCreator from "./routes/EventCreator.svelte";
  import LoginPage from "./routes/LoginPage.svelte";
  import Scanner from "./routes/Scanner.svelte";
  import { Router, Route, Link } from "svelte-routing";
  import UserEvents from "./routes/UserEvents.svelte";
  import { Toaster } from "svelte-french-toast";
  import { API_URL } from "./store";


  // Si la app corre desde el backend (3000), usa mismo origen.
  // Si corre en dev server de Svelte (ej. 5000), conserva el valor del store
  // para que las peticiones vayan al backend.
  //if (window.location.port === "3000") {
    //API_URL.set(window.location.origin);
  //}
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
