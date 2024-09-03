<script>
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { API_URL, availableCareers, openDetailModal, userModalData } from "../store";
  import qrCode from "qrcode";

  export let event = {
    id: 1,
    name: "Evento de prueba 1",
    date: "2021-10-10",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description:
      "loremp ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi.",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 1",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  };

  let cardStyleData = {
    name: "UNAM",
    color: "#8bc34a",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  };

  function getCardStyleData(){
    //console.log("Available careers", $availableCareers);
    const careerCatalog = $availableCareers.find((career) => career.name === event.career);
    if (careerCatalog) {
      cardStyleData = careerCatalog;
      cardStyleData.img = API_URL + "/"+ cardStyleData.img_bg;
      console.log("Career found", event.career);
      console.log("Career data", cardStyleData);
    } else{
      console.log("Career not found", event.career);
    }
  }

  export let color;
  export let userId;
  export let isSuscribed = false;

  const nombreDia = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const numeroDia = new Date(event.date).toLocaleDateString("es-ES", {
    day: "numeric",
  });

  const nombreMes = new Date(event.date).toLocaleDateString("es-ES", {
    month: "long",
  });

  async function generateQR() {
    const qr = await qrCode.toDataURL(userId + "-" + event.id, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    console.log("qrBase64", qr);
    return qr;
  }

  /*async function openDetailModal() {
    if (isSuscribed) {
      console.log("Opening modal");

      await generateQR();
      var detailModal = new bootstrap.Modal(
        document.getElementById("detail-modal"),
        {
          keyboard: false,
        }
      );
      detailModal.show();
    } else {
      toast.error("Debes inscribirte para al evento ver tu QR");
    }
  }*/

  async function handleSuscription() {
    if (isSuscribed) {
      await unsuscribeEvent();
    } else {
      await incribirEvento();
    }
  }

  async function incribirEvento() {
    try {
      const res = await fetch(`${API_URL}/api/evento/atendees/suscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          user_id: userId,
        }),
      });
      let response = await res.json();
      //console.log("response catched", response);

      switch (res.status) {
        case 200:
          //console.log("response", response.message);
          toast.success(response.message);
          isSuscribed = true;
          event.attendees++;
          break;
        case 400:
          toast.error(response.error);
          break;

        default:
          toast.error("Error al inscribirse");
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function unsuscribeEvent() {
    try {
      const res = await fetch(`${API_URL}/api/evento/atendees/unsuscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          user_id: userId,
        }),
      });
      //let response = await res.json();
      //console.log("response", response);

      switch (res.status) {
        case 200:
          toast.success("Se ha dado de baja correctamente");
          isSuscribed = false;
          event.attendees--;
          break;
        case 400:
          toast.error("No estás inscrito en este evento");
          break;

        default:
          toast.error("Error al darse de baja");
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onMount(() => {
    //cardClickListener();
    getCardStyleData();
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
<div
  class="main-card-container shadow"
  style="background-color: {cardStyleData.color}; overflow: hidden; position: relative;"
>
  <img
    src={cardStyleData.img}
    alt="event"
    class="background-image"
    style="color: white;"
  />

  <div
    on:click={async () => {
      if (!isSuscribed) {
        toast.error("Debes inscribirte para al evento ver tu QR");
        return;
      } else {
        userModalData.set({
          event: event,
          qrBase64: await generateQR(),
        });

        openDetailModal();
      }
    }}
  >
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
  </div>
  <div class="d-flex justify-content-between">
    <p class="event-info" style="font-weight: 700; margin-top:8px">
      <span style="font-weight: 300;"> Asistentes: </span>
      {event.attendees || 0} / {event.max_attendees}
    </p>

    <button
      class="btn btn-light"
      on:click={async () => {
        await handleSuscription();
      }}
    >
      {#if isSuscribed}
        Eliminar registro
      {:else}
        Registrar evento
      {/if}
    </button>
  </div>
</div>

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
<!--<div
  class="modal fade"
  id="detail-modal"
  tabindex="-1"
  aria-labelledby="detail-modalLabel"
  aria-hidden="true"
>
  <div
    class="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detail-modalLabel">{$userModalData.event.name}</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        
   
        <div class="">
          <span class="badge bg-primary"
          >{nombreDia} {numeroDia} de {nombreMes}</span
          >
          <span class="badge bg-success"
          >{$userModalData.event.start_time} - {$userModalData.event.end_time} hrs.</span
          >
          <span class="badge bg-secondary">{$userModalData.event.location}</span>
          
          <span class="badge bg-info"
          >{$userModalData.event.attendees} / {$userModalData.event.max_attendees}</span
          >
          <span class="badge bg-warning">{$userModalData.event.career}</span>
          
          <span class="badge bg-danger">{$userModalData.event.exponent}</span>
        </div>
        <hr />
        
        <div id="qr-container">
          <img class="w-100" src={$userModalData.qrBase64} alt="QR" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cerrar</button
        >
      </div>
    </div>
  </div>
</div>-->

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
    position: relative; /* Esta línea es importante para que funcione el posicionamiento absoluto de la imagen */
  }

.background-image {
  position: absolute;
  top: 0%;  /* Mueve la imagen 10% hacia abajo desde la parte superior del contenedor */
  left: 40%; /* Mueve la imagen al centro, y desde ahí ajustaremos */
  width: 50%; /* Reduce el ancho para que no ocupe todo el contenedor si no es necesario */
  height: 100%; /* Ajusta la altura si es necesario */
  object-fit: cover;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
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
