import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import InputMask from "react-input-mask";
import "./EstiloFormulario.css";

export default function FormCadAtividades(props) {
  const [validado, setValidado] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [tipoAtividades, setTipoAtividades] = useState([]);
  const [atividade, setAtividade] = useState({
    codigo: "",
    horario: "",
    dia_semana: "",
    tipoAtividade: {},
    membros: [],
  });
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(1);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const diasDaSemana = [
    { id: 1, nome: "Segunda-feira" },
    { id: 2, nome: "Terça-feira" },
    { id: 3, nome: "Quarta-feira" },
    { id: 4, nome: "Quinta-feira" },
    { id: 5, nome: "Sexta-feira" },
    { id: 6, nome: "Sábado" },
  ];

  function selecionarTipoAtividade(evento) {
    const codigoTipoAtividade = evento.currentTarget.value;
    setAtividade({
      ...atividade,
      tipoAtividade: {
        codigo: codigoTipoAtividade,
      },
    });
  }

  function buscarTipoAtividades() {
    fetch("http://localhost:4000/tipoAtividade", { method: "GET" })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          setTipoAtividades(retorno.listaTipoAtividades);
        } else {
          setTipoAtividades([]);
        }
      })
      .catch((erro) => {
        setTipoAtividades([
          {
            codigo: 0,
            serie: "Erro ao Recuperar Tipo de Atividade: " + erro.message,
          },
        ]);
      });
  }

  function buscarAlunos() {
    fetch("http://localhost:4000/aluno")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao buscar alunos: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status && Array.isArray(data.listaAlunos)) {
          // Verifica se a resposta tem status true e se listaAlunos é um array
          setAlunosDisponiveis(data.listaAlunos);
        } else {
          throw new Error("Formato de resposta inesperado ou status false");
        }
      })
      .catch((erro) => console.error("Erro ao buscar alunos:", erro));
  }

  useEffect(() => {
    buscarTipoAtividades();
    buscarAlunos();
  }, []);

  useEffect(() => {
    if (alunosDisponiveis.length > 0 && tipoAtividades.length > 0) {
      setDadosCarregados(true);
    }
  }, [alunosDisponiveis, tipoAtividades]);

  useEffect(() => {
    if (props.atividadeParaEditar) {
      const tipoAtividadeSelecionada = tipoAtividades.find(
        (tipoAtividade) =>
          tipoAtividade.codigo ===
          props.atividadeParaEditar.tipoAtividade.codigo
      );
      setAtividade({
        ...props.atividadeParaEditar,
        tipoAtividade:
          tipoAtividadeSelecionada || props.atividadeParaEditar.tipoAtividade,
      });
    }
  }, [props.atividadeParaEditar, tipoAtividades]);

  function criarAtividade() {
    // Confirma que o tipo de atividade selecionado é válido
    const tipoAtividadeSelecionado = tipoAtividades.find(
      (tipo) =>
        tipo.codigo.toString() === atividade.tipoAtividade.codigo.toString()
    );
    if (!tipoAtividadeSelecionado) {
      alert("Tipo de atividade inválido!");
      return;
    }

    // Prepara a atividade para enviar, incluindo a transformação do dia da semana e dos membros
    const atividadeParaEnviar = {
      ...atividade,
      dia_semana: diaSelecionado, // Certifica-se de usar o estado 'diaSelecionado' para o dia da semana
      tipoAtividade: { codigo: atividade.tipoAtividade.codigo }, // Mantém o objeto para tipoAtividade como esperado pelo backend
      membros: atividade.membros.map((membro) => ({
        ra: membro.ra,
        data_inscricao: membro.dataInscricao, // Garante que a data de inscrição esteja no formato esperado pelo backend
      })),
    };

    console.log("Enviando atividade:", atividadeParaEnviar); // Para depuração

    fetch("http://localhost:4000/atividadeExtracurricular", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(atividadeParaEnviar),
    })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          alert("Atividade Extracurricular criada com sucesso!");
          // Atualização após a criação com sucesso para incluir o novo código gerado
          const novaAtividade = {
            ...atividadeParaEnviar,
            codigo: retorno.codigoGerado, // Supondo que 'codigoGerado' seja retornado pelo backend
            tipoAtividade: tipoAtividadeSelecionado,
          };
          props.setListaAtividades((prevAtividades) => [
            ...prevAtividades,
            novaAtividade,
          ]);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao salvar a atividade: " + erro.message);
      });
  }

  function atualizarAtividade() {
    const confirmar = window.confirm("Deseja atualizar esta atividade?");
    if (!confirmar) return;

    const corpoRequisicao = JSON.stringify({
      codigo: atividade.codigo,
      horario: atividade.horario,
      dia_semana: atividade.dia_semana,
      tipoAtividade: { codigo: atividade.tipoAtividade.codigo },
    });

    fetch("http://localhost:4000/atividadeExtracurricular", {
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
          alert("Atividade atualizada com sucesso!");

          const detalhesTipoAtividade = tipoAtividades.find(
            (tipoAtividade) =>
              tipoAtividade.codigo.toString() ===
              atividade.tipoAtividade.codigo.toString()
          );
          const atividadeAtualizado = {
            ...atividade,
            tipoAtividade: detalhesTipoAtividade,
          };

          const novaLista = props.listaAtividades.map((atividade) => {
            if (atividade.codigo === atividadeAtualizado.codigo) {
              return atividadeAtualizado;
            }
            return atividade;
          });

          props.setListaAtividades(novaLista);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao atualizar a atividade: " + erro.message);
      });
  }

  function manipularSubmissao(evento) {
    evento.preventDefault();
    if (!evento.currentTarget.checkValidity()) {
      setValidado(true);
      return;
    }

    const membros = [];
    for (let i = 0; i < quantidadeAlunos; i++) {
      const alunoCodigo = evento.currentTarget[`aluno-${i}`].value;
      const dataInscricao = evento.currentTarget[`data-inscricao-${i}`].value;
      membros.push({ ra: alunoCodigo, dataInscricao });
    }

    const atividadeAtualizada = {
      ...atividade,
      membros,
    };

    if (atividade.codigo) {
      atualizarAtividade();
    } else {
      criarAtividade(atividadeAtualizada);
    }
  }

  const adicionarCampoAlunos = () => {
    setAtividade((prevAtividade) => ({
      ...prevAtividade,
      membros: [
        ...prevAtividade.membros,
        { ra: "", dataInscricao: "" }, // Inicializa com valores vazios
      ],
    }));
    setQuantidadeAlunos(quantidadeAlunos + 1);
  };

  const removerCampoAlunos = (index) => {
    if (index === 0 && quantidadeAlunos === 1) {
      return;
    }

    setAtividade((prevAtividade) => ({
      ...prevAtividade,
      membros: prevAtividade.membros.filter((_, i) => i !== index),
    }));
    setQuantidadeAlunos(quantidadeAlunos - 1);
  };

  const renderizarCampoAlunos = () => {
    let campos = [];
    for (let i = 0; i < quantidadeAlunos; i++) {
      campos.push(
        <div className="row align-items-center" key={i}>
          <div className="col-6">
            <div className="form-group borda-form">
              <Form.Label className="custom-label" htmlFor={`aluno-${i}`}>
                Aluno:
              </Form.Label>
              <Form.Control
                as="select"
                custom
                id={`aluno-${i}`}
                name={`aluno-${i}`}
                className="form-control form-control-sm"
                value={atividade.membros[i] ? atividade.membros[i].ra : ""}
                onChange={(event) => {
                  const membrosAtualizados = [...atividade.membros];
                  membrosAtualizados[i] = {
                    ...membrosAtualizados[i],
                    ra: event.target.value,
                  };
                  setAtividade({
                    ...atividade,
                    membros: membrosAtualizados,
                  });
                }}
              >
                <option value="">Selecione um aluno...</option>
                {alunosDisponiveis.map((aluno) => (
                  <option key={aluno.ra} value={aluno.ra}>
                    {aluno.nome}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group borda-form">
              <Form.Label
                className="custom-label"
                htmlFor={`data-inscricao-${i}`}
              >
                Data de Inscrição:
              </Form.Label>
              <Form.Control
                type="date"
                id={`data-inscricao-${i}`}
                name={`data-inscricao-${i}`}
                className="form-control form-control-sm"
                value={
                  atividade.membros[i] ? atividade.membros[i].dataInscricao : ""
                }
                onChange={(event) => {
                  const membrosAtualizados = [...atividade.membros];
                  membrosAtualizados[i] = {
                    ...membrosAtualizados[i],
                    dataInscricao: event.target.value,
                  };
                  setAtividade({
                    ...atividade,
                    membros: membrosAtualizados,
                  });
                }}
                required
              />
            </div>
          </div>

          <div className="col-12 d-flex justify-content-end">
            {i === quantidadeAlunos - 1 && (
              <button
                type="button"
                onClick={adicionarCampoAlunos}
                className="btn btn-success mr-2"
              >
                Adicionar
              </button>
            )}

            {i > 0 && (
              <button
                type="button"
                onClick={() => removerCampoAlunos(i)}
                className="btn btn-danger"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      );
    }
    return campos;
  };

  return (
    <div>
      <Form noValidate validated={validado} onSubmit={manipularSubmissao}>
        <Row className="mb-3">
          <Col md="6">
            <div className="form-group borda-form">
              <Form.Label className="custom-label">
                <i className="bi bi-credit-card custom-icon"></i>
                Código da Atividade
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="0"
                value={atividade.codigo}
                id="codigo"
                name="codigo"
                onChange={() => {}}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe o Código da Atividade.
              </Form.Control.Feedback>
            </div>
          </Col>
          <Col md="6">
            <div className="form-group borda-form">
              <Form.Label className="custom-label">
                <i className="bi bi-calendar custom-icon"></i>
                Dia da Semana
              </Form.Label>
              <Form.Control
                as="select"
                required
                value={diaSelecionado}
                onChange={(event) => setDiaSelecionado(event.target.value)}
              >
                <option value="">Selecione...</option>
                {diasDaSemana.map((dia) => (
                  <option key={dia.id} value={dia.nome}>
                    {dia.nome}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Por favor, informe o Dia da Semana da Atividade.
              </Form.Control.Feedback>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6">
            <div className="form-group borda-form">
              <Form.Label className="custom-label">
                <i className="bi bi-person-vcard custom-icon"></i>
                Horário da Atividade:
              </Form.Label>
              <InputMask
                mask="99:99"
                maskChar="0"
                value={atividade.horario}
                onChange={(event) =>
                  setAtividade({ ...atividade, horario: event.target.value })
                }
              >
                {(inputProps) => (
                  <Form.Control
                    {...inputProps}
                    type="text"
                    placeholder="hh:mm"
                    required
                    id="horario"
                    name="horario"
                  />
                )}
              </InputMask>
              <Form.Control.Feedback type="invalid">
                Por favor, informe o Horário da Atividade no formato hh:mm.
              </Form.Control.Feedback>
            </div>
          </Col>
          <Col md="6">
            <div className="form-group borda-form">
              <Form.Label className="custom-label">
                <i className="bi bi-people-fill custom-icon"></i>
                Tipo de Atividade:
              </Form.Label>
              <Form.Select
                id="tipoAtividade"
                name="tipoAtividade"
                value={atividade.tipoAtividade.codigo || ""}
                onChange={selecionarTipoAtividade}
                onBlur={() => {}}
              >
                <option key={0} value={0}>
                  Selecione...
                </option>
                {tipoAtividades.map((tipoAtividade) => (
                  <option
                    key={tipoAtividade.codigo}
                    value={tipoAtividade.codigo}
                  >
                    {tipoAtividade.nome}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, informe o tipo de atividade.
              </Form.Control.Feedback>
            </div>
          </Col>
        </Row>

        {renderizarCampoAlunos()}

        <div className="buttons-container">
          <button type="submit" className="btn-vinho btn-spacing">
            GRAVAR
          </button>
          <button
            className="btn-vinho"
            onClick={() => {
              props.setExibirTabela(true);
            }}
          >
            VOLTAR
          </button>
        </div>
      </Form>
    </div>
  );
}