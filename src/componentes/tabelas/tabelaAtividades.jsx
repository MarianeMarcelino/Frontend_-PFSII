import { Table } from "react-bootstrap";
import "../formularios/EstiloFormulario.css";

export default function TabelaAtividades(props) {
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
                        <th style={estiloTitulo}>Código</th>
                        <th style={estiloTitulo}>Dia da Semana</th>
                        <th style={estiloTitulo}>Horário</th>
                        <th style={estiloTitulo}>Tipo de Atividade</th>
                        <th style={estiloTitulo}>Nome dos Membros</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listaAtividades?.map((atividade) => (
                        <tr key={atividade.codigo}>
                            <td>{atividade.codigo}</td>
                            <td>{atividade.dia_semana}</td>
                            <td>{atividade.horario}</td>
                            <td>{atividade.tipoAtividade?.nome ?? 'N/A'}</td>
                            <td>
                                {atividade.membros?.map((membro, index) => (
                                    <div key={index}>{membro.nome}</div>
                                )) || 'Nenhum membro'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
