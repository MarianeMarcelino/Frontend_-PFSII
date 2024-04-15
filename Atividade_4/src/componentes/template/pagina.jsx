// Em Pagina.js
import Cabecalho from "./cabecalho";
import Menu from "./menu";

export default function Pagina(props) {

    return (
        <div>
            {/* Contêiner para cabeçalho e menu com posicionamento relativo */}
            <div style={{ position: 'relative' }}>
                <Cabecalho texto="Sistema de Gerenciamento Escolar" />
                {/* Componente Menu com estilo inline para posicionamento */}
                <div style={{ position: 'absolute', top: '25px', left: '20px', zIndex: 1000 }}>
                    <Menu />
                </div>
            </div>
            <div className="container">
                {props.children}
            </div>
        </div>
    );
}
