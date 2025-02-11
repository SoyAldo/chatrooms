import { getState, setState } from "../../state";
const { Router } = require("@vaadin/router");

class SigninPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const lastState = getState();
    const user = lastState.user;
    if (user) Router.go("/");

    this.innerHTML = `
    <header-generic></header-generic>
    <main>
      <h2 class="title">Iniciar sesión</h2>
      
      <form class="signin" id="signin-form">
        <div class="signin-field">
          <label class="signin-field__label" for"email">Email</label>
          <input class="signin-field__input" type="email" name="email" id="email" required placeholder="Ingrese su email" />
        </div>

        <div class="signin-field">
          <label class="signin-field__label" for"password">Contraseña</label>
          <input class="signin-field__input" type="password" name="password" id="password" required title="password" />
        </div>

        <input class="signin__submit" id="form-submit" type="submit" value="Iniciar sesión" />
      </form>

      <p class="form-response" id="form-response"></p>
    </main>
    `;

    // Obtengo el botón de registrarse
    const submitBtn = this.querySelector("#form-submit");
    const responseEl = this.querySelector("#form-response");

    // Agregando funcionalidad al formulario
    const formEl = this.querySelector("#signin-form") as HTMLFormElement;
    formEl?.addEventListener("submit", (event) => {
      event.preventDefault();
      // Bloquear el botón de registrarse
      submitBtn?.toggleAttribute("disabled");
      // Obtener datos del formulario
      const formData = new FormData(formEl);
      const email = formData.get("email");
      const password = formData.get("password");
      // Iniciando sesión
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        res.json().then((data) => {
          const { message } = data;
          if (res.ok) {
            console.log(data);
            const lastState = getState();
            setState({
              ...lastState,
              user: {
                id: data.userId,
                name: data.user.name,
                email: data.user.email,
              },
            });
            // Cambio de página al inicio
            Router.go("/");
          } else {
            if (responseEl) {
              responseEl.textContent = message;
              responseEl.className = "form-response form-response-visible";
              setTimeout(() => {
                // Quitamos el bloqueo del boton
                submitBtn?.toggleAttribute("disabled");
                // Volvemos invisible el cartel
                responseEl.textContent = "";
                responseEl.className = "form-response";
              }, 3000);
            }
          }
        });
      });
    });
  }
}

function registerSigninPage() {
  customElements.define("signin-page", SigninPage);
}

export { registerSigninPage };
