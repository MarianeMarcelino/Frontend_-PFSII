import FormCadTurmas from "../formularios/formCadTurmas";
import TabelaTurmas from "../tabelas/tabelaTurmas";
import Pagina from "../template/pagina";
import { useState, useEffect } from "react";

export default function TelaCadastroTurma(props) {
  const [exibirTabela, setExibirTabela] = useState(true);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);

  function buscarTurmas() {
    fetch("http://localhost:4000/turma", { method: "GET" })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          setListaTurmas(retorno.listaTurmas);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro:" + erro.message);
      });
  }

  useEffect(() => {
    buscarTurmas();
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
            Lista de Turmas
          </h2>
          <TabelaTurmas
            listaTurmas={listaTurmas}
            setExibirTabela={setExibirTabela}
            editarTurma={setTurmaParaEditar}
            setListaTurmas={setListaTurmas}
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
            Cadastro de Turmas
          </h2>
          <FormCadTurmas
            setExibirTabela={setExibirTabela}
            listaTurmas={listaTurmas} 
            setListaTurmas={setListaTurmas} 
            turmaParaEditar={turmaParaEditar} 
            setTurmaParaEditar={setTurmaParaEditar} 
          />
        </Pagina>
      </div>
    );
  }
}
