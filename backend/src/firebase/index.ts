import admin from "firebase-admin";
import accountKey from "../../accountKey.json";

// Inicializamos firebase admin
admin.initializeApp({
  credential: admin.credential.cert(accountKey as any),
  databaseURL: "https://apx-desafios-default-rtdb.firebaseio.com",
});

// Instanciamos las bases de datos
const db = admin.firestore();
const rtdb = admin.database();

function getDB(): admin.firestore.Firestore {
  return db;
}

function getRTDB(): admin.database.Database {
  return rtdb;
}

// Exportamos las funciones
export { getDB, getRTDB };
