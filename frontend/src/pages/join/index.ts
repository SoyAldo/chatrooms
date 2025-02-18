import { setAlertToastMessage } from "../../components/alert-toast";

class JoinPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <header-generic></header-generic>

    <main>
      <h2 class="title">Ingresando en sala...</h2>

      <form class="form" id="join-form">
        <div>
          <label for="code">Código de sala</label>
          <input type="text" name="code" required placeholder="123456" />
        </div>

        <input type="submit" value="Ingresar" />
      </form>
    </main>

    <alert-toast></alert-toast>
    `;

    const form = this.querySelector("#join-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Datos del formulario
        const formData = new FormData(form);
        // Código de la sala
        const roomCode = formData.get("code") as string;
        // Verificando longitud del código de sala
        if (roomCode.length == 6) {
          
        } else {
          setAlertToastMessage("Error", "El código no tiene 6 digitos");
        }
      });
    }
  }
}

function registerJoinPage() {
  customElements.define("join-page", JoinPage);
}

export { registerJoinPage };
