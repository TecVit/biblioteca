import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from './firebaseConfig';

// Inicializando o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export const getCategory = async () => {
    try {
        const categoryDoc = firestore.collection('privado').doc('categorias');
        const docSnapshot = await categoryDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            let categorias = data.categorias || [];
            categorias.sort();
            return categorias;
        } else {
            console.log('Nenhum documento encontrado!');
            return [];
        }
    } catch (error) {
        console.log('Erro ao buscar livros:', error);
        return false;
    }
};

export const getSeries = async () => {
    try {
        const seriesDoc = firestore.collection('privado').doc('series');
        const docSnapshot = await seriesDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const series = data.series || [];
            return series;
        } else {
            console.log('Nenhum documento encontrado!');
            return [];
        }
    } catch (error) {
        console.log('Erro ao buscar livros:', error);
        return false;
    }
};

/* =====> LIVROS <===== */
const sortBooks = async (livros) => {
    let livrosOrdenados = await livros.sort((a, b) => {
        if (a.status === 'ocupado' && b.status !== 'ocupado') return -1;
        if (a.status !== 'ocupado' && b.status === 'ocupado') return 1;
      
        if (a.status === 'ocupado' && b.status === 'ocupado') {
            const hoje = new Date();
            const [diaA, mesA, anoA] = a.data_entrega.split('/');
            const [diaB, mesB, anoB] = b.data_entrega.split('/');
            
            const dataA = new Date(`${anoA}-${mesA}-${diaA}`);
            const dataB = new Date(`${anoB}-${mesB}-${diaB}`);

            const diferencaA = Math.abs(dataA - hoje);
            const diferencaB = Math.abs(dataB - hoje);

            return diferencaA - diferencaB;
        }
        return 0;
    });
    return livrosOrdenados;
}

// Coletar livros em geral
export const getBooks = async () => {
    try {
        const booksDoc = firestore.collection('privado').doc('livros');
        const docSnapshot = await booksDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            let livros = data.livros || [];
            livros.sort();
            let livrosOrdenados = await sortBooks(livros);
            return livrosOrdenados;
        } else {
            console.log('Nenhum documento encontrado!');
            return [];
        }
    } catch (error) {
        console.log('Erro ao buscar livros:', error);
        return false;
    }
};

// Atualizar status do livro para LIVRE
export const updateStatusBook = async (uid) => {
    try {
        const booksDoc = firestore.collection('privado').doc('livros');
        const docSnapshot = await booksDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            let livros = data.livros || [];

            livros = livros.map(livro => {
                if (livro.uid === uid) {
                    return { 
                        nome: livro.nome,
                        uid: livro.uid,
                        status: 'livre',
                    };
                }
                return livro;
            });

            await booksDoc.update({ livros });

            return true;
        } else {
            console.log('Nenhum documento encontrado!');
            return false;
        }
    } catch (error) {
        console.log('Erro ao atualizar o status do livro:', error);
        return false;
    }
};

// Cadastrar estudante responsável pelo livro
export const setStudentBook = async (dados) => {
    const { uid, aluno, turma, data_coleta, data_entrega } = dados;
    try {
        const booksDoc = firestore.collection('privado').doc('livros');
        const docSnapshot = await booksDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            let livros = data.livros || [];

            livros = livros.map(livro => {
                if (livro.uid === uid) {
                    return { 
                        nome: livro.nome,
                        uid: livro.uid,
                        status: 'ocupado',
                        turma_aluno: turma,
                        aluno_responsavel: aluno,
                        data_coleta: data_coleta,
                        data_entrega: data_entrega,
                    };
                }
                return livro;
            });

            await booksDoc.update({ livros });

            return true;
        } else {
            console.log('Nenhum documento encontrado!');
            return false;
        }
    } catch (error) {
        console.log('Erro ao atualizar o status do livro:', error);
        return false;
    }
};

// Adicionar Livro
export const createBook = async (dados) => {
    const { nome, categoria } = dados;
    const uuid = uuidv4();
    console.log(uuid);
    try {
        const booksDoc = firestore.collection('privado').doc('livros');
        const docSnapshot = await booksDoc.get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            let livros = data.livros || [];

            livros.push({
                uid: uuid,
                nome: nome,
                categoria: categoria,
                status: 'livre',
            });

            await booksDoc.update({ livros });

            return true;
        } else {
            console.log('Nenhum documento encontrado!');
            return false;
        }
    } catch (error) {
        console.log('Erro ao atualizar o status do livro:', error);
        return false;
    }
};

// Deletar Livro
export const deleteBook = async (dados) => {
    const { uid } = dados;
    try {
      const booksDoc = firestore.collection('privado').doc('livros');
      const docSnapshot = await booksDoc.get();
  
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        let livros = data.livros || [];
  
        livros = livros.filter(livro => livro.uid !== uid);
  
        await booksDoc.update({ livros });
  
        return true;
      } else {
        console.log('Nenhum documento encontrado!');
        return false;
      }
    } catch (error) {
      console.log('Erro ao excluir o livro:', error);
      return false;
    }
  };