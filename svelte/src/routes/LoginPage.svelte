<script>
  import { onMount } from "svelte";
  import { toast } from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import { adminToken, API_URL } from "../store";

  onMount(() => {
    //selectedPage.set("LOGIN_PAGE");
  });
  let boleta = "";

  async function login() {
    //verify thar boleta is a 9 digit number
    if (/^\d{9}$/.test(boleta)) {
      document.cookie = `userId=${boleta}; max-age=14400; path=/`;
      navigate("/events");
    } else {
      //revisar si se peude dividir la boleta por una coma
      if (boleta.includes(",")) {
        let parts = boleta.split(",");
        if (parts.length === 2) {
          await testManagerLogin(parts[0].trim(), parts[1].trim());
          return;
        }
      }

      toast.error("Por favor, ingrese un número de cuenta válido");
    }
  }

  async function testManagerLogin(user, pass) {
  try {
    //console.log( "credenciales", user, pass);
    
    let res = await fetch(`${$API_URL}/api/admin/login`, {
      method: "POST",
      headers: { //enviar como json
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user,
        password: pass
      }),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Respuesta inesperada del servidor (${res.status}). URL API actual: ${$API_URL}. Inicio de respuesta: ${text.slice(0, 80)}`
        );
      }
      let data = await res.json();
      document.cookie = `adminToken=${data.token}; max-age=86400; path=/`;
      adminToken.set(data.token);  // guarda en store
      navigate("/admin");
    } else {
      toast.error("Credenciales inválidas");
      navigate("/login");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error: " + error.message);
  }
}

</script>

<body>
  <section class="">
    <div class="bg-gold" />
    <div class="bg-white" />

    <div class="container-fluid" style="height: 100vh;">
      <div class="row h-100 justify-content-center align-items-center">
        <div
          class="col-12 col-md-6 col-lg-5 col-xl-4"
          style="max-width: 700px;"
        >
          <div class="container h-100">
            <!--<div class="container py-5 h-100">-->
            <div
              class="row d-flex justify-content-center align-items-center h-100"
            >
              <div
                class="card bg-light text-black shadow-lg p-3 mb-5 bg-body rounded"
                style="border-radius: 1rem;"
              >
                <div class="card-body p-5 text-center">
                  <div class="mb-md-5 mt-md-4 pb-5">
                    <h2 class="fw-bold mb-2 text-uppercase">Registro</h2>
                    <h4 class="fw-bold mb-2 text-uppercase">
                      de asistencia
                    </h4>
                    <h4 class="fw-bold mb-2 text-uppercase">2026-1</h4>

                    <hr />
                    <div class="form-outline form-white mb-4">
                      <!--<label class="form-label" for="typeEmailX">Username</label>-->
                      <label class="form-label" for="username"
                        >Escriba su número de cuenta</label
                      >
                      <input
                        type="text"
                        id=""
                        bind:value={boleta}
                        class="input form-control"
                        placeholder="Num. de Cuenta UNAM"
                      />
                    </div>

                    <div class="form-outline form-white mb-4">
                      <hr />
                      <br />

                      <button
                        class="btn btn-success btn-lg px-5"
                        on:click={() => {
                          login();
                        }}>Ingresar</button
                      >
                      <!--<button
                            class="btn btn-success btn-lg px-5"
                            on:click={() => navigate("/mgr")}>Login</button
                          >
                        </div>-->

                      <!--<div>
                                <p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a>
                                </p>
                              </div> -->
                    </div>
                  </div>
                  <div class="d-flex justify-content-center">
                    <p class="text-secondary">versión 1.0.2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</body>

<style>
  body {
    background-color: #002b7a;
    padding: 0px;
    margin: 0px;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .bg-white {
    position: absolute;
    bottom: 0;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    border-radius: 100% 100% 00vh 00vh;
    background-color: #ebebeb;
    transform: translate(-25%, 80%);
  }

  .bg-gold {
    position: absolute;
    bottom: 0;
    width: 200%;
    height: 210%;
    border-radius: 50%;
    border-radius: 100% 100% 00vh 00vh;
    background-color: #d59f0f;
    transform: translate(-25%, 80%);
  }
</style>
