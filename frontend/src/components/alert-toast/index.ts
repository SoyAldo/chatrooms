interface ToastMessage {
  title: string;
  content: string;
}

let toastMessage: ToastMessage = { title: "", content: "" };
let toastCallback: Function = () => {};

class AlertToast extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    styles.textContent = `
    * {
      margin: 0;
      padding: 0;
    }
    .container {
      top: 0;
      left: 0;
      position fixed;
      background-color: black;
      width: 100%;
      display: none;
    }
    .container-visible {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .toast {
      position: fixed;
      display: block;
      margin: 0 auto;
      top: 2rem;
      background-color: red;
      padding: 0.4rem 1rem;
      }
    .toast h3 {
      text-align: center;
      margin-bottom: 0.4rem;
    }
    .toast p {
    }
    `;

    const container = document.createElement("div");
    container.className = "container";
    const toast = document.createElement("div");
    toast.className = "toast";
    const title = document.createElement("h3");
    const content = document.createElement("p");

    toast.appendChild(title);
    toast.appendChild(content);

    container.appendChild(toast);

    setToastCallback(() => {
      if (title) title.textContent = toastMessage.title;
      if (content) content.textContent = toastMessage.content;
      container.className = "container container-visible";
      setTimeout(() => {
        container.className = "container";
      }, 2000);
    });
    shadow.appendChild(styles);
    shadow.appendChild(container);
  }
}

function registerAlertToast() {
  customElements.define("alert-toast", AlertToast);
}

function setToastCallback(newToastCallback: Function) {
  toastCallback = newToastCallback;
}

function getAlertToastMessage(): ToastMessage {
  return toastMessage;
}

function setAlertToastMessage(title: string, content: string) {
  toastMessage = { title, content };
  if (toastCallback) toastCallback();
}

export { registerAlertToast, getAlertToastMessage, setAlertToastMessage };

export type { ToastMessage };
