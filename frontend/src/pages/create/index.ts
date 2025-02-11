import { getState } from "../../state";
const { Router } = require("@vaadin/router");

class CreatePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Si el usuario del estado es válido lo envío de nuevo al inicio
    const lastState = getState();
    const user = lastState.user;
    if (!user) Router.go("/");
    // Proseguir con la funcionalidad
    this.innerHTML = `
      <header-generic></header-generic>

      <main>
        <h2 class="title">Creando sala</h2>

        <form class="create" id="create-form">
          <div class="create-field">
            <label class="create-field__label" for"name">Nombre</label>
            <input class="create-field__input" type="text" name="name" id="name" required placeholder="Ingrese un nombre" />
          </div>

          <input class="create__submit" id="form-submit" type="submit" value="Crear sala" />
        </form>

        <p class="form-response" id="form-response"></p>
      </main>

    `;

    const form = this.querySelector("#create-form") as HTMLFormElement;

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      // Obtener el nombre de la sala
      const formData = new FormData(form);
      const name = formData.get("name");
      // Si el nombre de la sala es válido
      if (name) {
        fetch("http://localhost:3000/chatroom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        }).then((res) => {
          res.json().then((data) => {
            console.log(res.ok);
            console.log(data);
          });
        });
        // Crear la sala
        // Si la sala fue creada mostrar la información y el botón para ir a la sala
      }
    });
  }
}

function registerCreatePage() {
  customElements.define("create-page", CreatePage);
}

export { registerCreatePage };
