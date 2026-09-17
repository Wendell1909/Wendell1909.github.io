/*
  DELÍCIAS DA BETY — CONFIGURAÇÕES E PRODUTOS

  Este arquivo contém duas constantes:
  - CONFIG_LOJA: informações da loja, entrega, pagamento e limites.
  - PRODUTOS: lista dos seis produtos e suas opções provisórias.

  app.js lê este cadastro para montar o cardápio, calcular e revisar o pedido.
  whatsapp define a conversa que será aberta após a revisão.
  O cliente precisa tocar em Enviar dentro do WhatsApp; o site não envia sozinho.

  DINHEIRO: sempre números inteiros em centavos.
  1400 = R$ 14,00; 500 = R$ 5,00; 0 = sem custo.
  null significa valor ainda desconhecido, como a taxa de outro bairro.

  ESTRUTURA DOS PRODUTOS:
  - apresentacoes: tamanhos, porções ou caixas; o preço já inclui a apresentação.
  - unidadesPorItem: unidades dentro de uma apresentação (ex.: caixa com 4 sonhos).
    Para um pão ou uma bandeja, usamos 1. Isso não informa quantas pessoas serve.
  - grupos: escolhas de sabor, cobertura, adicionais, remoções etc.
  - minimo/maximo: quantidade de opções permitidas naquele grupo.
  - acrescimoCentavos: quanto a opção acrescenta ao preço base.
  - cobranca "por-item": acréscimo uma vez por apresentação comprada.
  - cobranca "por-unidade": acréscimo para cada unidade dentro da apresentação.

  Exemplo: 2 caixas de 4 sonhos, com recheio extra de R$ 1,00 por sonho.
  Produtos: 2 × R$ 25,00. Recheio: 2 × 4 × R$ 1,00. Subtotal: R$ 58,00.
*/

// 1. CONFIGURAÇÕES DA LOJA
const CONFIG_LOJA = {
  nome: "Delícias da Bety",
  descricao: "Pães, doces e salgados no Boqueirão, Curitiba.",
  modoDemonstracao: true,
  whatsapp: "5541997395108", // Para testar, use seu WhatsApp: 55 + DDD + número, entre aspas e só dígitos.
  // Vazio mantém a abertura desativada. Não use um número aleatório para testar.
  idioma: "pt-BR",
  moeda: "BRL",
  pedidoMinimoCentavos: 0, // Comparado ao subtotal dos produtos; zero significa sem mínimo.

  limites: {
    quantidadeMinima: 1,
    quantidadeMaxima: 20, // Apresentações por item do carrinho, não controle de estoque.
    observacaoProdutoMaxima: 300,
    observacaoPedidoMaxima: 500,
  },

  retirada: {
    ativa: true,
    taxaCentavos: 0,
    endereco: "Boqueirão, Curitiba — PR. Endereço exato a confirmar com a Bety.",
  },

  // 2. ENTREGA: taxas fictícias, iguais às apresentadas no HTML.
  entrega: {
    ativa: true,
    bairros: [
      { id: "boqueirao", nome: "Boqueirão", taxaCentavos: 500 },
      { id: "hauer", nome: "Hauer", taxaCentavos: 800 },
      { id: "xaxim", nome: "Xaxim", taxaCentavos: 800 },
      { id: "alto-boqueirao", nome: "Alto Boqueirão", taxaCentavos: 800 },
      { id: "uberaba", nome: "Uberaba", taxaCentavos: 1100 },
      { id: "guabirotuba", nome: "Guabirotuba", taxaCentavos: 1100 },
      { id: "pinheirinho", nome: "Pinheirinho", taxaCentavos: 1100 },
      { id: "portao", nome: "Portão", taxaCentavos: 1400 },
      { id: "reboucas", nome: "Rebouças", taxaCentavos: 1400 },
      { id: "agua-verde", nome: "Água Verde", taxaCentavos: 1400 },
      { id: "outro", nome: "Outro bairro", taxaCentavos: null },
    ],
  },

  // 3. PAGAMENTO: informa a preferência, sem processar cobranças.
  pagamentos: [
    { id: "pix", nome: "Pix", permiteTroco: false },
    { id: "dinheiro", nome: "Dinheiro", permiteTroco: true },
    { id: "debito", nome: "Cartão de débito", permiteTroco: false },
    { id: "credito", nome: "Cartão de crédito", permiteTroco: false },
  ],
};

