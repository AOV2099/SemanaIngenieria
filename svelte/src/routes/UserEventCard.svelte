<script>
  import { onMount } from "svelte";

  export let event = {
    id: 1,
    name: "Evento de prueba 1",
    date: "2021-10-10",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "loremp ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi.",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 1",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  };

  export let color = "#85c1e9";

  export let userId = 1;

  const nombreDia = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const numeroDia = new Date(event.date).toLocaleDateString("es-ES", {
    day: "numeric",
  });

  const nombreMes = new Date(event.date).toLocaleDateString("es-ES", {
    month: "long",
  });

  function openDetailModal() {
    console.log("Opening modal");
    var detailModal = new bootstrap.Modal(
      document.getElementById("detail-modal"),
      {
        keyboard: false,
      }
    );
    detailModal.show();
  }

  function incribirEvento() {
    console.log("Inscribiendo");
  }

  onMount(() => {
    //cardClickListener();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- <button
  class="main-card-container"
  style="background-color: {color};"
  on:click={() => {
    openDetailModal();
  }}
> -->
<div class="main-card-container" style="background-color: {color};">
  <!--fecha de evento-->
  <div class="d-flex justify-content-between">
    <div class="info-box">
      {nombreDia.toUpperCase()}
      {numeroDia.toUpperCase()}
    </div>

    <div class="info-box">
      {event.start_time} - {event.end_time} hrs.
    </div>
  </div>

  <!--Nombre de evento-->
  <div class="event-name">
    {event.name.toUpperCase()}
  </div>
  <div class="d-flex justify-content-start">
    <p class="event-info">
      {event.career} <br />
      {event.location} <br />
      {event.exponent}
    </p>
  </div>
  <div class="d-flex justify-content-between">
    <p class="event-info" style="font-weight: 700; margin-top:8px">
      <span style="font-weight: 300;"> Asistentes: </span>
      {event.attendees} / {event.max_attendees}
    </p>

    <button
      class="btn btn-light"
      on:click={() => {
        incribirEvento();
      }}
      >Inscribirse</button> 
  </div></div
>

<!--<div class="d-flex justify-content-center">
    <button
    class="expand-btn"
      on:click={() => {
        openDetailModal();
      }}
    >
      <i class="bi bi-chevron-double-down"></i>
    </button>
  </div>-->

<!-- Button trigger modal -->

<!-- Modal -->
<div
  class="modal fade modal-dialog-scrollable"
  id="detail-modal"
  tabindex="-1"
  aria-labelledby="detail-modalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detail-modalLabel">{event.name}</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <!--badges para los horarios-->
        <div class="">
          <span class="badge bg-primary"
            >{nombreDia} {numeroDia} de {nombreMes}</span
          >
          <span class="badge bg-success"
            >{event.start_time} - {event.end_time} hrs.</span
          >
          <span class="badge bg-secondary">{event.location}</span>

          <span class="badge bg-info">{event.attendees} / {event.max_attendees}</span>
          <span class="badge bg-warning">{event.career}</span>

        </div>
        <hr>

        <div>
            <h5>Exponente:</h5>
            <p>{event.exponent}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cerrar</button
        >
        <button type="button" class="btn btn-primary">Inscribirse</button>
      </div>
    </div>
  </div>
</div>

<style>
  .expand-btn {
    background-color: transparent;
    border: none;
    color: #000;
  }

  .main-card-container {
    border-radius: 12px;
    margin: 8px;
    max-height: 300px;
    padding: 18px;
  }

  .info-box {
    border-radius: 50px;
    color: white;
    border: 1px solid white;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 6px;
    padding-bottom: 6px;
    font-weight: 200;
  }

  .event-name {
    color: white;
    font-size: 25pt;
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: 400;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }

  .event-info {
    color: white;
    font-size: 15pt;
    font-weight: 200;
    text-align: left;
  }
  .badge {
    margin-bottom: 4px;
  }
</style>
