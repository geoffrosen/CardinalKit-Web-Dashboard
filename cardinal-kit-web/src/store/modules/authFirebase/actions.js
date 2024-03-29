import {
  auth,
  googleAuthProvider,
  appleAuthProvider,
  secondaryProvider,
} from "@/plugins/firebase/firebase";
import request from "@/Rest";

export function reset({ commit }) {
  commit("RESET");
}

export async function SignIn({ commit }, payload) {
  return await auth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      commit("isLogged", true);
      return {
        isLogged: true,
      };
    })
    .catch((error) => {
      commit("isLogged", false);
      var errorCode = error.code;
      var errorMessage = error.message;
      return {
        isLogged: false,
        error: errorMessage,
        errorCode: errorCode,
      };
    });
}

export async function LogInWithGoogle({ commit }) {
  return auth
    .signInWithPopup(googleAuthProvider)
    .then(() => {
      commit("isLogged", true);
      return {
        isLogged: true,
      };
    })
    .catch((error) => {
      commit("isLogged", false);
      var errorCode = error.code;
      var errorMessage = error.message;
      return {
        isLogged: false,
        error: errorMessage,
        errorCode: errorCode,
      };
    });
}

export async function LogInWithAppleId({ commit }) {
  return auth
    .signInWithPopup(appleAuthProvider)
    .then(() => {
      commit("isLogged", true);
      return {
        isLogged: true,
      };
    })
    .catch((error) => {
      commit("isLogged", false);
      var errorCode = error.code;
      var errorMessage = error.message;
      return {
        isLogged: false,
        error: errorMessage,
        errorCode: errorCode,
      };
    });
}

export function SignUp({ commit }, payload) {
  auth
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then((user) => {
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

export function SingUpNoPassword({ commit }, payload) {
  const { v4: uuidv4 } = require("uuid");
  console.log("payload", payload);
  return new Promise(function(resolve, reject) {
    secondaryProvider
      .createUserWithEmailAndPassword(payload.email, uuidv4())
      .then(({ user }) => {
        secondaryProvider
          .sendPasswordResetEmail(payload.email)
          .then((res) => {
            request
              .POST(`users_roles/${user.uid}`, {
                data: { rol: "doctor", studies: payload.studies },
              })
              .Execute();
              resolve();
          })
          .catch((error) => {
            console.log("error in reset", error);
            reject(error.message)
          });
      })
      .catch((error) => {
        reject(error.message)
      });
  });
}

export function Logout({ commit }, payload) {
  auth.signOut().then(() => {
    console.log("Logout");
    commit("isLogged", false);
  });
}
