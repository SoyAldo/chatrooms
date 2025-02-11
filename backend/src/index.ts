import express from "express";
import cors from "cors";
import { getDB, getRTDB } from "./firebase";
import { generateRandomId } from "./utils";

// Instanciando una app de express
const app = express();

// Aplicando los interceptores
app.use(express.json());
app.use(cors());

// Colecciones
const usersCollection = getDB().collection("users");

// Registrar un usuario
app.post("/signup", (req, res) => {
  // Obtener datos
  const { email, name, password } = req.body;
  // Si los datos son los requeridos
  if (email && name && password) {
    // Verificar si existe
    usersCollection
      .where("email", "==", email)
      .get()
      .then((searchResponse) => {
        // Verifico si la respuesta de la busqueda esta vacía
        if (searchResponse.empty) {
          // Si esta vacía, crear el nuevo usuario
          usersCollection
            .add({
              email,
              name,
              password,
            })
            .then((doc) => {
              res.status(201).json({ message: "Usuario creado", id: doc.id });
            });
        } else {
          // Si encontro algo enviar una respuesta de que ya existe
          res.status(400).json({ message: "El usuario ya existe" });
        }
      });
  } else {
    // Si los datos no son requeridos
    res.status(400).json({ message: "Faltan datos necesarios" });
  }
});

// Iniciar sesión de usuario
app.post("/login", (req, res) => {
  // EaxQsq1a9sPV8PAN6riJ
  const { email, password } = req.body;
  // Si los datos requeridos son validos
  if (email && password) {
    usersCollection
      .where("email", "==", email)
      .get()
      .then((searchResponse) => {
        if (searchResponse.empty) {
          res.status(400).json({ message: "El usuario no existe" });
        } else {
          const doc = searchResponse.docs[0];
          if (doc.data().password == password) {
            res.status(200).json({
              message: "Sesión iniciada",
              userId: doc.id,
              user: {
                email: doc.data().email,
                name: doc.data().name,
              },
            });
          } else {
            res.status(400).json({ message: "La contraseña no es correcta" });
          }
        }
      });
  } else {
    // Si falta algun dato requerido
    res.status(400).json({ message: "Faltan datos necesarios" });
  }
});

// Crear sala de chat
app.post("/chatroom", (req, res) => {
  const { userId } = req.body;
  if (userId) {
    usersCollection
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Creamos la nueva sala
          const roomId = generateRandomId(6);
          // Creamos la referencia de la sala
          const roomRef = getRTDB().ref("rooms/" + roomId);
          roomRef
            .set({
              owner: doc.data()?.email,
            })
            .then(() => {
              res.status(201).json({ message: "La sala fue creada", roomId });
            });
        } else {
          res
            .status(400)
            .json({ message: "La información de usuario no existe" });
        }
      });
  } else {
    res.status(400).json({ message: "Información de usuario no recibida" });
  }
});

// Enviar mensaje
app.post("/message", (req, res) => {
  const { userId, roomId, message } = req.body;
  if (userId && message) {
    usersCollection
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const name = doc.data()?.name;
          // Agrego el mensaje a la sala
          const roomRef = getRTDB()
            .ref("rooms/" + roomId + "/messages")
            .push({
              user: { name },
              message,
            })
            .then(() => {
              res.status(201).json({
                message: "Mensaje enviado",
              });
            });
        } else {
          res.status(400).json({
            message: "La información de usuario no existe",
          });
        }
      });
  } else {
    res.status(400).json({ message: "Información de usuario no recibida" });
  }
});

// Exponiendo la app al público
app.listen(3000, () => {
  console.log("Servidor web escuchando en el puerto 3000");
});
