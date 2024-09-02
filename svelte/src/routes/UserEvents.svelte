<script>
  import { onMount } from "svelte";
  import UserEventCard from "./UserEventCard.svelte";
  import { API_URL, userModalData } from "../store";
  import toast from "svelte-french-toast";

  let events = [];
  let suscribedEvents = [];
  let userId;
  //lista de colores flat material
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
  ];

  //get user id from cookie
  function getUserId() {
    let isUser = false;
    const cookie = document.cookie;
    const cookieArray = cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookieItem = cookieArray[i].split("=");
      if (cookieItem[0].trim() === "userId") {
        userId = cookieItem[1];
        isUser = true;
      }
    }

    if (!isUser) {
      window.location.href = "/login";
    } else {
      toast(`¡Hola!`, {
        icon: "👋",
      });
    }
  }

  //fetch events
  async function getEvents() {
    try {
      const res = await fetch(`${API_URL}/api/eventos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        events = data;
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //get suscribed events
  async function getSuscribedEvents() {
    try {
      const res = await fetch(`${API_URL}/api/evento/atendee/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("res", res);
      if (res.status === 200) {
        const data = await res.json();
        suscribedEvents = data;
      } else {
        toast.error(res.error.message);
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function refreshEvents() {
    await getEvents();
    await getSuscribedEvents();
  }

  function logout() {
    document.cookie = `userId=; max-age=0; path=/`;
    window.location.href = "/login";
  }

  onMount(async () => {
    getUserId();
    await getSuscribedEvents();
    await getEvents();

    setInterval(async () => {
      await refreshEvents();
    }, 60000); //refresh every minute
  });
</script>

<div>
  <!--navbar-->
  <nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="navbar-brand" href="#"
        on:click={() => {
          //prevent default
            event.preventDefault();
        }}
      >
        <img
          src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
          alt=""
          width="25"
          height="25"
          class="d-inline-block align-text-top"
        />
        Semana de la ingenería
      </a>
      <button
        class="btn btn-secondary transparent"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        on:click={logout}
      >
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </nav>
</div>

<div id="main-container" class="row" style="paddding-top: 48px; padding-bottom: 48px; margin-top: 48px;">
  {#each events as event, index}
  <div class="col-sm-12 col-md-6 col-lg-6">

      <UserEventCard
        {event}
        color={colors[index % colors.length]}
        {userId}
        isSuscribed={suscribedEvents.includes(event.id)}
      />
  </div>
  {/each}
</div>

<!-- Modal -->
<div
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
        <h1 class="modal-title fs-5" id="detail-modalLabel">
          {$userModalData.event.name}
        </h1>
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
            >{new Date($userModalData.event.date).toLocaleDateString("es-ES", {
              weekday: "long",
            })}
            {new Date($userModalData.event.date).toLocaleDateString("es-ES", {
              day: "numeric",
            })} de {new Date($userModalData.event.date).toLocaleDateString(
              "es-ES",
              {
                month: "long",
              }
            )}</span
          >
          <span class="badge bg-success"
            >{$userModalData.event.start_time} - {$userModalData.event.end_time}
            hrs.</span
          >
          <span class="badge bg-secondary">{$userModalData.event.location}</span
          >

          <span class="badge bg-info"
            >{$userModalData.event.attendees} / {$userModalData.event
              .max_attendees}</span
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
</div>

<!--background-color: #212121;-->
<style>
  #main-container {
    height: 100%;
    padding: 8px;
    line-height: 0.9;
    overflow: auto;
    background-color: #212121;
    overflow-x: hidden;
  }

  .transparent {
    background-color: transparent;
    border: none;
    color: white;
  }

  .transparent:active {
    background-color: transparent;
    border: none;
    color: white;
  }
</style>