// 4. CARDÁPIO: um array (lista) de objetos (produtos).
// Os IDs dos produtos correspondem ao data-produto-id do HTML.
// IDs de apresentações, grupos e opções devem ser únicos dentro de suas listas.
const PRODUTOS = [
  // 4.1. PÃO CASEIRO
  {
    id: "pao-caseiro",
    nome: "Pão caseiro",
    descricao: "Pão para o café da manhã ou da tarde. Opções de 500 g e 800 g.",
    disponivel: true,
    rotuloApresentacao: "Tamanho",
    rotuloQuantidade: "Quantidade de pães",
    apresentacoes: [
      { id: "500g", nome: "500 g", precoCentavos: 1000, unidadesPorItem: 1 },
      { id: "800g", nome: "800 g", precoCentavos: 1500, unidadesPorItem: 1 },
    ],
    grupos: [
      {
        id: "sabor",
        nome: "Sabor",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "tradicional", nome: "Tradicional", acrescimoCentavos: 0 },
          { id: "integral", nome: "Integral", acrescimoCentavos: 200 },
          { id: "ervas", nome: "Ervas", acrescimoCentavos: 100 },
        ],
      },
      {
        id: "corte",
        nome: "Como deseja o pão?",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "inteiro", nome: "Inteiro", acrescimoCentavos: 0 },
          { id: "fatiado", nome: "Fatiado", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Adicionais",
        tipo: "checkbox",
        minimo: 0,
        maximo: 2,
        cobranca: "por-item",
        opcoes: [
          { id: "gergelim", nome: "Gergelim", acrescimoCentavos: 100 },
          { id: "queijo", nome: "Cobertura de queijo", acrescimoCentavos: 400 },
        ],
      },
    ],
  },

  // 4.2. CUECA VIRADA
  {
    id: "cueca-virada",
    nome: "Cueca virada",
    descricao: "Porções de 6, 12 ou 20 unidades, com opções de cobertura.",
    disponivel: true,
    rotuloApresentacao: "Porção",
    rotuloQuantidade: "Quantidade de porções",
    apresentacoes: [
      { id: "6-unidades", nome: "6 unidades", precoCentavos: 500, unidadesPorItem: 6 },
      { id: "12-unidades", nome: "12 unidades", precoCentavos: 1000, unidadesPorItem: 12 },
      { id: "20-unidades", nome: "20 unidades", precoCentavos: 1500, unidadesPorItem: 20 },
    ],
    grupos: [
      {
        id: "cobertura",
        nome: "Cobertura",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "acucar", nome: "Açúcar", acrescimoCentavos: 0 },
          { id: "acucar-canela", nome: "Açúcar com canela", acrescimoCentavos: 0 },
          { id: "sem-cobertura", nome: "Sem cobertura", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Acompanhamento",
        tipo: "checkbox",
        minimo: 0,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "doce-leite", nome: "Pote de doce de leite (50 g)", acrescimoCentavos: 500 },
        ],
      },
    ],
  },

  // 4.3. ESFIRRA DE BANDEJA: corresponde ao exemplo visível no formulário atual.
  {
    id: "esfirra-bandeja",
    nome: "Esfirra de bandeja",
    descricao: "Bandejas P, M e G, com diferentes recheios e adicionais.",
    disponivel: true,
    rotuloApresentacao: "Tamanho",
    rotuloQuantidade: "Quantidade de bandejas",
    apresentacoes: [
      { id: "p", nome: "Pequena", precoCentavos: 1000, unidadesPorItem: 1 },
      { id: "m", nome: "Média", precoCentavos: 1200, unidadesPorItem: 1 },
      { id: "g", nome: "Grande", precoCentavos: 1500, unidadesPorItem: 1 },
    ],
    grupos: [
      {
        id: "sabor",
        nome: "Sabor",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "carne", nome: "Carne", acrescimoCentavos: 0 },
          { id: "frango", nome: "Frango", acrescimoCentavos: 0 },
          { id: "presunto-queijo", nome: "Presunto e queijo", acrescimoCentavos: 0 },
          { id: "frango-requeijao", nome: "Frango com requeijão", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Adicionais",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "queijo", nome: "Queijo extra", acrescimoCentavos: 400 },
          { id: "requeijao", nome: "Requeijão", acrescimoCentavos: 500 },
          { id: "bacon", nome: "Bacon", acrescimoCentavos: 600 },
          { id: "azeitona", nome: "Azeitona", acrescimoCentavos: 300 },
        ],
      },
      {
        id: "remover",
        nome: "Retirar ingredientes",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "cebola", nome: "Sem cebola", acrescimoCentavos: 0 },
          { id: "tomate", nome: "Sem tomate", acrescimoCentavos: 0 },
          { id: "oregano", nome: "Sem orégano", acrescimoCentavos: 0 },
        ],
      },
    ],
  },

  // 4.4. DOGUINHO DE BANDEJA
  {
    id: "doguinho-bandeja",
    nome: "Doguinho de bandeja",
    descricao: "Massa recheada com salsicha e molho. Bandejas P, M e G.",
    disponivel: true,
    rotuloApresentacao: "Tamanho",
    rotuloQuantidade: "Quantidade de bandejas",
    apresentacoes: [
      { id: "p", nome: "Pequena", precoCentavos: 1000, unidadesPorItem: 1 },
      { id: "m", nome: "Média", precoCentavos: 1200, unidadesPorItem: 1 },
      { id: "g", nome: "Grande", precoCentavos: 1500, unidadesPorItem: 1 },
    ],
    grupos: [
      {
        id: "molho",
        nome: "Molho",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "suave", nome: "Suave", acrescimoCentavos: 0 },
          { id: "picante", nome: "Picante", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "ingredientes",
        nome: "Incluir ingredientes — sem custo",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "milho", nome: "Milho", acrescimoCentavos: 0 },
          { id: "ervilha", nome: "Ervilha", acrescimoCentavos: 0 },
          { id: "cebola", nome: "Cebola", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Adicionais",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "queijo", nome: "Queijo extra", acrescimoCentavos: 400 },
          { id: "bacon", nome: "Bacon", acrescimoCentavos: 600 },
          { id: "requeijao", nome: "Requeijão", acrescimoCentavos: 500 },
          { id: "salsicha", nome: "Salsicha extra", acrescimoCentavos: 500 },
        ],
      },
    ],
  },

  // 4.5. BAURU DE BANDEJA
  {
    id: "bauru-bandeja",
    nome: "Bauru de bandeja",
    descricao: "Recheios de presunto e queijo, frango ou calabresa. Bandejas P, M e G.",
    disponivel: true,
    rotuloApresentacao: "Tamanho",
    rotuloQuantidade: "Quantidade de bandejas",
    apresentacoes: [
      { id: "p", nome: "Pequena", precoCentavos: 1000, unidadesPorItem: 1 },
      { id: "m", nome: "Média", precoCentavos: 1200, unidadesPorItem: 1 },
      { id: "g", nome: "Grande", precoCentavos: 1500, unidadesPorItem: 1 },
    ],
    grupos: [
      {
        id: "sabor",
        nome: "Sabor",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "tradicional", nome: "Presunto e queijo", acrescimoCentavos: 0 },
          { id: "frango", nome: "Frango", acrescimoCentavos: 0 },
          { id: "calabresa", nome: "Calabresa", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Adicionais",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "queijo", nome: "Queijo extra", acrescimoCentavos: 400 },
          { id: "requeijao", nome: "Requeijão", acrescimoCentavos: 500 },
          { id: "bacon", nome: "Bacon", acrescimoCentavos: 600 },
        ],
      },
      {
        id: "remover",
        nome: "Retirar ingredientes",
        tipo: "checkbox",
        minimo: 0,
        maximo: 3,
        cobranca: "por-item",
        opcoes: [
          { id: "tomate", nome: "Sem tomate", acrescimoCentavos: 0 },
          { id: "cebola", nome: "Sem cebola", acrescimoCentavos: 0 },
          { id: "oregano", nome: "Sem orégano", acrescimoCentavos: 0 },
        ],
      },
    ],
  },

  // 4.6. SONHO DE DOCE DE LEITE
  {
    id: "sonho-doce-leite",
    nome: "Sonho de doce de leite",
    descricao: "Unidade ou caixas com 4, 6 ou 12 sonhos.",
    disponivel: true,
    rotuloApresentacao: "Unidade ou caixa",
    rotuloQuantidade: "Quantidade da apresentação escolhida",
    apresentacoes: [
      { id: "1-unidade", nome: "1 unidade", precoCentavos: 1000, unidadesPorItem: 1 },
      { id: "4-unidades", nome: "Caixa com 4 unidades", precoCentavos: 1200, unidadesPorItem: 4 },
      { id: "6-unidades", nome: "Caixa com 6 unidades", precoCentavos: 1500, unidadesPorItem: 6 },
      { id: "12-unidades", nome: "Caixa com 12 unidades", precoCentavos: 1800, unidadesPorItem: 12 },
    ],
    grupos: [
      {
        id: "cobertura",
        nome: "Cobertura",
        tipo: "radio",
        minimo: 1,
        maximo: 1,
        cobranca: "por-item",
        opcoes: [
          { id: "acucar", nome: "Açúcar", acrescimoCentavos: 0 },
          { id: "acucar-canela", nome: "Açúcar com canela", acrescimoCentavos: 0 },
          { id: "sem-cobertura", nome: "Sem cobertura", acrescimoCentavos: 0 },
        ],
      },
      {
        id: "adicionais",
        nome: "Recheio extra — valor por sonho",
        tipo: "checkbox",
        minimo: 0,
        maximo: 1,
        cobranca: "por-unidade",
        opcoes: [
          { id: "recheio-extra", nome: "Doce de leite extra", acrescimoCentavos: 100 },
        ],
      },
    ],
  },
];

// 5. PARA ESTUDAR NO CONSOLE (F12, aba Console), digite uma expressão por vez:
// CONFIG_LOJA.nome
// CONFIG_LOJA.entrega.bairros[0].taxaCentavos
// PRODUTOS.length
// PRODUTOS[0].nome
// PRODUTOS[0].apresentacoes[0].precoCentavos / 100
// console.table(PRODUTOS[2].apresentacoes)
