import { Button, Container, Table } from "react-bootstrap";
import "./tabela.css";

export default function TabelaInscricao({ listaVagas, setInscricao }) {
  return (
    <Container className="m-3 border">
      <Table striped bordered hover>
        <thead className="table-header">
          <tr>
            <th><i className="bi bi-hash"></i> Código</th>
            <th><i className="bi bi-tag"></i> Cargo</th>
            <th><i className="bi bi-layers-half"></i> Modalidade</th>
            <th><i className="bi bi-file-earmark-text"></i> Tipo de Contrato</th>
            <th><i className="bi bi-currency-dollar"></i> Salário</th>
            <th><i className="bi bi-building"></i> Empresa</th>
            <th><i className="bi bi-tools"></i> Ações</th>
          </tr>
        </thead>
        <tbody>
          {listaVagas.map((vaga, index) => (
            <tr key={index}>
              <td>{vaga.codigo}</td>
              <td>{vaga.cargo}</td>
              <td>{vaga.modalidade}</td>
              <td>{vaga.tipoContrato}</td>
              <td>{vaga.salario}</td>
              <td>{vaga.empresa}</td>
              <td>
                <Button onClick={() => {
                  setInscricao(prev => ({
                    ...prev,
                    vagas: prev.vagas.filter(v => v.codigo !== vaga.codigo)
                  }));
                }}>Remover</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
