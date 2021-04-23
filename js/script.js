//-- Miniprojeto Calculadora --
//-- Equipe: Vinícius Ribeiro, Moacir, Israel Oliveira, Alexsander Lins, Rafael Alexandre e Bruno Lacerda --

//-- Variáveis --
let primeiroValor, segundoValor, operacao, estado, display, contadorOperacao;

//-- Objeto para ajudar a definir a variável 'estado' --
const ESTADOS = { PRIMEIRO_VALOR: "PRIMEIRO_VALOR", OPERACAO: "OPERACAO", SEGUNDO_VALOR: "SEGUNDO_VALOR" };
//-- Função que inicializa os valores das variáveis --
function inicializarEstado() {
    primeiroValor = "0";
    segundoValor = null;
    operacao = null;
    estado = ESTADOS.PRIMEIRO_VALOR;
    contadorOperacao = 0;
}
//-- Função que inicializar a tela display da calculadora --
function inicializarPagina() {
    display = document.getElementById("tela");
    inicializarEstado();
    atualizarDisplay();
}
window.addEventListener("load", inicializarPagina);  //-- É acionado quando todos os recursos terminaram o carregamento --

//-- Mapear os botões numéricos --
for (let i = 0; i < 10; i++) {
    const elementId = `num${i}`;
    const numericBtn = document.getElementById(elementId);
    numericBtn.addEventListener("click", btnClick);
}
//-- Mapear os botão de ação --
const idBotoesDisponiveis = ["resultado", "limparTela", "apagarAnterior", "ponto", "divisao", "multiplicacao", "subtracao", "soma"];
idBotoesDisponiveis.forEach(idBotao => {
    const botao = document.getElementById(idBotao);
    botao.addEventListener("click", btnClick);
})
//-- Função que atualiza o display, convertendo o valor para número e depois para string para exibir na tela --
function atualizarDisplay() {
    const prepararValorParaExibir = valor => parseFloat(valor).toString();

    const valorOperador1 = primeiroValor ? prepararValorParaExibir(primeiroValor) : '';
    const valorOperacao = operacao ? operacao : '';
    const valorOperador2 = segundoValor ? prepararValorParaExibir(segundoValor) : '';
    //-- Usando 'Template Literals' informar como será exibida a cadeia de caracteres --
    const valorParaExibir = `${valorOperador1}${valorOperacao}${valorOperador2}`;
    display.value = valorParaExibir;
}

//-- Função para detectar os clicks nos botões --
function btnClick(event) {
    const digito = event.target.value;   //-- Variável 'digito' recebe o valor do botão que foi clicado --

     //--Se clicar em 'C' vai chamar a função 'inicializarEstado', resetando os valores --
    if (digito == 'C') {
        inicializarEstado();
    }
    //-- Se clicar em ponto ou número os valores são inseridos no 'primeiroValor' ou 'segundoValor' conforme o 'estado' --
    if ((digito == '.') || (digito >= '0') && (digito <= '9')) {
        if (estado == ESTADOS.PRIMEIRO_VALOR) {
            primeiroValor += digito;
        } else if (estado == ESTADOS.OPERACAO || estado == ESTADOS.SEGUNDO_VALOR) {
            estado = ESTADOS.SEGUNDO_VALOR;
            segundoValor = segundoValor !== null ? segundoValor + digito : digito;
        }
    }
    //-- Se o valor do botão apertado estiver no array de 'operacoesMatematicas' então a variável 'operacao' o receberá --
    const operacoesMatematicas = ['+', '-', '*', '/'];
    if (operacoesMatematicas.includes(digito) && contadorOperacao == 0) {
        operacao = digito;
        estado = ESTADOS.OPERACAO;
        contadorOperacao++;
    }

    //-- Se clicar em '=' a operação será efetuada entre o 'primeiroValor' e 'segundoValor' --
    if (digito == "=" && segundoValor != null) {
            let resultado;
         //-- A variável 'resultado' receberá o valor retornado pela função de acordo com o caso --
            switch (operacao) {           
                case '+':
                    resultado = somar();
                    break;
                case '-':
                    resultado = subtrair();
                    break;
                case '*':
                    resultado = multiplicar();
                    break;
                case '/':
                    resultado = dividir();
                    break;
            }
        
            //-- Se a operação tiver resultado ele será armazenado em 'primeiroValor', caso contrário os valores são resetados --
            if (resultado) {
                estado = ESTADOS.PRIMEIRO_VALOR;
                primeiroValor = resultado;
                segundoValor = null;
                operacao = null;
                contadorOperacao = 0;
            } else {
                inicializarEstado();
            }
    }
    //-- Se o botão apertado for '<-' os campos serão apagados de acordo com o 'estado'
    if (digito == "<-") {
        if (estado == ESTADOS.PRIMEIRO_VALOR) {
            primeiroValor = primeiroValor.slice(0, -1);
        } else if (estado == ESTADOS.OPERACAO) {
            operacao = "";
            estado = ESTADOS.PRIMEIRO_VALOR;
            contadorOperacao = 0;
        }
        else if (estado == ESTADOS.SEGUNDO_VALOR) {
            segundoValor = segundoValor.slice(0, -1);
            if (segundoValor.length === 0) {
                estado = ESTADOS.OPERACAO;
            }
        }
    }
    //-- Após sair de todos of 'ifs' é chamada a função para atualizar o display
    atualizarDisplay();
    //-- Para realizar a operação matemática os operadores são antes convertidos para número de ponto flutuante
    function somar() {
        return parseFloat(primeiroValor) + parseFloat(segundoValor)
    }
    function subtrair() {
        return parseFloat(primeiroValor) - parseFloat(segundoValor)
    }
    function multiplicar() {
        return parseFloat(primeiroValor) * parseFloat(segundoValor)
    }
    function dividir() {
        //-- Caso o 'segundoValor' for Zero então é emitido um alerta
        if (segundoValor == 0) {
            alert("Divisão impossível!");
            return;
        }
        return parseFloat(primeiroValor) / parseFloat(segundoValor)
    }
}
