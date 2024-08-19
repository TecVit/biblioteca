import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { firebaseConfig } from './firebaseConfig';
import { clearCookies, deleteCookie, getCookie, setCookie } from './cookies';


// Inicializando o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const auth = firebase.auth();

const formatarNomeDeUsuario = (valor) => {
    valor = valor.replace(/\s+/g, '');
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9]/g, '');
    return valor;
};

export const cadastrarComEmail = async (nome, email, senha) => {
    return auth.createUserWithEmailAndPassword(email, senha)
        .then( async (userCredential) => {
            const user = userCredential.user;
            if (user) {
                const uid = user.uid;
                const nomeUsuario = await formatarNomeDeUsuario(nome);
                const userRef = await firestore.collection('privado').doc(uid);
                const amigosRef = firestore.collection('publico').doc(nomeUsuario);
                if ((await amigosRef.get()).exists) {
                    return 'nome-de-usuario-existe';
                }
                if (userRef.get().exists) {
                    return 'usuario-existe';
                } else {
                    await amigosRef.set({
                        nome: nomeUsuario,
                        email: user.email,
                    });
                    userRef.set({
                        nome: nomeUsuario,
                        email: email,
                    });
                    return 'sucesso'; 
                }
            } else {
                return 'erro';
            }
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email') {
                return 'email-invalido';
            } else if (error.code === 'auth/invalid-credential') {
                return 'credencial-invalida';
            } else if (error.code === 'auth/email-already-in-use') {
                return 'email-em-uso';
            }
            console.error('Erro ao cadastrar:', error);
            return 'erro';
        });
};

export const entrarComEmail = (email, senha) => {
    return auth.signInWithEmailAndPassword(email, senha)
        .then( async (userCredential) => {
        const user = userCredential.user;
        if (user) {
            const uid = user.uid;
            const userRef = await firestore.collection('privado').doc(uid).get();
            if (userRef.exists) {
                const dados = userRef.data();
                const camposCookies = ['nome', 'email', 'fotoURL'];

                camposCookies.forEach((campo) => {
                    if (dados[campo]) {
                        setCookie(campo, dados[campo]);
                    }
                });
                setCookie('uid', uid);
                return 'sucesso';
            } else {
                return 'usuario-nao-existe'; 
            }
        } else {
            return 'credencial-invalida';
        }
        })
        .catch((error) => {
        if (error.code === 'auth/invalid-email') {
            return 'email-invalido';
        } else if (error.code === 'auth/invalid-credential') {
            return 'credencial-invalida';
        }
        console.error('Erro ao entrar:', error);
        return 'erro';
    });
};

export const enviarLinkEmail = (email) => {
    return auth.sendPasswordResetEmail(email)
    .then(() => {
        console.log('E-mail de redefinição de senha enviado com sucesso');
        return 'sucesso';
    })
    .catch((error) => {
        if (error.code === 'auth/invalid-email') {
            return 'email-invalido';
        }
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        return 'erro';
    });
};

export const redefinirSenha = (codigoOOB, novaSenha) => {
    return firebase.auth().confirmPasswordReset(codigoOOB, novaSenha)
      .then(() => {
        // Senha definida com sucesso
        console.log('Senha definida com sucesso');
        return 'sucesso';
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
            return 'email-invalido';
        }
        console.error('Erro ao definir a senha:', error);
        return 'erro';
      });
};
  
export const sair = () => {
  return auth.signOut();
};


export { firestore, auth };