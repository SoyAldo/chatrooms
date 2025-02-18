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

        <form class="form" id="create-form">
          <div>
            <label for"name">Nombre</label>
            <input type="text" name="name" id="name" required placeholder="Un nombre de sala asombroso" />
          </div>

          <input id="form-submit" type="submit" value="Crear sala" />
        </form>

        <div class="info-square"></div>
      </main>
    `;

    const form = this.querySelector("#create-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (event) => {
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
              const infoSquare = this.querySelector(".info-square");
              if (infoSquare) {
                placeInfo(infoSquare as HTMLDivElement, data.roomId);
              }
              // Eliminando el formulario del dom
              form.remove();
            });
          });
        }
      });
    }
  }
}

function placeInfo(infoSquare: HTMLDivElement, code: string) {
  infoSquare.className = "info-square info-square-visible";
  infoSquare.innerHTML = `
    <h2 class="info-square__title">Información de la sala</h2>

    <div class="info-square__field">
      <h3 class="info-square__field-title">Código</h3>
      <p class="info-square__field-text"></p>
    </div>

    <p class="info-square__text">Comparte el código con tus amigos</p>

    <a class="info-square__link">Ir a la sala</a>
  `;
  // Coloco el código en la información
  const codeTextEl = infoSquare.querySelector(".info-square__field-text");
  if (codeTextEl) {
    codeTextEl.textContent = code;
  }
  // Coloco el enlace en el botón
  const buttonEl = infoSquare.querySelector(".info-square__link");
  if (buttonEl) {
    buttonEl.setAttribute("href", "http://localhost:3001/room/" + code);
  }
}

function registerCreatePage() {
  customElements.define("create-page", CreatePage);
}

export { registerCreatePage };
