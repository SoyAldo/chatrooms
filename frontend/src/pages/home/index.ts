const { Router } = require("@vaadin/router");
import { getState, setState } from "../../state";

function placeConnectedElement(container: HTMLDivElement) {
  // Si es un objeto colocamos el boton de cerrar sesión o el de las salas
  const connectedContainer = document.createElement("div");
  connectedContainer.className = "connected-container";
  connectedContainer.innerHTML = `
    <div class="connected-container__avatar"></div>

    <div class="connected-container__buttons">
      <button class="connected-container__button" id="join-room">Unirse a sala</button>
      <button class="connected-container__button" id="create-room">Crear sala</button>
      <button class="connected-container__button" id="close-session">Cerrar sesión</button>
    </div>
  `;
  // Agregando funcionalidad al botón de crear sala
  const createRoomBtn = connectedContainer.querySelector("#create-room");
  createRoomBtn?.addEventListener("click", () => Router.go("/create"));

  // Agregando funcionalidad al botón de unirse a sala
  const joinRoomBtn = connectedContainer.querySelector("#join-room");
  joinRoomBtn?.addEventListener("click", () => Router.go("/join"));

  // Agregando funcionalidad al boton de cerrar sesión
  const closeSessionBtn = connectedContainer.querySelector("#close-session");
  closeSessionBtn?.addEventListener("click", () => {
    // Eliminamos datos del usuario del estado
    const lastState = getState();
    setState({});
    // Actualizamos el contenedor de opciones
    placeDisconnectedElement(container);
  });

  // Agregar el contenedor a la sección correspondiente
  if (container.childNodes.length > 0) {
    container.childNodes[0].remove();
  }
  container.appendChild(connectedContainer);
}

function placeDisconnectedElement(container: HTMLDivElement) {
  // Si no es un objeto colocamos las opciones de iniciar sesión o registrarse
  const disconnectedContainer = document.createElement("div");
  disconnectedContainer.className = "disconnected-container";
  disconnectedContainer.innerHTML = `
    <div class="disconnected-container__avatar"></div>
    <div class="disconnected-container__buttons">
      <button class="disconnected-container__button" id="signin-button">Iniciar sesión</button>
      <button class="disconnected-container__button" id="signup-button">Registrarse</button>
    </div>
  `;
  // Agregando funcionalidad al boton de signin
  const signinBtn = disconnectedContainer.querySelector("#signin-button");
  signinBtn?.addEventListener("click", () => Router.go("/signin"));

  // Agregando funcionalidad al boton de signup
  const signupBtn = disconnectedContainer.querySelector("#signup-button");
  signupBtn?.addEventListener("click", () => Router.go("/signup"));

  // Agregar el contenedor a la sección correspondiente
  if (container.childNodes.length > 0) {
    container.childNodes[0].remove();
  }
  container.appendChild(disconnectedContainer);
}

class HomePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const lastState = getState();
    const user = lastState.user;

    this.innerHTML = `
      <header-generic></header-generic>
      <main>
        <h2>Bienvenidx a Chatroom</h2>
      </main>
      <section class="home-options"></section>
    `;

    const optionsEl = this.querySelector(".home-options") as HTMLDivElement;
    if (optionsEl) {
      if (user) {
        placeConnectedElement(optionsEl);
      } else {
        placeDisconnectedElement(optionsEl);
      }
    }
  }
}

function registerHomePage() {
  customElements.define("home-page", HomePage);
}

export { registerHomePage };
