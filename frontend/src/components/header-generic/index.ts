class HeaderGeneric extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
    header {
      background-color: red;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    h1 {
      font-size: 2rem;
    }
    `;
    const headerEl = document.createElement("header");
    headerEl.innerHTML = `<h1>Chatroom</h1>`;

    shadow.appendChild(style);
    shadow.appendChild(headerEl);
  }
}

function registerHeaderGeneric() {
  customElements.define("header-generic", HeaderGeneric);
}

export { registerHeaderGeneric };
