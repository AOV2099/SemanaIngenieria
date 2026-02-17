<script>
  import { onMount } from "svelte";
  import qrCode from "qrcode";
  import html2canvas from "html2canvas";
  import toast from "svelte-french-toast";

  let userId;
  let qrBase64 = "";
  let captureArea;
  let isExportingImage = false;

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

  async function generateUserQr() {
    try {
      if (!userId) return;
      qrBase64 = await qrCode.toDataURL(String(userId), {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 0.3,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("No se pudo generar tu QR");
    }
  }

  function downloadQrImage() {
    if (!qrBase64 || !captureArea) return;

    const run = async () => {
      isExportingImage = true;
      try {
        const fileName = `credencial-asistencia-${userId || "usuario"}.jpg`;

        const canvas = await html2canvas(captureArea, {
          backgroundColor: "#212121",
          useCORS: true,
          scale: Math.min(3, window.devicePixelRatio || 2),
          logging: false,
        });

        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("No se pudo crear imagen"))),
            "image/jpeg",
            0.95,
          );
        });

        const file = new File([blob], fileName, { type: "image/jpeg" });

        // iOS/Android moderno: compartir/guardar archivo desde hoja nativa
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            files: [file],
            title: "QR de asistencia",
            text: "Guardar en Fotos",
          });
          return;
        }

        // Fallback web desktop/android
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Fallback Safari iPhone (a veces ignora download)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
          const w = window.open("");
          if (w) {
            w.document.write(`
              <html><head><title>Guardar QR</title></head>
              <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;">
                <img src="${dataUrl}" style="max-width:100%;height:auto;" alt="Credencial" />
              </body></html>
            `);
            w.document.close();
            toast("En iPhone: mantén presionada la imagen y elige 'Guardar en Fotos'", {
              icon: "📷",
            });
          }
        } else {
          toast.success("QR descargado");
        }
      } catch (error) {
        console.error(error);
        toast.error("No se pudo guardar el QR");
      } finally {
        isExportingImage = false;
      }
    };

    run();
  }

  function logout() {
    document.cookie = `userId=; max-age=0; path=/`;
    window.location.href = "/login";
  }

  onMount(async () => {
    getUserId();
    await generateUserQr();
  });
</script>

<div>
  <!--navbar-->
  <nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img
          src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
          alt=""
          width="25"
          height="25"
          class="d-inline-block align-text-top"
        />
        TEST DE ASISTENCIA
      </div>
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

<div id="main-container" bind:this={captureArea}>
  <div class="qr-wrapper">
    <div class="qr-card shadow-lg">
      <h5 class="mb-2">Tu código de asistencia</h5>
      <p class="mb-3 text-muted">Número de cuenta: <strong>{userId}</strong></p>

      {#if qrBase64}
        <img class="qr-image" src={qrBase64} alt="QR de asistencia" />

        <div class="d-grid gap-2 mt-3" data-html2canvas-ignore="true">
          {#if !isExportingImage}
            <button class="btn btn-dark" on:click={downloadQrImage}>
              <i class="bi bi-download"></i> Descargar QR
            </button>
          {:else}
            <div class="text-muted">Convirtiendo a imagen...</div>
          {/if}
        </div>
      {:else}
        <div class="text-muted">Generando QR...</div>
      {/if}
    </div>
  </div>
</div>

<!--background-color: #212121;-->
<style>
  #main-container {
    height: 100vh;
    background-color: #212121;
    overflow-y: hidden;
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

  .qr-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
  }

  .qr-card {
    background: white;
    border-radius: 14px;
    padding: 20px;
    min-width: min(92vw, 420px);
    text-align: center;
  }

  .qr-image {
    width: min(70vw, 320px);
    height: min(70vw, 320px);
    object-fit: contain;
    border-radius: 10px;
  }
</style>
