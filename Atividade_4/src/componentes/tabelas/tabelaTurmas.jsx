import { Button, Table } from "react-bootstrap";
import "../formularios/EstiloFormulario.css";

export default function TabelaTurmas(props) {
  function excluirTurma(turmaCodigo) {
    const confirmar = window.confirm("Deseja excluir esta turma?");
    if (!confirmar) {
      return;
    }

    fetch(`http://localhost:4000/turma`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ turma_codigo: turmaCodigo }),
    })
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Não foi possível excluir a turma.");
        }
        return resposta.json();
      })
      .then(() => {
        alert("Turma excluída com sucesso!");

        const novaLista = props.listaTurmas.filter(
          (turma) => turma.codigo !== turmaCodigo
        );
        props.setListaTurmas(novaLista);
      })
      .catch((erro) => {
        alert("Erro ao excluir a turma: " + erro.message);
      });
  }

  const estiloTitulo = {
    textAlign: "center", // Centraliza horizontalmente
  };

  return (
    <div>
      <div
        className="button-container centralizar"
        style={{ marginBottom: "20px" }}
      >
        <button
          className="btn-vinho btn-rounded"
          onClick={() => {
            props.setExibirTabela(false);
          }}
        >
          <i className="bi bi-plus-circle"></i>
        </button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={estiloTitulo}>Código</th>
            <th style={estiloTitulo}>Série</th>
            <th style={estiloTitulo}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {props.listaTurmas?.map((turma, index) => {
            return (
              <tr>
                <td>{turma.codigo}</td>
                <td>{turma.serie}</td>
                <td>
                  <Button
                    className="btn-vinho" // Adicione a classe btn-vinho
                    variant="primary"
                    onClick={() => {
                      props.editarTurma(turma);
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
                    className="btn-vinho" // Adicione a classe btn-vinho
                    variant="danger"
                    onClick={() => excluirTurma(turma.codigo)}
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
