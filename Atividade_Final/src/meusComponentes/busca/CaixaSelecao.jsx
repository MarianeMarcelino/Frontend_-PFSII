import { useEffect, useState } from "react";
import { Form, Container, Row, Col, Spinner } from "react-bootstrap";

export default function CaixaSelecaoVaga({ setVagaSelecionada, vagaSelecionada }) {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:4000/vaga')
            .then(res => res.json())
            .then(result => {
                if (result.status) {
                    setVagas(result.listaVagas);
                } else {
                    console.error("Falha ao carregar vagas");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar vagas:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!vagaSelecionada) {
            setSelectedValue(""); // Limpa a seleção quando o formulário é resetado
        }
    }, [vagaSelecionada]);

    const handleChange = (e) => {
        const selectedVaga = vagas.find(v => v.codigo === parseInt(e.target.value));
        setVagaSelecionada(selectedVaga);
        setSelectedValue(e.target.value);
    };

    return (
        <Container>
            {loading ? <Spinner animation="border" /> :
                <Form.Group as={Row}>
                    <Col sm="9">
                        <Form.Select value={selectedValue} onChange={handleChange}>
                            <option value="">Selecione uma vaga</option>
                            {vagas.map(vaga => (
                                <option key={vaga.codigo} value={vaga.codigo}>
                                    {vaga.cargo} - {vaga.empresa}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
            }
        </Container>
    );
}
