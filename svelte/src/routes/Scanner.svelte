<script>
  import { onMount, onDestroy } from "svelte";
  import QrScanner from "qr-scanner";
  import { API_URL } from "../store";
  import Swal from "sweetalert2"; // si instalaste con npm
  // Si prefieres usar CDN, quita esta línea y usa window.Swal

  let videoElement;
  let qrScanner;
  let scanResult;
  let cameras = [];
  let currentCameraIndex = 0;
  let currentCameraLabel = "";

  let lastAlertTime = 0;

  // --- Helpers de alertas centradas ---
  function centerAlert({ icon = "info", title = "", text = "", ms = 3000 }) {
    return Swal.fire({
      icon,
      title,
      text,
      timer: ms,
      timerProgressBar: true,
      showConfirmButton: false,
      position: "center",
      toast: false,
      backdrop: false,
      customClass: {
        popup: "sw-center-popup",
        title: "sw-center-title",
      },
      didOpen: (popup) => {
        popup.addEventListener("mouseenter", Swal.stopTimer);
        popup.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  }

  const centerOK = (msg) =>
    centerAlert({ icon: "success", title:"", text: msg });
  const centerError = (msg) =>
    centerAlert({ icon: "error", title: "", text: msg });
  const centerWarn = (msg) =>
    centerAlert({ icon: "warning", title: "", text: msg });

  // --- Funciones de cámara/escáner ---
  function selectCamera(cameraId) {
    qrScanner
      .setCamera(cameraId)
      .then(() => {
        currentCameraLabel = cameras.find((c) => c.id === cameraId)?.label || "";
        qrScanner.start().catch((err) => {
          console.error("Error starting QR Scanner with selected camera: ", err);
          centerError("No se pudo iniciar la cámara seleccionada");
        });
      })
      .catch((err) => {
        console.error("Error setting camera: ", err);
        centerError("No se pudo cambiar de cámara");
      });
  }

  function switchCamera() {
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    currentCameraLabel = cameras[currentCameraIndex].label;
    qrScanner
      .setCamera(cameras[currentCameraIndex].id)
      .then(() => {
        centerOK(`Cámara: ${currentCameraLabel}`);
      })
      .catch((err) => {
        console.error("Error switching cameras:", err);
        centerError("Error al cambiar de cámara");
      });
  }

  function startScanner(cameraId) {
    qrScanner = new QrScanner(
      videoElement,
      (result) => {
        const now = Date.now();
        if (now - lastAlertTime > 3000) {
          lastAlertTime = now;
          scanResult = result.data;
          registerVisit(scanResult);
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner.setCamera(cameraId).then(() => {
      qrScanner.start().catch((err) => {
        console.error("Error starting QR Scanner: ", err);
        centerError("No se pudo iniciar la cámara");
      });
    });
  }

  // --- Registrar visita ---
  async function registerVisit(qrReading) {
    try {
      let userId = -1;
      let eventId = "";
      const parts = (qrReading || "").split("-");

      if (parts.length < 2) {
        return centerError("QR inválido");
      }

      userId = parts[0];
      eventId = parts.slice(1).join("-");

      const res = await fetch(`${API_URL}/api/evento/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, event_id: eventId }),
      });

      const result = await res.json();
      if (result.ok) {
        centerOK(result.message || "Visita registrada");
      } else {
        centerError(result.error || "No se pudo registrar la visita");
      }
    } catch (error) {
      console.error(error);
      centerError("Error de red al registrar la visita");
    }
  }

  onMount(() => {
    QrScanner.listCameras(true)
      .then((foundCameras) => {
        cameras = foundCameras;
        const rearCamera =
          cameras.find((c) => c.label.toLowerCase().includes("back")) ||
          cameras.find((c) => c.label.toLowerCase().includes("trasera"));
        startScanner((rearCamera || cameras[0])?.id);
      })
      .catch((error) => {
        console.error("Could not list cameras:", error);
        centerError("No se pudieron listar las cámaras. Revisa permisos.");
      });
  });

  onDestroy(() => {
    try {
      qrScanner?.stop();
    } catch (_) {}
  });
</script>

<nav class="navbar navbar-dark bg-primary shadow-lg">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img
        src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
        alt=""
        width="30"
        height="24"
        class="d-inline-block align-text-top"
      />
      Semana de la ingeniería
    </a>
    <form class="d-flex">
      <button
        class="btn btn-secondary"
        type="button"
        style="margin-right: 8px;"
        data-bs-toggle="modal"
        data-bs-target="#cameraModal"
        title="Seleccionar cámara"
      >
        <i class="bi bi-camera-video-fill"></i>
      </button>
    </form>
  </div>
</nav>

<div class="d-flex justify-content-center align-items-center">
  <div class="video-container shadow-lg">
    <video bind:this={videoElement} playsinline></video>
  </div>
</div>

<!-- Modal selección de cámara -->
<div
  class="modal fade"
  id="cameraModal"
  tabindex="-1"
  aria-labelledby="cameraModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cameraModalLabel">Seleccionar Cámara</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
      </div>
      <div class="modal-body">
        <div class="row">
          {#each cameras as camera}
            <div
              class="card mb-3 shadow-sm camera-card"
              on:click={() => {
                selectCamera(camera.id);
                document.getElementById("cameraModal").click();
              }}
            >
              <div class="row g-0">
                <div class="col-3">
                  <img
                    src="https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI="
                    class="img-fluid rounded-start"
                    alt="Cam"
                  />
                </div>
                <div class="col-9 d-flex justify-content-center align-items-center">
                  <p class="card-text m-0">{camera.label}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<style>
  .video-container {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .camera-card {
    cursor: pointer;
  }
  .camera-card:hover {
    transform: translateY(-1px);
    transition: 0.15s ease;
  }

  /* 🎯 Estilo SweetAlert2 centrado */
  :global(.sw-center-popup) {
    border-radius: 16px !important;
    padding: 18px 20px !important;
    min-width: min(90vw, 520px);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25) !important;
  }
  :global(.sw-center-title) {
    font-size: 1.2rem !important;
    font-weight: 700 !important;
  }
</style>
