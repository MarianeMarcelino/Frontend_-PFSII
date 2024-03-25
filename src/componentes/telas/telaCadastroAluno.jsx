import FormCadAlunos from "../formularios/formCadAlunos";
import TabelaAlunos from "../tabelas/tabelaAlunos";
import Pagina from "../template/pagina";
import { useState, useEffect } from "react";

export default function TelaCadastroAluno(props) {
  function resetForm() {
    setAlunoParaEditar(null);
  }

  const [exibirTabela, setExibirTabela] = useState(true);
  const [listaAlunos, setListaAlunos] = useState([]);
  const [alunoParaEditar, setAlunoParaEditar] = useState(null);

  function buscarAlunos() {
    fetch("http://localhost:4000/aluno", { method: "GET" })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          setListaAlunos(retorno.listaAlunos);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro:" + erro.message);
      });
  }

  useEffect(() => {
    buscarAlunos();
  }, []);

  const estiloTitulo = {
    color: "#800020", // Cor vinho
    textAlign: "center", // Centraliza horizontalmente
    marginBottom: '1rem', // Adiciona margem inferior para pular uma linha
  };

  const estiloIcone = {
    marginRight: '0.7rem', // Adiciona espaço à direita do ícone
  };


  if (exibirTabela) {
    return (
      <div>
        <Pagina>
          <h2 style={estiloTitulo}>
            <i className="bi bi-journal-text" style={estiloIcone}></i>
            Lista de Alunos
          </h2>
          <TabelaAlunos
            listaAlunos={listaAlunos}
            setExibirTabela={setExibirTabela}
            editarAluno={setAlunoParaEditar}
            setListaAlunos={setListaAlunos}
            resetForm={resetForm}
          />
        </Pagina>
      </div>
    );
  } else {
    return (
      <div>
        <Pagina>
          <h2 style={estiloTitulo}>
            <i className="bi bi-plus-circle" style={estiloIcone}></i>
            Cadastro de Alunos
          </h2>
          <FormCadAlunos
            setExibirTabela={setExibirTabela}
            listaAlunos={listaAlunos}
            setListaAlunos={setListaAlunos}
            alunoParaEditar={alunoParaEditar}
            setAlunoParaEditar={setAlunoParaEditar}
          />
        </Pagina>
      </div>
    );
  }
}
