import { writable } from "svelte/store";

export var test = writable("Hello, world!");
export const API_URL = `${window.location.origin}`;
export var userModalData = writable({
    event: {
        id: "-1",
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
    },
    qrCode: "UwU",
});

/*xport var availableCareers = writable([
    "División de las Ciencias Físico-Matemáticas y de las Ingenierías",
    "Ingeniería Civil",
    "Ingeniería en Computación",
    "Ingeniería Eléctrica-Electrónica",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
]);*/

export var availableCareers = writable([
    {
        name: "División de las Ciencias Físico-Matemáticas y de las Ingenierías",
        color: "#3f51b5",
        img_bg: "DIV-Blanco.svg"
    },
    {
        name: "Ingeniería Civil",
        color: "#e91e63",
        img_bg: "ICI-Blanco.svg"
    },
    {
        name: "Ingeniería en Computación",
        color: "#f44336",
        img_bg: "ICO-Blanco.svg"
    },
    {
        name: "Ingeniería Eléctrica-Electrónica",
        color: "#03a9f4",
        img_bg: "IEE-Blanco.svg"
    },
    {
        name: "Ingeniería Industrial",
        color: "#9c27b0",
        img_bg: "IID-Blanco.svg"
    },
    {
        name: "Ingeniería Mecánica",
        color: "#009688",
        img_bg: "IMC-Blanco.svg"
    },
    {
        name:"default",
        color:"#8bc34a",
        img_bg:"default.png"
    }
]);

export async function generateQR(stringData) {
  try {
    qrBase64 = await qrCode.toDataURL(stringData, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrBase64;
  } catch (error) {
    console.log(error);
  }
}

export function openDetailModal() {



  var detailModal = new bootstrap.Modal(
    document.getElementById("detail-modal"),
    {
      keyboard: false,
    }
  );
  detailModal.show();
}
