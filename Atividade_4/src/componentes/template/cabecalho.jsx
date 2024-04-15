import { Alert } from "react-bootstrap";

export default function Cabecalho(props) {
  // Define o estilo CSS diretamente
  const customStyle = {
    backgroundColor: '#800020', // Cor vinho
    color: 'white', // Cor da letra branca
    fontWeight: 'bold', // Texto em negrito
    display: 'flex', // Habilita o display flex para alinhar os itens
    alignItems: 'center', // Alinha verticalmente os itens no centro
    justifyContent: 'center', // Alinha horizontalmente os itens no centro
    padding: '20px 0', // Adiciona um padding vertical para mais espaço
  };

  const iconStyle = {
    fontSize: '2.5rem', // Aumenta o tamanho do ícone
    marginRight: '10px', // Espaçamento entre o ícone e o texto
  };

  // Adicionando fontSize para ajustar o tamanho da letra do título
  const titleStyle = {
    fontSize: '2.0rem', // Diminui o tamanho da fonte do título
    margin: 0, // Remove margens padrão do <h1>
    display: 'inline', // Exibe o título na mesma linha que o ícone
  };

  return (
    <div>
      {/* Aplicando o estilo inline ao Alert */}
      <Alert style={customStyle}>
        {/* Ícone com estilo inline */}
        <i className="bi bi-mortarboard" style={iconStyle}></i>
        {/* Título com estilo inline para ajustes finos de alinhamento e tamanho */}
        <h1 style={titleStyle}>{props?.texto}</h1>
      </Alert>
    </div>
  );
}
