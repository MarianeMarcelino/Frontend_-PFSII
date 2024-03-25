import { Container, Form,Button} from "react-bootstrap";
import { ContextoUsuario } from "../contexto/Contexto";
import { useContext, useState } from "react";

export default function TelaLogin() {
    const [usuario, setUsuario] = useContext(ContextoUsuario);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senha, setSenha] = useState("");

    function realizarLogin(){
        if (nomeUsuario === 'admin' && senha==='admin'){
            setUsuario({
                nome: nomeUsuario,
                logado: true
            });
        }
    }

    // Impedir que a tela role
    document.body.style.overflow = 'hidden';

    return (
        <div style={{ 
            background: "linear-gradient(to bottom, #990000, #330000)", // Gradiente de vermelho escuro
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Container style={{ 
                width: "400px", // Largura fixa
                height: "400px", // Altura igual à largura para criar um quadrado
                background: "rgba(255, 255, 255, 0.2)", // Alterado para 0.5 para tornar mais transparente
                padding: "20px",
                borderRadius: "220px", // Aumentando o raio da borda para deixar mais arredondado
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
                            <i className="bi bi-person-fill" style={{ fontSize: "1.5rem", marginRight: "5px", color: "white" }}></i> Usuário
                        </Form.Label>
                        <Form.Control 
                            type="text"  
                            id="usuario" 
                            name="usuario"
                            value={nomeUsuario}
                            onChange={(e) => setNomeUsuario(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
                            <i className="bi bi-lock-fill" style={{ fontSize: "1.5rem", marginRight: "5px", color: "white" }}></i> Senha
                        </Form.Label>
                        <Form.Control 
                            type="password" 
                            id="senha" 
                            name="senha"  
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={realizarLogin} style={{ backgroundColor: "#990000", border: "none" }}>
                        Login
                    </Button>
                </Form>
            </Container>
        </div>
    );

}
