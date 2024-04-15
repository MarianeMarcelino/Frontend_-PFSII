import { useState, useEffect, useRef } from 'react';
import { Container, Form } from 'react-bootstrap';
import './barraBusca.css';

export default function BarraBusca({
    placeHolder,
    campoChave = "cpf",  // ID único, como CPF
    campoBusca = "nome", // Campo contendo o nome
    funcaoSelecao,
    valor = "",
    candidatoSelecionado // Adicione esta prop para reagir às mudanças no estado do candidato
}) {
    const inputBusca = useRef(null);
    const [termoBusca, setTermoBusca] = useState(valor);
    const [dados, setDados] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    // Carregar dados ao montar o componente
    useEffect(() => {
        fetch('http://localhost:4000/candidato')
            .then(response => response.json())
            .then(data => setDados(data))
            .catch(error => console.error('Erro ao buscar candidatos:', error));
    }, []);

    // Resetar o termo de busca quando o candidato selecionado é resetado
    useEffect(() => {
        if (Object.keys(candidatoSelecionado).length === 0) {
            setTermoBusca('');
        }
    }, [candidatoSelecionado]);

    // Filtrar resultados baseado no termo de busca
    const dadosFiltrados = dados.filter(item =>
        item[campoBusca].toLowerCase().includes(termoBusca.toLowerCase())
    );

    // Função para lidar com a seleção de um item da lista
    function handleSelect(item) {
        setTermoBusca(item[campoBusca]); // Atualiza o input para mostrar o nome selecionado
        funcaoSelecao(item); // Passa o objeto inteiro para a função de seleção
        setMostrarResultados(false); // Esconde os resultados após a seleção
    }

    return (
        <Container>
            <div className='barra'>
                <Form.Control
                    type="text"
                    ref={inputBusca}
                    placeholder={placeHolder}
                    value={termoBusca}
                    onChange={e => {
                        setTermoBusca(e.target.value);
                        setMostrarResultados(true);
                    }}
                    onFocus={() => setMostrarResultados(true)}
                    onBlur={() => {
                        // Esconde a lista quando o input perde o foco
                        setTimeout(() => setMostrarResultados(false), 200);
                    }}
                />
            </div>
            {mostrarResultados && dadosFiltrados.length > 0 && (
                <ul className="resultado-lista">
                    {dadosFiltrados.map(item => (
                        <li key={item[campoChave]} onClick={() => handleSelect(item)}>
                            {item[campoBusca]}
                        </li>
                    ))}
                </ul>
            )}
        </Container>
    );
}
