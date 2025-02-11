import { registerHeaderGeneric } from "./components/header-generic";
import { registerCreatePage } from "./pages/create";
import { registerHomePage } from "./pages/home";
import { registerSigninPage } from "./pages/signin";
import { registerSignupPage } from "./pages/signup";
import { initState } from "./state";

const { Router } = require("@vaadin/router");

function main() {
  // Iniciamos el estado
  initState();

  // Registramos los componentes
  registerHeaderGeneric();

  // Registramos las páginas
  registerHomePage();
  registerSignupPage();
  registerSigninPage();
  registerCreatePage();

  // Inicializar el router
  const root = document.getElementById("root");
  const router = new Router(root);

  // Establecer las rutas
  router.setRoutes([
    { path: "/", component: "home-page" },
    { path: "/signup", component: "signup-page" },
    { path: "/signin", component: "signin-page" },
    { path: "/create", component: "create-page" },
    { path: "/chatroom/:roomId", component: "chatroom-view" },
  ]);
}

main();
