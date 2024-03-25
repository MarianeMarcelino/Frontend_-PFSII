import { Button, Table } from "react-bootstrap";
import "../formularios/EstiloFormulario.css";
export default function TabelaAlunos(props) {
  function excluirAluno(alunoRa) {
    const confirmar = window.confirm("Deseja excluir este aluno?");
    if (!confirmar) {
      return;
    }

    fetch(`http://localhost:4000/aluno`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aluno_ra: alunoRa }),
    })
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Não foi possível excluir o aluno.");
        }
        return resposta.json();
      })
      .then(() => {
        alert("Aluno excluído com sucesso!");

        const novaLista = props.listaAlunos.filter((a) => a.ra !== alunoRa);
        props.setListaAlunos(novaLista);
      })
      .catch((erro) => {
        alert("Erro ao excluir o aluno: " + erro.message);
      });
  }

  const estiloTitulo = {
    textAlign: "center", // Centraliza horizontalmente
  };

  return (
    <div>
      <div className="button-container centralizar" style={{ marginBottom: "20px" }}>
        <button
          className="btn-vinho btn-rounded"
          onClick={() => {
            props.setExibirTabela(false);
            props.resetForm();
          }}
        >
          <i className="bi bi-plus-circle"></i>
        </button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={estiloTitulo}>Nome</th>
            <th style={estiloTitulo}>RA</th>
            <th style={estiloTitulo}>Data de Nascimento</th>
            <th style={estiloTitulo}>Telefone</th>
            <th style={estiloTitulo}>Email</th>
            <th style={estiloTitulo}>CPF</th>
            <th style={estiloTitulo}>Turma</th>
            <th style={estiloTitulo}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.listaAlunos?.map((aluno, index) => {
            return (
              <tr>
                <td>{aluno.nome}</td>
                <td>{aluno.ra}</td>
                <td>{new Date(aluno.dataNascimento).toLocaleDateString()}</td>
                <td>{aluno.telefone}</td>
                <td>{aluno.email}</td>
                <td>{aluno.cpf}</td>
                <td>{aluno.turma.serie}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      props.editarAluno(aluno);
                      props.setExibirTabela(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => excluirAluno(aluno.ra)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-archive"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                    </svg>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
