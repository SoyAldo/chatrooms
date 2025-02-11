import { getState, setState } from "../../state";
const { Router } = require("@vaadin/router");

class SignupPage extends HTMLElement {
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
      <h2 class="title">Registro</h2>
      
      <form class="signup" id="signup-form">
        <div class="signup-field">
          <label class="signup-field__label" for="name">Nombre</label>
          <input class="signup-field__input" type="text" name="name" id="name" required placeholder="Ingrese su nombre" />
        </div>

        <div class="signup-field">
          <label class="signup-field__label" for"email">Email</label>
          <input class="signup-field__input" type="email" name="email" id="email" required placeholder="Ingrese su email" />
        </div>

        <div class="signup-field">
          <label class="signup-field__label" for"password">Contraseña</label>
          <input class="signup-field__input" type="password" name="password" id="password" required title="password" />
        </div>

        <input class="signup__submit" id="form-submit" type="submit" value="Registrarse" />
      </form>

      <p class="form-response" id="form-response"></p>
    </main>
    `;
    // Obtengo el botón de registrarse
    const submitBtn = this.querySelector("#form-submit");
    const responseEl = this.querySelector("#form-response");

    // Agregando funcionalidad al formulario
    const formEl = this.querySelector("#signup-form") as HTMLFormElement;
    formEl?.addEventListener("submit", (event) => {
      event.preventDefault();
      // Bloquear el botón de registrarse
      submitBtn?.toggleAttribute("disabled");
      // Obtener datos del formulario
      const formData = new FormData(formEl);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      // Creando usuario
      fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }).then((res) => {
        res.json().then((data) => {
          const { message } = data;
          if (res.ok) {
            if (email && name) {
              // Establezco el usuario del estado
              const lastState = getState();
              setState({
                ...lastState,
                user: {
                  id: data.id,
                  name: name.toString(),
                  email: email.toString(),
                },
              });
            }
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

function registerSignupPage() {
  customElements.define("signup-page", SignupPage);
}

export { registerSignupPage };
