import "./EstiloFormulario.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import {
  validarNome,
  validarCPF,
  validarEmail,
  validarCelular,
} from "../formularios/validacoes";

export default function FormCadAlunos(props) {
  const [validado, setValidado] = useState(false);
  const [turmas, setTurmas] = useState([
    {
      codigo: 0,
      serie: "Nenhuma Turma Encontrada!",
    },
  ]);
  const [aluno, setAluno] = useState({
    ra: "",
    nome: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    cpf: "",
    turma: {},
  });

  function selecionarTurma(evento) {
    const codigoTurma = evento.currentTarget.value;
    setAluno({
      ...aluno,
      turma: {
        codigo: codigoTurma,
      },
    });
  }

  function buscarTurmas() {
    fetch("http://localhost:4000/turma", { method: "GET" })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          setTurmas(retorno.listaTurmas);
        }
      })
      .catch((erro) => {
        setTurmas([
          {
            codigo: 0,
            serie: "Erro ao Recuperar Turmas: " + erro.message,
          },
        ]);
      });
  }

  useEffect(() => {
    buscarTurmas();
  }, []);

  useEffect(() => {
    if (props.alunoParaEditar) {
      // Converte a data para o formato esperado pelo input de data, se necessário
      const dataFormatada = props.alunoParaEditar.dataNascimento.split("T")[0];
      const turmaSelecionada = turmas.find(
        (turma) => turma.codigo === props.alunoParaEditar.turma.codigo
      );
      setAluno({
        ...props.alunoParaEditar,
        dataNascimento: dataFormatada,
        turma: turmaSelecionada || props.alunoParaEditar.turma, // Aqui garante que a turma seja definida corretamente
      });
    }
  }, [props.alunoParaEditar, turmas]); // turmas é adicionado como dependência

  useEffect(() => {
    if (props.alunoParaEditar) {
      setAluno(props.alunoParaEditar);
    }
  }, [props.alunoParaEditar]);
  function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
    valor = valor.slice(0, 11); // Limita o tamanho a 11 dígitos

    return valor
      .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen antes dos últimos 4 dígitos
  }

  function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
    valor = valor.slice(0, 11); // Limita o tamanho a 11 dígitos

    return valor
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos, novamente (para o segundo bloco de números)
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen antes dos dois últimos dígitos
  }

  function manipularMudanca(evento) {
    const { name, value } = evento.currentTarget;
    let valorFormatado = value;

    if (name === "telefone") {
      valorFormatado = mascaraTelefone(value);
    } else if (name === "cpf") {
      valorFormatado = mascaraCPF(value);
    }

    setAluno({ ...aluno, [name]: valorFormatado });
  }

  function criarAluno() {
    fetch("http://localhost:4000/aluno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aluno),
    })
      .then((resposta) => resposta.json())
      .then((retorno) => {
        if (retorno.status) {
          alert("Aluno criado com sucesso!");

          // Encontrar detalhes completos da turma pelo código
          const detalhesTurma = turmas.find(
            (turma) => turma.codigo.toString() === aluno.turma.codigo.toString()
          );

          const novoAluno = {
            ...aluno,
            ra: retorno.raGerado,
            turma: detalhesTurma, // Adicionar detalhes completos da turma
          };

          props.setListaAlunos((prevAlunos) => [...prevAlunos, novoAluno]);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao salvar o aluno: " + erro.message);
      });
  }

  function atualizarAluno() {
    const confirmar = window.confirm("Deseja atualizar este aluno?");
    if (!confirmar) return;

    const corpoRequisicao = JSON.stringify({
      aluno_ra: aluno.ra,
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento,
      telefone: aluno.telefone,
      email: aluno.email,
      cpf: aluno.cpf,
      turma: { codigo: aluno.turma.codigo },
    });

    fetch("http://localhost:4000/aluno", {
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
          alert("Aluno atualizado com sucesso!");

          const detalhesTurma = turmas.find(
            (turma) => turma.codigo.toString() === aluno.turma.codigo.toString()
          );
          const alunoAtualizado = { ...aluno, turma: detalhesTurma };

          const novaLista = props.listaAlunos.map((aluno) => {
            if (aluno.ra === alunoAtualizado.ra) {
              return alunoAtualizado;
            }
            return aluno;
          });

          props.setListaAlunos(novaLista);
          props.setExibirTabela(true);
        } else {
          alert(retorno.mensagem);
        }
      })
      .catch((erro) => {
        alert("Erro ao atualizar o aluno: " + erro.message);
      });
  }

  function manipularSubmissao(evento) {
    evento.preventDefault();
    if (!evento.currentTarget.checkValidity()) {
      setValidado(true);
      return;
    }
    aluno.ra ? atualizarAluno() : criarAluno();
  }

  function validarCampoHTML5(input) {
    if (input.validity.valid) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  return (
    <Form noValidate validated={validado} onSubmit={manipularSubmissao}>
      <Row className="mb-3">
        <Col md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i class="bi bi-credit-card custom-icon"></i>
              RA
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="0"
              value={aluno.ra}
              id="ra"
              name="ra"
              onChange={manipularMudanca}
              disabled
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe o RA do Aluno.
            </Form.Control.Feedback>
          </div>
        </Col>
        <Col md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i className="bi bi-person-vcard custom-icon"></i>
              Nome Completo:
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nome Completo"
              value={aluno.nome}
              id="nome"
              name="nome"
              onChange={manipularMudanca}
              onBlur={(event) => validarNome(event.target)}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe o Nome Completo do Aluno.
            </Form.Control.Feedback>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i className="bi bi-calendar custom-icon"></i>
              Data de Nascimento
            </Form.Label>
            <Form.Control
              type="date"
              placeholder=""
              required
              value={aluno.dataNascimento}
              id="dataNascimento"
              name="dataNascimento"
              onChange={manipularMudanca}
              onBlur={(event) => validarCampoHTML5(event.target)}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe a Data de Nascimento do Aluno.
            </Form.Control.Feedback>
          </div>
        </Form.Group>
        <Form.Group as={Col} md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i class="bi bi-telephone custom-icon"></i>
              Telefone:
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="(99) 99999-9999"
              id="telefone"
              name="telefone"
              value={aluno.telefone}
              onChange={manipularMudanca}
              onBlur={(event) => validarCelular(event.target)}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe o Telefone do Aluno
            </Form.Control.Feedback>
          </div>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i class="bi bi-envelope-at custom-icon"></i>
              E-mail:
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="email@gmail.com"
              id="email"
              name="email"
              value={aluno.email}
              onChange={manipularMudanca}
              onBlur={(event) => validarEmail(event.target)}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, informe o E-mail.
            </Form.Control.Feedback>
          </div>
        </Form.Group>
        <Form.Group as={Col} md="6">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i class="bi bi-credit-card custom-icon"></i>
              CPF:
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="999.999.999-99"
              id="cpf"
              name="cpf"
              value={aluno.cpf}
              onChange={manipularMudanca}
              onBlur={(event) => validarCPF(event.target)}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, o CPF do aluno.
            </Form.Control.Feedback>
          </div>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12">
          {" "}
          <div className="form-group borda-form">
            <Form.Label className="custom-label">
              <i className="bi bi-people-fill custom-icon"></i>
              Turma:
            </Form.Label>
            <Form.Select
              id="turma"
              name="turma"
              value={aluno.turma.codigo || ""}
              onChange={selecionarTurma}
              onBlur={(event) => validarCampoHTML5(event.target)}
            >
              <option key={0} value={0}>
                Selecione...
              </option>
              {turmas.map((turma) => {
                return (
                  <option key={turma.codigo} value={turma.codigo}>
                    {turma.serie}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor, informe a turma do Aluno.
            </Form.Control.Feedback>
          </div>
        </Form.Group>
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
