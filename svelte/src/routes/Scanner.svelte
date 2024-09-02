<script>
  import { onMount, onDestroy } from "svelte";
  import QrScanner from "qr-scanner";
  import toast, { Toaster } from "svelte-french-toast";
  import { API_URL } from "../store";

  let videoElement;
  let qrScanner;
  let scanResult;
  let cameras = [];
  let currentCameraIndex = 0;
  let cameraNames = [];
  let currentCameraLabel = "";

  let lastToastTime = 0;

  let toastOptions = {
    duration: 5000,
    position: "bottom-center",
    type: "success",
    showIcon: true,
    showCloseButton: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnEscape: true,
  };

  function selectCamera(cameraId) {
    qrScanner
      .setCamera(cameraId)
      .then(() => {
        console.log("Camera switched to: " + cameraId);
        currentCameraLabel = cameras.find(
          (camera) => camera.id === cameraId
        ).label;
        qrScanner.start().catch((err) => {
          console.error(
            "Error starting QR Scanner with selected camera: ",
            err
          );
          alert("Error starting QR Scanner with selected camera: " + err);
        });
      })
      .catch((err) => {
        console.error("Error setting camera: ", err);
      });
  }

  function switchCamera() {
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    currentCameraLabel = cameras[currentCameraIndex].label; // Actualiza la etiqueta de la cámara actual
    qrScanner
      .setCamera(cameras[currentCameraIndex].id)
      .then(() => {
        console.log("Switched to camera: " + currentCameraLabel);
      })
      .catch((err) => {
        console.error("Error switching cameras:", err);
      });
  }

  function startScanner(cameraId) {
    qrScanner = new QrScanner(
      videoElement,
      (result) => {
        const now = Date.now();
        if (now - lastToastTime > 3000) {
          lastToastTime = now;
          console.log("QR code scanned:", result);
          scanResult = result.data;
          //toast.success("Visita registrada: " + scanResult, toastOptions);
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
        alert("Error starting QR Scanner: " + err);
      });
    });
  }

  async function registerVisit(qrReading) {
    try {
      let userId = -1;
      let eventId = "";
      let tranformedQrReading = qrReading.split("-");

      if (tranformedQrReading.length < 2) {
        toast.error("QR inválido");
        return;
      }

      userId = tranformedQrReading[0];
      for (let i = 1; i < tranformedQrReading.length; i++) {
        eventId += tranformedQrReading[i] + "-";
      }

      eventId = eventId.slice(0, -1); //remove last character

      const res = await fetch(`${API_URL}/api/evento/visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
        }),
      });

      const result = await res.json();
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onMount(() => {
    QrScanner.listCameras(true)
      .then((foundCameras) => {
        cameras = foundCameras;
        cameraNames = cameras.map((camera) => camera.label);
        const rearCamera = cameras.find((camera) =>
          camera.label.toLowerCase().includes("back")
        );
        startScanner(rearCamera ? rearCamera.id : cameras[0].id);
      })
      .catch((error) => {
        console.error("Could not list cameras:", error);
        alert("Could not list cameras. Please check camera permissions.");
      });
  });

  onDestroy(() => {
    qrScanner.stop();
  });
</script>

<Toaster />

<nav class="navbar navbar-dark bg-primary shadow-lg" style="">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img
        src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
        alt=""
        width="30"
        height="24"
        class="d-inline-block align-text-top"
      />
      Semana de la ingenería
    </a>
    <form class="d-flex">
      <button
        class="btn btn-secondary"
        type="button"
        style="margin-right: 8px;"
        data-bs-toggle="modal"
        data-bs-target="#cameraModal"
      >
        <i class="bi bi-camera-video-fill"></i>
      </button>
      <!--<button class="btn btn-secondary" type="submit">
        <i class="bi bi-grid-fill"></i>
      </button>-->
    </form>
  </div>
</nav>

<div class="d-flex justify-content-center align-items-center">
  <div class="video-container shadow-lg">
    <video bind:this={videoElement} playsinline></video>
  </div>
</div>

<!-- Modal -->
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
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          {#each cameras as camera}
            <!-- svelte-ignore a11y-click-events-have-key-events -->

            <div
              class="card mb-3 shadow-sm"
              on:click={() => {
                selectCamera(camera.id);
                //close modal
                document.getElementById("cameraModal").click();
              }}
            >
              <div class="row">
                <div class="col-3">
                  <img
                    src="https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI="
                    class="card-img-top"
                    alt="..."
                  />
                </div>

                <div
                  class="col-9 d-flex justify-content-center align-items-center"
                >
                  <p class="card-text">{camera.label}</p>
                </div>
              </div>
            </div>

            <!--
            <div
              class="card text-center col-6"
              on:click={() => {
                selectCamera(camera.id);
                //close modal
                document.getElementById("cameraModal").click();
              }}
            >
              <img
                src="https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI="
                class="card-img-top"
                alt="..."
              />

              <div class="card-body">
                <p class="card-text">{camera.label}</p>
              </div>
            </div>
            -->
          {/each}
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

<style>
  .video-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

  .active-camera {
    font-weight: bold;
    color: greenyellow;
  }
</style>
