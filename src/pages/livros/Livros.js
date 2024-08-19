import React, { useEffect, useState } from 'react'
import './css/Livros.css';
import { IoAdd, IoCalendar, IoEllipsisVertical, IoLibraryOutline, IoList, IoPerson, IoRemove, IoSearch } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBook, deleteBook, getBooks, getCategory, getSeries, setStudentBook, updateStatusBook } from '../../firebase/livros';
import Swal from 'sweetalert';

// Images
import { IoIosAdd, IoMdHelpCircle } from 'react-icons/io';
import { GoTrash } from 'react-icons/go';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { subtrairDatas } from '../../functions/data';
import { TbCategoryFilled } from "react-icons/tb";
import Popup from '../../components/Popup';
import { MdClass, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { NotificationContainer, notifyError, notifySuccess } from '../../toastifyServer';
import { clearCookies, getCookie } from '../../firebase/cookies';
import { auth } from '../../firebase/logar';

// Status dos livros
// 0 => Livre
// 1 => Ocupado

export default function Listar() {

  // Validar Credenciais
  const uidLocal = getCookie('uid') || null;
  const nomeLocal = getCookie('nome') || null;
  const emailLocal = getCookie('email') || null;

  useEffect(() => {
    const verificarLogin = async  () => {
      try {
        auth.onAuthStateChanged( async function(user) {
          if (!user) {
            localStorage.clear();
            clearCookies();
            window.location.href = "/entrar";
          } else {
            if (!nomeLocal || !uidLocal || !emailLocal || uidLocal !== user.uid) {
              localStorage.clear();
              clearCookies();
              window.location.href = "/entrar";
            }
            return true;
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    verificarLogin();
  }, []);
  

  // Animações
  function getTopPositionRelativeToPage(element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.scrollY || window.pageYOffset;
    return rect.top + scrollTop;
  }

  const animacoes = () => {
    const elements = document.querySelectorAll('[data-animation]');
    const classAnimation = "animationClass";
    const windowTop = window.scrollY + ((window.innerHeight * 4.5) / 4);
    
    elements.forEach( async (element) => {
      const positionElemento = await getTopPositionRelativeToPage(element);
      if (Number(windowTop) >= positionElemento - 50) {
        element.classList.add(classAnimation);
      }
    });
  }

  useEffect(() => {
    document.title = 'Leitores Letícia | Livros';
    animacoes();
    window.addEventListener('scroll', animacoes);
    return () => {
      window.removeEventListener('scroll', animacoes);
    };
  }, []);
  
  const navigate = useNavigate();

  // Funcões
  const coletarCategorias = async () => {
    if (carregando) {
      return;
    }
    setCarregando(true);
    try {
      const categoriasList = await getCategory() || [];
      if (categoriasList.length > 0) {
        setCategorias(categoriasList);
      }
      setCarregando(false);
      return;
    } catch (error) { 
      console.log(error);
      return;
    }
  }

  const coletarSeries = async () => {
    if (carregando) {
      return;
    }
    setCarregando(true);
    try {
      const seriesList = await getSeries() || [];
      if (seriesList.length > 0) {
        setSeries(seriesList);
      }
      setCarregando(false);
      return;
    } catch (error) { 
      console.log(error);
      return;
    }
  }

  const coletarLivros = async () => {
    if (carregando) {
      return;
    }
    setCarregando(true);
    try {
      const books = await getBooks();
      setLivros(books);
      setCarregando(false);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const fecharPopups = () => {
    setPopupInfoLivros(false);
    setPopupCadastrarAluno(false);
    setPopupAdicionarLivro(false);
  }

  // Modais
  const [carregando, setCarregando] = useState(false);
  const [popupInfoLivros, setPopupInfoLivros] = useState(false);
  const [popupCadastrarAluno, setPopupCadastrarAluno] = useState(false);
  const [popupAdicionarLivro, setPopupAdicionarLivro] = useState(false);

  // Dados
  useEffect(() => {
    coletarLivros();
  }, []);
  
  const [livros, setLivros] = useState([]);
  const [series, setSeries] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [infoLivro, setInfoLivro] = useState({});

  // Livros
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const livrosPorPagina = 6;

  const indexUltimoLivro = paginaAtual * livrosPorPagina;
  const indexPrimeiroLivro = indexUltimoLivro - livrosPorPagina;
  const livrosPaginaAtual = mostrarTodos ? livros : livros.slice(indexPrimeiroLivro, indexUltimoLivro);

  const totalPaginas = Math.ceil(livros.length / livrosPorPagina);

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
  };

  // Inputs
  const [inputPesquisa, setInputPesquisa] = useState('');
  const [inputNomeAluno, setInputNomeAluno] = useState('');
  const [inputTurmaAluno, setInputTurmaAluno] = useState('');
  const [inputNomeLivro, setInputNomeLivro] = useState('');
  const [inputCategoriaLivro, setInputCategoriaLivro] = useState('');

  const handleUpdateStatusBook = async (uid) => {
    try {
      Swal({
        title: `Você deseja liberar o acesso do livro '${infoLivro.nome}'?`,
        icon: 'warning',
        buttons: {
          confirm: 'Sim',
          cancel: 'Não',
        }
      }).then( async (response) => {
        if (response) {
          const atualizar = await updateStatusBook(uid);
          if (atualizar) {
            notifySuccess('Agora o livro esta livre para qualquer aluno');
            coletarLivros();
            fecharPopups();
          }
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleRegisterStudentBook = async (uid) => {
    if (!inputNomeAluno || !inputTurmaAluno) {
      notifyError('Complete o formulário corretamente!');
      return;
    }
    try {
      await Swal({
        title: `Você deseja cadastrar o aluno(a) '${inputNomeAluno}' como responsável do livro '${infoLivro.nome}'?`,
        icon: 'warning',
        buttons: {
          confirm: 'Sim',
          cancel: 'Não',
        }
      }).then( async (response) => {
        if (response) {
          const dataColeta = new Date().toLocaleDateString('pt-BR');
          const dataEntrega = new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('pt-BR');

          const cadastrar = await setStudentBook({
            uid: uid,
            aluno: inputNomeAluno,
            turma: inputTurmaAluno,
            data_coleta: dataColeta,
            data_entrega: dataEntrega,
          });
          if (cadastrar) {
            notifySuccess(`Agora o livro '${infoLivro.nome}' esta ocupado pelo aluno(a) '${inputNomeAluno}'`);
            coletarLivros();
            fecharPopups();
          }
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleCreateBook = async () => {
    if (!inputNomeLivro || !inputCategoriaLivro) {
      notifyError('Complete o formulário corretamente!');
      return;
    }
    try {
      Swal({
        title: `Você deseja adicionar o livro '${inputNomeLivro}'?`,
        icon: 'warning',
        buttons: {
          confirm: 'Sim',
          cancel: 'Não',
        }
      }).then( async (response) => {
        if (response) {
          const adicionar = await createBook({
            nome: inputNomeLivro,
            categoria: inputCategoriaLivro,
          });
          if (adicionar) {
            notifySuccess(`Livro '${inputNomeAluno} adicionado com sucesso`);
            coletarLivros();
            fecharPopups();
          }
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleDeleteBook = async () => {
    try {
      Swal({
        title: `Você realmente deseja excluír o livro '${infoLivro.nome}'?`,
        icon: 'warning',
        content: {
          element: "input",
          attributes: {
            placeholder: `Digite '${infoLivro.nome}'`,
            type: "text",
          },
        },
        buttons: {
          confirm: 'Sim',
          cancel: 'Não',
        }
      }).then( async (response) => {
        if (response) {
          if (response !== infoLivro.nome) {
            notifyError('O nome digitado não corresponde ao nome do livro');
            return false;
          }
          const excluindo = await deleteBook({
            uid: infoLivro.uid,
          });
          if (excluindo) {
            notifySuccess(`Livro '${infoLivro.nome}' excluído com sucesso`);
            coletarLivros();
            fecharPopups();
          }
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
  
  // Handles Popup
  const handlePopupCadastrar = () => {
    setPopupCadastrarAluno(true);
    coletarSeries();
  }

  const handlePopupAdicionar = () => {
    setPopupAdicionarLivro(true);
    coletarCategorias();
  }

  return (
    <>
      <NotificationContainer />
      <main className='container-livros'>
        <section className='content-livros'>
          
          <div data-animation="top" data-duration-animation="0.6s" className='top'>
            <h1>Livros</h1>
            <div className='input-pesquisar'>
              <IoSearch className='icon' />
              <input onChange={(e) => setInputPesquisa(e.target.value)} maxLength={40} type='text' placeholder='Pesquisar nome do livro, turma ou aluno' />
            </div>
            <button onClick={handlePopupAdicionar}>Adicionar Livro</button>
          </div>

          <div data-animation="top" data-duration-animation="0.7s" className='tabela'>
            <div className='titulo'>
              <h1><IoList className='icon' /> Lista dos Livros</h1>
            </div>

            {/* Livros */}
            <div className='lista'>
              {livros.length > 0 ? (
                livrosPaginaAtual.filter((livro) => {
                  let nomeLivro = livro.nome.toLowerCase().replace(/\u0083/g, '');
                  let nomeAluno = livro.aluno_responsavel ? livro.aluno_responsavel.toLowerCase().replace(/\u0083/g, '') : '';
                  let turmaAluno = livro.turma_aluno ? livro.turma_aluno.toLowerCase().replace(/\u0083/g, '') : '';
                  return nomeLivro.includes(inputPesquisa.toLowerCase()) ||
                    (inputPesquisa.includes('aluno:') && nomeAluno.includes(inputPesquisa.replace("aluno:", "").trim().toLowerCase())) ||
                    (inputPesquisa.includes('turma:') && turmaAluno.includes(inputPesquisa.replace("turma:", "").trim().toLowerCase()));
                }).length ? (
                  livrosPaginaAtual.filter((livro) => {
                    let nomeLivro = livro.nome.toLowerCase().replace(/\u0083/g, '');
                    let nomeAluno = livro.aluno_responsavel ? livro.aluno_responsavel.toLowerCase().replace(/\u0083/g, '') : '';
                    let turmaAluno = livro.turma_aluno ? livro.turma_aluno.toLowerCase().replace(/\u0083/g, '') : '';
                    return nomeLivro.includes(inputPesquisa.toLowerCase()) ||
                      (inputPesquisa.includes('aluno:') && nomeAluno.includes(inputPesquisa.replace("aluno:", "").trim().toLowerCase())) ||
                      (inputPesquisa.includes('turma:') && turmaAluno.includes(inputPesquisa.replace("turma:", "").trim().toLowerCase()));
                  }).map((val, index) => (
                    <div key={index} className='linha'>
                      <div className={`status ${val.status}`}></div>
                      <h1>{val.nome}</h1>
                      <IoEllipsisVertical onClick={() => {
                        setPopupInfoLivros(!popupInfoLivros);
                        setInfoLivro(val);
                      }} className='info' />
                    </div>
                  ))
                ) : (
                  <div className='linha'>
                    <h1>Nenhum livro encontrado com '{inputPesquisa}'</h1>
                  </div>
                )
              ) : (
                <>
                  {carregando ? (
                    <div className='linha'>
                      <h1>Carregando...</h1>
                    </div>
                  ) : (
                    <div className='linha'>
                      <h1>Nenhum livro encontrado</h1>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Paginação */}
          <div data-animation="top" data-duration-animation="0.8s" className='paginacao'>
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index}
                onClick={() => mudarPagina(index + 1)}
                className={paginaAtual === index + 1 ? 'ativo' : ''}
              >
                {index + 1}
              </button>
            ))}
            {!mostrarTodos ? (
              <a onClick={() => setMostrarTodos(true)}>
                Mostrar Todos
              </a>
            ) : (
              <a onClick={() => setMostrarTodos(false)}>
                Mostrar por Página
              </a>
            )}
          </div>

          <div data-animation="top" data-duration-animation="0.9s" className='ajuda'>
            <IoMdHelpCircle className='icon' />
            <p>Precisa de ajuda? Entre em contato com o aluno: <strong>Vitor do 1ºB</strong></p>
          </div>
          
        </section>
      </main>


      {/* Popups */}
      {popupInfoLivros && (
        <Popup titulo={`Informações do livro: ${infoLivro.nome}`} handleClose={() => setPopupInfoLivros(false)}>
          <div className='informacoes'>
            <li>
              <GrStatusGoodSmall className={`icon ${infoLivro.status}`} />
              <h1>Status: <strong>{infoLivro.status}</strong></h1>
            </li>
            <li>
              <MdOutlineDriveFileRenameOutline className='icon' />
              <h1>Nome: <strong>{infoLivro.nome}</strong></h1>
            </li>
            <li>
            <TbCategoryFilled className='icon' />
              <h1>Categoria: <strong>{infoLivro.categoria}</strong></h1>
            </li>
            {infoLivro.status === 'ocupado' && (
              <>
                <li>
                  <IoPerson className='icon' />
                  <h1>Aluno Responsável: <strong>{infoLivro.aluno_responsavel ? infoLivro.aluno_responsavel : 'Inválido'}</strong></h1>
                </li>
                <li>
                  <MdClass className='icon' />
                  <h1>Turma do Aluno: <strong>{infoLivro.turma_aluno ? infoLivro.turma_aluno : 'Inválida'}</strong></h1>
                </li>
                <li>
                  <IoCalendar className='icon' />
                  <h1>Data da coleta: <strong>{infoLivro.data_coleta ? infoLivro.data_coleta : 'Inválida'}</strong></h1>
                </li>
                <li>
                  <IoCalendar className='icon' />
                  <h1>Data da entrega: <strong>{infoLivro.data_entrega ? infoLivro.data_entrega : 'Inválida'}</strong></h1>
                </li>
                <button onClick={() => handleUpdateStatusBook(infoLivro.uid)} className='liberar'>Liberar acesso do livro</button>
              </>
            )}
            <button onClick={handlePopupCadastrar}>Cadastrar aluno ao livro</button>
            <button className='excluir' onClick={handleDeleteBook}>Excluir livro</button>
          </div>
        </Popup>
      )}

      {popupCadastrarAluno && (
        <Popup titulo={`Cadastrar aluno ao livro '${infoLivro.nome}'`} handleClose={() => setPopupCadastrarAluno(false)}>
          <div className='form'>
            <div className='input'>
              <label>Nome do Aluno</label>
              <input onChange={(e) => setInputNomeAluno(e.target.value)} maxLength={50} type='text' placeholder='Digite o nome do aluno' />
            </div>
            <div className='input'>
              <label>Turma do Aluno</label>
              <select onChange={(e) => setInputTurmaAluno(e.target.value)}>
                <option value="">Selecione uma turma</option>
                {series.length > 0 ? (
                  series.map((serie, index) => (
                    <option key={index} value={serie}>{serie}</option>
                  ))
                ) : (
                  <option>Nenhuma turma encontrada</option>
                )}
                {carregando && (
                  <option disabled>Carregando...</option>
                )}
              </select>
            </div>
            <button onClick={() => handleRegisterStudentBook(infoLivro.uid)}>Cadastrar</button>
          </div>
        </Popup>
      )}

      {popupAdicionarLivro && (
        <Popup titulo={`Adicionar livro na biblioteca`} handleClose={() => setPopupAdicionarLivro(false)}>
          <div className='form'>
            <div className='input'>
              <label>Nome do Livro</label>
              <input onChange={(e) => setInputNomeLivro(e.target.value)} maxLength={70} type='text' placeholder='Digite o nome do livro' />
            </div>
            <div className='input'>
              <label>Categoria do Livro</label>
              <select onChange={(e) => setInputCategoriaLivro(e.target.value)}>
                <option value="">Selecione uma categoria</option>
                {categorias.length > 0 ? (
                  categorias.map((serie, index) => (
                    <option key={index} value={serie}>{serie}</option>
                  ))
                ) : (
                  <option>Nenhuma categoria encontrada</option>
                )}
                {carregando && (
                  <option disabled>Carregando...</option>
                )}
              </select>
            </div>
            <button onClick={handleCreateBook}>Adicionar</button>
          </div>
        </Popup>
      )}
    </>
  )
}