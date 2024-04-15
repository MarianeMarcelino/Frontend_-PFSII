import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import BarraBusca from "../meusComponentes/busca/BarraBusca";
import CaixaSelecao from "../meusComponentes/busca/CaixaSelecao";
import TabelaInscricao from "../tabelas/TabelaInscricao";
import "./FormCadInscricao.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const getInitialState = () => ({
  dataInscricao: new Date().toISOString().slice(0, 10),
  horarioInscricao: new Date().toTimeString().slice(0, 5),
  candidato: {},
  vagas: [],
});

export default function FormCadInscricao(props) {
  const [validado, setValidado] = useState(false);
  const [listaCandidatos, setListaCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState({});
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [inscricao, setInscricao] = useState(getInitialState());

  useEffect(() => {
    fetch("http://localhost:4000/candidato")
      .then((response) => response.json())
      .then((data) => setListaCandidatos(data))
      .catch((error) => alert("Erro ao recuperar os candidatos do backend."));
  }, []);

  function gravarInscricao() {
    const inscricaoData = {
      candidato_cpf: candidatoSelecionado.cpf,
      vaga_codigo: inscricao.vagas.map((v) => v.codigo),
      dataInscricao: inscricao.dataInscricao,
      horarioInscricao: inscricao.horarioInscricao,
    };

    fetch("http://localhost:4000/inscricao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inscricaoData),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.status) {
          // Reinicia todos os estados relacionados ao formulário
          setInscricao(getInitialState());
          setCandidatoSelecionado({}); // Garante que a seleção do candidato é resetada
          setVagaSelecionada(null); // Garante que a seleção da vaga é resetada
          alert(dados.mensagem);
        } else {
          alert(dados.mensagem);
        }
      })
      .catch((erro) => {
        console.error("There was a problem with your fetch operation:", erro);
        alert(erro.message);
      });
  }

  const manipulaSubmissao = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.checkValidity()) {
      setValidado(false);
      gravarInscricao();
    } else {
      setValidado(true);
    }
  };
  return (
    <div className="container-cinza-claro">
      <div className="form-wrapper">
        <div className="header-wrapper">
          <h2 className="titulo-vagas">
            <i
              className="bi bi-briefcase titulo-icone "
              role="img"
              aria-label="Vagas de Emprego"
            ></i>
            Vagas de Emprego
          </h2>
        </div>

        <Form noValidate validated={validado} onSubmit={manipulaSubmissao}>
          <Container className="d-flex justify-content-center align-items-start mt-2">
            <Row>
              <Col md={6} className="d-flex justify-content-end pr-2">
                <div className="custom-card square-date">
                  <Form.Group controlId="dataVenda">
                    <Form.Label>
                      <span className="icon-and-border">
                        <i className="bi bi-calendar-date"></i>
                        <span className="vertical-bar"></span>
                      </span>
                      Data de Inscrição:
                    </Form.Label>
                    <Form.Control
                      type="date"
                      required
                      name="dataInscricao"
                      value={inscricao.dataInscricao}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </Col>
              <Col md={6} className="d-flex justify-content-start pl-2">
                <div className="custom-card square-time">
                  <Form.Group controlId="horarioInscricao">
                    <Form.Label>
                      <span className="icon-and-border">
                        <i className="bi bi-clock"></i>
                        <span className="vertical-bar"></span>
                      </span>
                      Horário de Inscrição:
                    </Form.Label>
                    <Form.Control
                      type="time"
                      required
                      name="horarioInscricao"
                      value={inscricao.horarioInscricao}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Container>

          <Row>
            <Col md="12">
              <div className="candidato-container">
                <Form.Group controlId="valorTotalTributos">
                  <Form.Label className="candidato-title">
                    <i className="bi bi-person-fill"></i>
                    <span className="vertical-bar"></span>{" "}
                    {/* Inserido a borda aqui */}
                    Candidato:
                  </Form.Label>
                  <BarraBusca
                    campoBusca="nome"
                    campoChave="cpf"
                    dados={listaCandidatos}
                    funcaoSelecao={setCandidatoSelecionado}
                    placeHolder="Selecione um candidato"
                    valor=""
                    candidatoSelecionado={candidatoSelecionado}
                  />
                </Form.Group>
              </div>
            </Col>
          </Row>

          <Row>
            <Container className="m-3 border">
              <Row className="m-3 custom-vagas-container">
                <h3>
                  <i className="bi bi-briefcase-fill icon-vagas"></i>
                  <span className="icon-border-right"></span>
                  Vagas
                </h3>
                <Col md={2}></Col>
                <Col>
                  <CaixaSelecao
                    setVagaSelecionada={setVagaSelecionada}
                    vagaSelecionada={vagaSelecionada}
                    enderecoFonteDados={"http://localhost:4000/vaga"}
                    campoChave={"codigo"}
                    campoExibicao={"cargo"}
                    funcaoSelecao={setVagaSelecionada}
                    localLista={"listaVagas"}
                  />
                </Col>
              </Row>

              <div className="container-cinza-claro d-flex justify-content-center align-items-center">
                <div
                  className="form-wrapper"
                  style={{ width: "100%", maxWidth: "960px" }}
                >
                  <Container className="m-3 border custom-container">
                    <Row className="justify-content-center">
                      <Col md={10}>
                        <Row>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-hash"></i> Código:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada ? vagaSelecionada.codigo : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-tag"></i> Cargo:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada ? vagaSelecionada.cargo : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-layers-half"></i>{" "}
                                Modalidade:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada
                                    ? vagaSelecionada.modalidade
                                    : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-file-earmark-text"></i> Tipo
                                de Contrato:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada
                                    ? vagaSelecionada.tipoContrato
                                    : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-currency-dollar"></i>{" "}
                                Salário:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada ? vagaSelecionada.salario : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-building"></i> Empresa:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada ? vagaSelecionada.empresa : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-geo-alt"></i> Localização:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada
                                    ? vagaSelecionada.localizacao
                                    : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>
                                <i className="bi bi-clock-history"></i> Carga
                                Horária:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  vagaSelecionada
                                    ? vagaSelecionada.cargaHoraria
                                    : ""
                                }
                                disabled
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} className="text-center">
                            <Button
                              className="add-button btn btn-warning"
                              onClick={() => {
                                const isAlreadyAdded = inscricao.vagas.some(
                                  (v) => v.codigo === vagaSelecionada.codigo
                                );
                                if (vagaSelecionada && !isAlreadyAdded) {
                                  setInscricao((prevInscricao) => ({
                                    ...prevInscricao,
                                    vagas: [
                                      ...prevInscricao.vagas,
                                      {
                                        codigo: vagaSelecionada.codigo,
                                        cargo: vagaSelecionada.cargo,
                                        modalidade: vagaSelecionada.modalidade,
                                        tipoContrato:
                                          vagaSelecionada.tipoContrato,
                                        salario: vagaSelecionada.salario,
                                        empresa: vagaSelecionada.empresa,
                                        localizacao:
                                          vagaSelecionada.localizacao,
                                        cargaHoraria:
                                          vagaSelecionada.cargaHoraria,
                                      },
                                    ],
                                  }));
                                } else {
                                  alert(
                                    "Esta vaga já foi adicionada ou não é válida."
                                  );
                                }
                              }}
                            >
                              <i className="bi bi-plus-circle-dotted"></i>{" "}
                              Adicionar
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>

              <Row className="mt-3">
                <p className="vagas-selecionadas">
                  <i className="bi bi-list-check"></i>{" "}
                  {/* Ícone do Bootstrap */}
                  <strong>Vagas Selecionadas</strong>
                </p>
                <TabelaInscricao
                  listaVagas={inscricao.vagas}
                  setInscricao={setInscricao} // Passa a função para modificar o estado global de inscrição
                  dadosInscricao={inscricao}
                />
              </Row>
            </Container>
          </Row>
          <Container>
            <div className="d-flex justify-content-center">
              <Button className="btn btn-warning" type="submit">
                Confirmar
              </Button>
            </div>
          </Container>
        </Form>
      </div>
    </div>
  );
}
