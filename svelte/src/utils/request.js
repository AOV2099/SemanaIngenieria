//archivo para hacer peticiones a la API

//obtener lista de semestres
export async function getSemestres() {
  console.log("Fetching semestres...");
  const res = await fetch("/api/v1/semestres");
  return await res.json();
}

//traer datos de un semestre
export async function getSemestre(semestre) {
  console.log("Fetching semestre...", semestre);
  const res = await fetch(`/api/v1/semestre/${semestre}`);
  return await res.json();
}

//obtener a todos los profesores con datos
export async function getProfesores() {
  console.log("Fetching profesores...");
  const res = await fetch("/api/v1/profesores");
  return await res.json();
}

//actualizar datos de un profesor existente
export async function updateProfesor(data) {
  console.log("Updating profesor...", data);

  try {
    const res = await fetch(`/api/v1/profesor/${data.rfc}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    //console.log("Response: ", res);
    return res;
  } catch (error) {
    console.error("Error updating profesor", error);
    return error;
  }
}

//salvar datos de un profesor nuevo
export async function saveProfesor(data) {
  console.log("Saving profesor...", data);

  try {
    const res = await fetch("/api/v1/profesor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    //console.log("Response: ", res);
    return res;
  } catch (error) {
    console.error("Error saving profesor", error);
    return error;
  }
}

//eliminar un profesor
export async function deleteProfesor(rfc) {
  console.log("Deleting profesor...", rfc);

  try {
    const res = await fetch(`/api/v1/profesor/${rfc}`, {
      method: "DELETE",
    });
    //console.log("Response: ", res);
    return res;
  } catch (error) {
    console.error("Error deleting profesor", error);
    return error;
  }
}

//obtener lista de materias
export async function getMaterias() {
  try {
    console.log("Fetching materias...");
    const res = await fetch("/api/v1/materias");
    return res;
  } catch (error) {
    console.error("Error getting materias", error);
    return error;
  }
}

//obtener lista de categorias de profesores
export async function getCategoriasProfs() {
  try {
    console.log("Fetching categorias...");
    const res = await fetch("/api/v1/categorias");
    return res;
  } catch (error) {
    console.error("Error getting categorias", error);
    return error;
  }
}

//update horas de un profesor
export async function updateHorasProfesor(rfc, data) {
  console.log("Updating horas profesor...", data);

  try {
    const res = await fetch(`/api/v1/profesor/${rfc}/materia/${data.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.error("Error updating horas profesor", error);
    return error;
  }
}

// borrar horas de un profesor
export async function deleteHorasProfesor(rfc, id) {
  console.log("Deleting horas profesor...", id);

  try {
    const res = await fetch(`/api/v1/profesor/${rfc}/materia/${id}`, {
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.error("Error deleting horas profesor", error);
    return error;
  }
}
