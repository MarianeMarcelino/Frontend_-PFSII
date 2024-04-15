import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import "./EstiloFormulario.css";

export default function FormCadTurmas(props) {
  const [validado, setValidado] = useState(false);
  const [turma, setTurma] = useState({
    codigo: "",
    serie: "",
  });

  useEffect(() => {
    if (props.turmaParaEditar) {
      setTurma(props.turmaParaEditar);
    }
  }, [props.turmaParaEditar]);

  function manipularMudanca(evento) {
    const componente = evento.currentTarget;
    setTurma({ ...turma, [componente.name]: componente.value });
  }

  function criarTurma() {
    fetch("http://localhost:4000/turma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turma),
    })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          alert("Turma criada com sucesso!");
          const novaTurma = { ...turma, codigo: retorno.codigoGerado };
          props.setListaTurmas([...props.listaTurmas, novaTurma]);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao salvar a turma: " + erro.message);
      });
  }

  function atualizarTurma() {
    const confirmar = window.confirm("Deseja atualizar esta turma?");
    if (!confirmar) {
      return;
    }

    const corpoRequisicao = JSON.stringify({
      serie: turma.serie,
      turma_codigo: turma.codigo,
    });

    fetch("http://localhost:4000/turma", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: corpoRequisicao,
    })
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(
            `Erro na rede: ${resposta.statusText} (status: ${resposta.status})`
          );
        }
        return resposta.json();
      })
      .then((retorno) => {
        if (retorno.status) {
          alert("Turma atualizada com sucesso!");

          const turmaAtualizada = {
            ...turma,
            serie: turma.serie,
            codigo: turma.codigo,
          };
          const listaAtualizada = props.listaTurmas.map((t) =>
            t.codigo === turmaAtualizada.codigo ? turmaAtualizada : t
          );
          props.setListaTurmas(listaAtualizada);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao atualizar a turma: " + erro.message);
      });
  }

  function manipularSubmissao(evento) {
    evento.preventDefault();
    if (!evento.currentTarget.checkValidity()) {
      setValidado(true);
      return;
    }
    turma.codigo ? atualizarTurma() : criarTurma();
  }

  return (
    <Form noValidate validated={validado} onSubmit={manipularSubmissao}>
      <Row className="mb-3">
        <Col md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i class="bi bi-credit-card custom-icon"></i>
              Código
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="0"
              value={turma.codigo}
              id="codigo"
              name="codigo"
              onChange={manipularMudanca}
              disabled
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe o Código da Turma.
            </Form.Control.Feedback>
          </div>
        </Col>
        <Col md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i className="bi bi-person-vcard custom-icon"></i>
            Série:
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Série"
              value={turma.serie}
              id="serie"
              name="serie"
              onChange={manipularMudanca}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe a Série da Turma.
            </Form.Control.Feedback>
          </div>
        </Col>
      </Row>

      <div className="buttons-container">
        <button type="submit" class="btn-vinho btn-spacing">
          GRAVAR
        </button>
        <button
          class="btn-vinho"
          onClick={() => {
            props.setExibirTabela(true);
          }}
        >
          VOLTAR
        </button>
      </div>
      
    </Form>
  );
}
