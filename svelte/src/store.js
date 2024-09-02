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
