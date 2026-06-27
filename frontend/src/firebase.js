import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // cole aqui o seu objeto copiado acima
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);