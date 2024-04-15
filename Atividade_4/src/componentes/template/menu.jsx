import { useState, useContext } from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ContextoUsuario } from "../contexto/Contexto";

export default function Menu() {
  const [show, setShow] = useState(false);
  const [usuario, setUsuario] = useContext(ContextoUsuario);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Estilo para os ícones e texto
  const linkStyle = {
    color: "black", // Cor do texto preta
    textDecoration: "none", // Remove o sublinhado dos links
  };

  // Estilo para adicionar margem entre os links
  const itemStyle = {
    marginBottom: "10px", // Adiciona margem abaixo de cada item
  };

  return (
    <>
      <Button
        onClick={handleShow}
        style={{
          borderRadius: "50%", // Torna o botão redondo
          width: "45px", // Define a largura do botão
          height: "45px", // Define a altura do botão
          backgroundColor: "white", // Cor de fundo branca
          color: "#800020", // Cor do ícone vinho
          display: "flex", // Habilita o display flex
          justifyContent: "center", // Centraliza o conteúdo horizontalmente
          alignItems: "center", // Centraliza o conteúdo verticalmente
          border: "none", // Remover a borda padrão do botão
        }}
      >
        <i className="bi bi-list-ul" style={{ fontSize: "20px" }}></i>
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header
          closeButton
          style={{ backgroundColor: "#800020", color: "white" }}
        >
          <Offcanvas.Title>MENU</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          <Nav className="flex-column">
            <Nav.Item style={itemStyle}>
              <Nav.Link
                as={Link}
                to="/"
                onClick={handleClose}
                style={linkStyle}
              >
                <i className="bi bi-house-door-fill"></i> INÍCIO
              </Nav.Link>
            </Nav.Item>

            <Nav.Item style={itemStyle}>
              <Nav.Link
                as={Link}
                to="/turmas"
                onClick={handleClose}
                style={linkStyle}
              >
                <i className="bi bi-journal-bookmark-fill"></i> TURMAS
              </Nav.Link>
            </Nav.Item>

            <Nav.Item style={itemStyle}>
              <Nav.Link
                as={Link}
                to="/alunos"
                onClick={handleClose}
                style={linkStyle}
              >
                <i className="bi bi-people-fill"></i> ALUNOS
              </Nav.Link>
            </Nav.Item>

            <Nav.Item style={itemStyle}>
              <Nav.Link
                as={Link}
                to="/atividadeExtracurricular"
                onClick={handleClose}
                style={linkStyle}
              >
                <i className="bi bi-calendar-event-fill"></i> ATIVIDADES
              </Nav.Link>
            </Nav.Item>


            <Nav.Item style={itemStyle}>
              <Nav.Link
                onClick={() => {
                  setUsuario({ ...usuario, logado: false });
                  handleClose();
                }}
                style={linkStyle}
              >
                <i className="bi bi-box-arrow-right"></i> LOGOUT
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
