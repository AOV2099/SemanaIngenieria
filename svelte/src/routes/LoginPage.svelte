<script>
	import { onMount } from 'svelte';

	onMount(() => {
		selectedPage.set("LOGIN_PAGE");
	});
	let isLogged = false;
	let username = "";
	let password = "";

	//$: username, console.log(username);
	//$: password, console.log(password);

	/*function loadMainPage() {
    throw redirect(307, "/MainPage");
  }*/
	function password_show_hide() {
		var x = document.getElementById('password');
		var show_eye = document.getElementById('show_eye');
		var hide_eye = document.getElementById('hide_eye');
		hide_eye.classList.remove('d-none');
		if (x.type === 'password') {
			x.type = 'text';
			show_eye.style.display = 'none';
			hide_eye.style.display = 'block';
		} else {
			x.type = 'password';
			show_eye.style.display = 'block';
			hide_eye.style.display = 'none';
		}
	}

	async function login(username, password) {
		isLogged.set(true);

		/*try {
      const response = await fetch(`${$API_DIR}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        currentPage.set("MAIN_PAGE");

        localStorage.setItem($SESSION_LS, data.session_id);
        localStorage.setItem($USERNAME_LS, data.username);
        //USERNAME_LS.set(data.username);
      } else if (response.status === 401) {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
        alert("Credenciales inválidas");
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    }*/
	}
</script>

<body>
	<section class="">
		<div class="bg-gold" />
		<div class="bg-white" />

		<div class="container-fluid" style="height: 100vh;">
			<div class="row h-100 justify-content-center align-items-center">
				<div class="col-12 col-md-6 col-lg-5 col-xl-4" style="max-width: 700px;">
					<div class="container h-100">
            <!--<div class="container py-5 h-100">-->
						<div class="row d-flex justify-content-center align-items-center h-100">
								<div
									class="card bg-light text-black shadow-lg p-3 mb-5 bg-body rounded"
									style="border-radius: 1rem;"
								>
									<div class="card-body p-5 text-center">
										<div class="mb-md-5 mt-md-4 pb-5">
											<h2 class="fw-bold mb-2 text-uppercase">CRONOS</h2>
											<h4 class="fw-bold mb-2 text-uppercase">V3</h4>
											<p class="text-black-50 mb-5">Ingrese correo y contraseña</p>

											<div class="form-outline form-white mb-4">
												<!--<label class="form-label" for="typeEmailX">Username</label>-->
												<label class="form-label" for="username" 
													>Usuario</label
												>
												<input
													type="email"
													id=""
													bind:value={username}
													class="input form-control "
                          placeholder="usuario"
												/>
											</div>

											<div class="form-outline form-white mb-4">
												<label class="form-label" for="typePasswordX">Contraseña</label>
												<div class="input-group" id="show_hide_password">
													<input
														name="password"
														type="password"
														bind:value={password}
														class="input form-control"
														id="password"
														placeholder="contraseña"
														required="true"
														aria-label="password"
														aria-describedby="basic-addon1"
													/>
													<div class="input-group-append">
														<span
															on:click={password_show_hide}
															on:keydown={() => {}}
															class="input-group-text"
														>
															<i class="bi bi-eye-fill" id="show_eye" />
															<i class="bi bi-eye-slash-fill d-none" id="hide_eye" />
														</span>
													</div>
												</div>

												<br />

												<hr />
												<br />

												<button
													class="btn btn-success btn-lg px-5"
													on:click={login(username, password)}>Ingresar</button
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
											<p class="text-secondary">version 0.0.1</p>
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
