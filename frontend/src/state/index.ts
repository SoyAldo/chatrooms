interface State {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  room?: {
    id: string;
    owner: string;
    messages: string;
  };
}

interface Observer {
  name: string;
  onChange: Function;
}

var state: State = {};
var observers: Observer[] = [];

function initState() {
  // Cargar los datos del almacenamiento local
  const user = localStorage.getItem("user");
  if (user) {
    state.user = JSON.parse(user);
  }
}

function setState(newState: State) {
  // Esbalecer el nuevo estado
  state = newState;
  // Avisar a los observadores que el estado cambio
  observers.forEach((observers) => {
    // Llamamos al método onChange y le mandamos el nuevo estado
    observers.onChange(newState);
  });
  // Guardar en el local storage la información del usuario
  if (newState.user) {
    localStorage.setItem("user", JSON.stringify(newState.user));
  } else {
    localStorage.removeItem("user");
  }
}

function getState(): State {
  return state;
}

export { initState, setState, getState };
