import FormCadAtividades from "../formularios/formCadAtividade";
import TabelaAtividades from "../tabelas/tabelaAtividades";
import Pagina from "../template/pagina";
import { useState, useEffect } from "react";

export default function TelaCadastroAtividade(props) {
  function resetForm() {
    setAtividadeParaEditar(null);
  }

  const [exibirTabela, setExibirTabela] = useState(true);
  const [listaAtividades, setListaAtividades] = useState([]);
  const [atividadeParaEditar, setAtividadeParaEditar] = useState(null);

  function buscarAtividades() {
    fetch("http://localhost:4000/atividadeExtracurricular", { method: "GET" })
        .then((resposta) => resposta.json())
        .then((retorno) => {
            console.log("Retorno do backend:", retorno); // Adicione esta linha
            if (retorno.status) {
                setListaAtividades(retorno.listaAtividadeExtracurricular);
            } else {
                alert(retorno.mensagem);
            }
        })
        .catch((erro) => {
            console.error("Erro ao buscar atividades:", erro);
        });
}


  useEffect(() => {
    buscarAtividades();
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
            Lista de Atividades
          </h2>
          <TabelaAtividades
            listaAtividades={listaAtividades}
            setExibirTabela={setExibirTabela}
            editarAtividade={setAtividadeParaEditar}
            setListaAtividades={setListaAtividades}
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
            Cadastro de Atividades Extracurriculares
          </h2>
          <FormCadAtividades
            setExibirTabela={setExibirTabela}
            listaAtividades={listaAtividades}
            setListaAtividades={setListaAtividades}
            atividadeParaEditar={atividadeParaEditar}
            setAtividadeParaEditar={setAtividadeParaEditar}
          />
        </Pagina>
      </div>
    );
  }
}
