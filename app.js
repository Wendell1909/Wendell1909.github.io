/*
  DELÍCIAS DA BETY — VERSÃO COMPLETA DO CARDÁPIO

  Leia este arquivo depois de config.js. A ordem dos scripts no HTML importa.
  Cardápio, personalização, carrinho salvo, recebimento, pagamento e WhatsApp.
  Não há agendamento. A pessoa confirma o envio dentro do WhatsApp.
  O carrinho é salvo neste navegador quando o armazenamento está disponível.
  Os comentários numerados ajudam a localizar cada parte do código.
*/

// 1. DOM: referências aos elementos que vamos ler ou alterar no HTML.
const elementos = {
  nomeLoja: document.querySelector(".nome-loja"),
  descricaoLoja: document.querySelector("#descricao-loja"),
  listaProdutos: document.querySelector("#lista-produtos"),
  formularioProduto: document.querySelector("#formulario-produto"),
  tituloProduto: document.querySelector("#produto-selecionado"),
  avisoProduto: document.querySelector("#aviso-personalizacao"),
  produtoId: document.querySelector("#produto-id"),
  legendaApresentacao: document.querySelector("#legenda-apresentacao"),
  rotuloApresentacao: document.querySelector("#rotulo-apresentacao"),
  apresentacao: document.querySelector("#produto-tamanho"),
  grupos: document.querySelector("#produto-grupos"),
  rotuloQuantidade: document.querySelector("#rotulo-quantidade"),
  quantidade: document.querySelector("#produto-quantidade"),
  observacao: document.querySelector("#produto-observacao"),
  total: document.querySelector("#produto-total"),
  detalheTotal: document.querySelector("#produto-detalhe-total"),
  adicionarCarrinho: document.querySelector("#adicionar-carrinho"),
  tituloCarrinho: document.querySelector("#titulo-carrinho"),
  itensCarrinho: document.querySelector("#itens-carrinho"),
  carrinhoVazio: document.querySelector("#carrinho-vazio"),
  quantidadeCarrinho: document.querySelector("#carrinho-quantidade"),
  subtotalCarrinho: document.querySelector("#carrinho-subtotal"),
  entregaCarrinho: document.querySelector("#carrinho-entrega"),
  totalCarrinho: document.querySelector("#carrinho-total"),
  limparCarrinho: document.querySelector("#limpar-carrinho"),
  mensagemCarrinho: document.querySelector("#mensagem-carrinho"),
  formularioPedido: document.querySelector("#formulario-pedido"),
  tipoRetirada: document.querySelector("#tipo-retirada"),
  tipoEntrega: document.querySelector("#tipo-entrega"),
  rotuloRetirada: document.querySelector("#rotulo-retirada"),
  rotuloEntrega: document.querySelector("#rotulo-entrega"),
  informacaoRetirada: document.querySelector("#informacao-retirada"),
  avisoRecebimento: document.querySelector("#aviso-recebimento"),
  camposEntrega: document.querySelector("#campos-entrega"),
  bairroEntrega: document.querySelector("#entrega-bairro"),
  campoOutroBairro: document.querySelector("#campo-outro-bairro"),
  outroBairro: document.querySelector("#entrega-outro-bairro"),
  ruaEntrega: document.querySelector("#entrega-rua"),
  numeroEntrega: document.querySelector("#entrega-numero"),
  rotuloTaxaCarrinho: document.querySelector("#rotulo-taxa-carrinho"),
  clienteNome: document.querySelector("#cliente-nome"),
  clienteTelefone: document.querySelector("#cliente-telefone"),
  complementoEntrega: document.querySelector("#entrega-complemento"),
  referenciaEntrega: document.querySelector("#entrega-referencia"),
  pagamento: document.querySelector("#pedido-pagamento"),
  campoTroco: document.querySelector("#campo-troco"),
  troco: document.querySelector("#pedido-troco"),
  observacaoPedido: document.querySelector("#pedido-observacao"),
  avisoValidacao: document.querySelector("#aviso-validacao"),
  revisarPedido: document.querySelector("#revisar-pedido"),
  tituloFinalizacao: document.querySelector("#titulo-finalizacao"),
  revisao: document.querySelector("#revisao"),
  tituloRevisao: document.querySelector("#titulo-revisao"),
  resumoPedido: document.querySelector("#resumo-pedido"),
  mensagemWhatsapp: document.querySelector("#mensagem-whatsapp"),
  editarPedido: document.querySelector("#editar-pedido"),
  enviarWhatsapp: document.querySelector("#enviar-whatsapp"),
  copiarPedido: document.querySelector("#copiar-pedido"),
  avisoWhatsapp: document.querySelector("#aviso-whatsapp"),
  contatoWhatsapp: document.querySelector("#contato-whatsapp"),
  avisoArmazenamento: document.querySelector("#aviso-armazenamento"),
  avisoDemonstracao: document.querySelector("#aviso-etapa"),
  nomeLojaRodape: document.querySelector("#nome-loja-rodape"),
  enderecoRodape: document.querySelector("#endereco-loja-rodape"),
};

// 2. ESTADO: qual produto está aberto agora? null = nenhum, no início.
// Usamos let porque essa referência muda quando escolhemos outro produto.
let produtoAtual = null;

// Cada inclusão cria uma linha independente, mesmo se o produto se repetir.
let carrinho = [];
let proximoIdItem = 1;
const CHAVE_CARRINHO = "delicias-da-bety:carrinho";

// 3. FUNÇÕES DE APOIO: dinheiro e criação de elementos.
const formatadorMoeda = new Intl.NumberFormat(CONFIG_LOJA.idioma, {
  style: "currency",
  currency: CONFIG_LOJA.moeda,
});

function formatarDinheiro(centavos) {
  // Os cálculos continuam em centavos; dividimos só para exibir em reais.
  return formatadorMoeda.format(centavos / 100);
}

function criarElemento(tag, texto = "", classe = "") {
  const elemento = document.createElement(tag);
  // textContent insere texto; não interpreta nomes e descrições como HTML.
  elemento.textContent = texto;
  elemento.className = classe;
  return elemento;
}

// 4. CARDÁPIO: os dados viram cards com título, descrição, preço e botão.
function renderizarCardapio() {
  elementos.listaProdutos.replaceChildren();

  if (PRODUTOS.length === 0) {
    elementos.listaProdutos.append(criarElemento("p", "Nenhum produto cadastrado."));
    return;
  }

  PRODUTOS.forEach((produto) => {
    const card = criarElemento("article", "", "produto");
    card.dataset.produtoId = produto.id;

    const nome = criarElemento("h3", produto.nome, "produto-nome");
    const descricao = criarElemento("p", produto.descricao, "produto-descricao");
    const preco = criarElemento("p", "", "produto-preco");
    const podePersonalizar = produto.disponivel && produto.apresentacoes.length > 0;

    if (produto.apresentacoes.length > 0) {
      // map cria uma lista só de preços; ... passa os valores para Math.min.
      const precos = produto.apresentacoes.map((opcao) => opcao.precoCentavos);
      const menorPreco = Math.min(...precos);
      preco.textContent = "Preço base a partir de ";
      preco.append(criarElemento("strong", formatarDinheiro(menorPreco)));
    } else {
      preco.textContent = "Preço a definir";
    }

    const textoBotao = podePersonalizar ? `Personalizar ${produto.nome}` : "Indisponível";
    const botao = criarElemento("button", textoBotao, "botao botao-personalizar");
    botao.type = "button";
    botao.dataset.produtoId = produto.id;
    botao.disabled = !podePersonalizar;
    botao.setAttribute("aria-controls", "formulario-produto");

    // A função abaixo só roda quando a pessoa clica neste botão.
    botao.addEventListener("click", () => abrirProduto(produto.id));

    card.append(nome, descricao, preco, botao);
    elementos.listaProdutos.append(card);
  });
}

// 5. SELEÇÃO: reutilizamos o mesmo formulário para todos os produtos.
function abrirProduto(produtoId) {
  const produto = PRODUTOS.find((item) => item.id === produtoId);

  if (!produto || !produto.disponivel || produto.apresentacoes.length === 0) {
    return;
  }

  produtoAtual = produto;
  elementos.formularioProduto.reset();
  elementos.produtoId.value = produto.id;
  elementos.tituloProduto.textContent = produto.nome;
  elementos.avisoProduto.textContent = `${produto.descricao} As opções escolhidas valem para toda a quantidade abaixo.`;
  elementos.legendaApresentacao.textContent = `${produto.rotuloApresentacao} — obrigatório`;
  elementos.rotuloApresentacao.textContent = `Escolha: ${produto.rotuloApresentacao.toLowerCase()}`;
  elementos.rotuloQuantidade.textContent = `${produto.rotuloQuantidade} — obrigatório`;
  elementos.quantidade.min = CONFIG_LOJA.limites.quantidadeMinima;
  elementos.quantidade.max = CONFIG_LOJA.limites.quantidadeMaxima;
  elementos.quantidade.value = CONFIG_LOJA.limites.quantidadeMinima;
  elementos.observacao.maxLength = CONFIG_LOJA.limites.observacaoProdutoMaxima;

  preencherApresentacoes(produto);
  preencherGrupos(produto);
  atualizarPreco();

  elementos.formularioProduto.hidden = false;
  elementos.tituloProduto.hidden = false;
  // tabindex="-1" no HTML permite levar o foco para o título ao abrir.
  elementos.tituloProduto.focus({ preventScroll: true });
  elementos.tituloProduto.scrollIntoView({ block: "start" });
}

// 6. APRESENTAÇÕES: tamanhos, porções ou caixas disponíveis para o produto.
function preencherApresentacoes(produto) {
  elementos.apresentacao.replaceChildren();
  const placeholder = criarElemento("option", "Selecione uma opção");
  placeholder.value = "";
  elementos.apresentacao.append(placeholder);

  produto.apresentacoes.forEach((apresentacao) => {
    const texto = `${apresentacao.nome} — ${formatarDinheiro(apresentacao.precoCentavos)}`;
    const opcao = criarElemento("option", texto);
    opcao.value = apresentacao.id;
    elementos.apresentacao.append(opcao);
  });
}

// 7. GRUPOS: geramos os radios e checkboxes a partir do cadastro.
function preencherGrupos(produto) {
  elementos.grupos.replaceChildren();

  produto.grupos.forEach((grupo) => {
    const campo = criarElemento("fieldset");
    campo.id = `grupo-${produto.id}-${grupo.id}`;
    campo.dataset.grupoId = grupo.id;
    const legenda = criarElemento("legend", grupo.nome);
    const ajuda = criarElemento("p");
    ajuda.id = `${campo.id}-ajuda`;
    campo.setAttribute("aria-describedby", ajuda.id);

    const palavraOpcoes = grupo.maximo === 1 ? "opção" : "opções";
    if (grupo.minimo === grupo.maximo) {
      ajuda.textContent = `Escolha ${grupo.minimo} ${palavraOpcoes}.`;
    } else if (grupo.minimo === 0) {
      ajuda.textContent = `Escolha até ${grupo.maximo} ${palavraOpcoes} (opcional).`;
    } else {
      ajuda.textContent = `Escolha de ${grupo.minimo} a ${grupo.maximo} opções.`;
    }

    if (grupo.tipo === "checkbox") {
      ajuda.textContent += " Ao atingir o limite, desmarque uma opção para escolher outra.";
    }

    const temAcrescimo = grupo.opcoes.some((opcao) => opcao.acrescimoCentavos > 0);
    if (temAcrescimo) {
      if (grupo.cobranca === "por-unidade") {
        ajuda.textContent += " O adicional é cobrado em cada unidade da caixa ou porção.";
      } else {
        ajuda.textContent += " O adicional é cobrado por pão, porção, bandeja ou caixa escolhida.";
      }
    }

    campo.append(legenda, ajuda);

    grupo.opcoes.forEach((opcao) => {
      const linha = criarElemento("div");
      const input = document.createElement("input");
      input.type = grupo.tipo;
      input.id = `${campo.id}-${opcao.id}`;
      input.name = `grupo-${grupo.id}`;
      input.value = opcao.id;
      input.required = grupo.tipo === "radio" && grupo.minimo > 0;

      const label = criarElemento("label", opcao.nome);
      label.htmlFor = input.id;
      if (opcao.acrescimoCentavos > 0) {
        label.textContent += ` — + ${formatarDinheiro(opcao.acrescimoCentavos)}`;
      }

      linha.append(input, label);
      campo.append(linha);
    });

    elementos.grupos.append(campo);
    aplicarLimite(campo, grupo);
  });
}

// 8. LIMITES: desabilitamos somente as opções ainda não marcadas.
// Assim, sempre é possível desmarcar uma opção e liberar outra.
function aplicarLimite(campo, grupo) {
  if (grupo.tipo !== "checkbox") {
    return;
  }

  const marcados = campo.querySelectorAll("input:checked").length;
  const inputs = campo.querySelectorAll("input");

  inputs.forEach((input) => {
    input.disabled = !input.checked && marcados >= grupo.maximo;
  });
}

// 9. PREÇO: lemos a seleção atual e calculamos tudo em centavos.
function mostrarPendencia(texto) {
  // Limpa um preço antigo quando a seleção fica incompleta ou inválida.
  elementos.total.textContent = "A calcular";
  elementos.detalheTotal.textContent = texto;
  elementos.adicionarCarrinho.disabled = true;
}

// Esta função recebe dados e devolve um resultado: não altera o HTML.
function calcularSelecao(produto, apresentacaoId, quantidade, escolhas) {
  if (!escolhas || typeof escolhas !== "object" || Array.isArray(escolhas)) {
    return { erro: "As escolhas do produto precisam ser refeitas." };
  }
  const temGrupoDesconhecido = Object.keys(escolhas).some((id) => {
    return !produto.grupos.some((grupo) => grupo.id === id);
  });
  if (temGrupoDesconhecido) {
    return { erro: "Uma das opções antigas não existe mais. Personalize o produto novamente." };
  }
  const apresentacao = produto.apresentacoes.find(
    (item) => item.id === apresentacaoId
  );

  if (!apresentacao) {
    return { erro: `Escolha uma opção de ${produto.rotuloApresentacao.toLowerCase()}.` };
  }

  const minimo = CONFIG_LOJA.limites.quantidadeMinima;
  const maximo = CONFIG_LOJA.limites.quantidadeMaxima;
  if (!Number.isInteger(quantidade) || quantidade < minimo || quantidade > maximo) {
    return { erro: `Use uma quantidade inteira entre ${minimo} e ${maximo}.` };
  }

  let acrescimosCentavos = 0;

  // for...of permite encerrar esta função com return se faltar uma escolha.
  for (const grupo of produto.grupos) {
    const idsEscolhidos = escolhas[grupo.id] === undefined ? [] : escolhas[grupo.id];
    if (!Array.isArray(idsEscolhidos) ||
        idsEscolhidos.some((id) => typeof id !== "string") ||
        new Set(idsEscolhidos).size !== idsEscolhidos.length) {
      return { erro: `Confira as opções do grupo "${grupo.nome}".` };
    }

    if (idsEscolhidos.length < grupo.minimo || idsEscolhidos.length > grupo.maximo) {
      return { erro: `Confira as escolhas do grupo "${grupo.nome}" e o limite indicado.` };
    }

    const multiplicador = grupo.cobranca === "por-unidade" ? apresentacao.unidadesPorItem : 1;

    for (const opcaoId of idsEscolhidos) {
      const opcao = grupo.opcoes.find((item) => item.id === opcaoId);
      if (!opcao) {
        return { erro: `Escolha uma opção válida de "${grupo.nome}".` };
      }
      acrescimosCentavos += opcao.acrescimoCentavos * multiplicador;
    }
  }

  const precoPorItemCentavos = apresentacao.precoCentavos + acrescimosCentavos;
  return {
    baseCentavos: apresentacao.precoCentavos,
    acrescimosCentavos: acrescimosCentavos,
    precoPorItemCentavos: precoPorItemCentavos,
    totalCentavos: precoPorItemCentavos * quantidade,
  };
}

// Reutilizamos esta leitura para calcular a prévia e para adicionar o item.
function lerEscolhas() {
  const escolhas = {};
  for (const grupo of produtoAtual.grupos) {
    const campo = document.getElementById(`grupo-${produtoAtual.id}-${grupo.id}`);
    const marcados = campo.querySelectorAll("input:checked");
    // Array.from transforma os campos marcados em uma lista com seus IDs.
    escolhas[grupo.id] = Array.from(marcados, (input) => input.value);
  }
  return escolhas;
}

// Esta função lê o formulário, chama o cálculo e mostra o resultado na página.
function atualizarPreco() {
  if (!produtoAtual) {
    return;
  }

  const escolhas = lerEscolhas();

  // value vem do campo como texto. Number converte para número.
  const quantidade = Number(elementos.quantidade.value);
  const resultado = calcularSelecao(produtoAtual, elementos.apresentacao.value, quantidade, escolhas);

  if (resultado.erro) {
    mostrarPendencia(resultado.erro);
    return;
  }

  elementos.total.textContent = formatarDinheiro(resultado.totalCentavos);
  elementos.detalheTotal.textContent = `${quantidade} × ${formatarDinheiro(resultado.precoPorItemCentavos)}. Cada item: ${formatarDinheiro(resultado.baseCentavos)} de base + ${formatarDinheiro(resultado.acrescimosCentavos)} em opções. Valor sem entrega.`;
  elementos.adicionarCarrinho.disabled = false;
}

// 10. CARRINHO: criamos uma cópia da seleção e guardamos os valores em centavos.
function criarItemCarrinho(id, produto, apresentacaoId, quantidade, escolhas, observacao) {
  if (!produto || !produto.disponivel) {
    return { erro: "Este produto está indisponível." };
  }
  if (typeof observacao !== "string") {
    return { erro: "A observação precisa ser um texto." };
  }

  // Recalculamos com os dados, sem tentar ler o preço formatado da tela.
  const resultado = calcularSelecao(produto, apresentacaoId, quantidade, escolhas);
  if (resultado.erro) {
    return resultado;
  }

  const observacaoLimpa = observacao.trim();
  if (observacaoLimpa.length > CONFIG_LOJA.limites.observacaoProdutoMaxima) {
    return { erro: "A observação ultrapassou o limite de caracteres." };
  }

  const apresentacao = produto.apresentacoes.find((item) => item.id === apresentacaoId);
  const escolhasCopiadas = {};
  const detalhes = [];

  for (const grupo of produto.grupos) {
    const ids = escolhas[grupo.id] || [];
    // slice cria outra lista: mudanças posteriores no formulário não afetam o item.
    escolhasCopiadas[grupo.id] = ids.slice();
    const nomes = ids.map((opcaoId) => {
      const opcao = grupo.opcoes.find((item) => item.id === opcaoId);
      return opcao.nome;
    });

    if (nomes.length > 0) {
      detalhes.push(`${grupo.nome}: ${nomes.join(", ")}`);
    }
  }

  return {
    id: id,
    produtoId: produto.id,
    nomeProduto: produto.nome,
    apresentacaoId: apresentacao.id,
    nomeApresentacao: apresentacao.nome,
    quantidade: quantidade,
    escolhas: escolhasCopiadas,
    detalhes: detalhes,
    observacao: observacaoLimpa,
    precoUnitarioCentavos: resultado.precoPorItemCentavos,
  };
}

function calcularResumoCarrinho(itens) {
  let quantidade = 0;
  let subtotalCentavos = 0;

  for (const item of itens) {
    quantidade += item.quantidade;
    subtotalCentavos += item.precoUnitarioCentavos * item.quantidade;
  }

  return { quantidade: quantidade, subtotalCentavos: subtotalCentavos };
}

function adicionarAoCarrinho(evento) {
  evento.preventDefault();
  if (!produtoAtual || !elementos.formularioProduto.reportValidity()) {
    return;
  }

  const item = criarItemCarrinho(
    proximoIdItem,
    produtoAtual,
    elementos.apresentacao.value,
    Number(elementos.quantidade.value),
    lerEscolhas(),
    elementos.observacao.value
  );

  if (item.erro) {
    mostrarPendencia(item.erro);
    return;
  }

  carrinho.push(item);
  proximoIdItem += 1;
  salvarCarrinho();
  renderizarCarrinho();
  elementos.mensagemCarrinho.textContent = `Adicionado: ${item.quantidade} × ${item.nomeProduto} (${item.nomeApresentacao}).`;
  elementos.tituloCarrinho.focus({ preventScroll: true });
  elementos.tituloCarrinho.scrollIntoView({ block: "start" });
}

function renderizarCarrinho() {
  // Uma mudança nos itens exige uma nova revisão e um novo cálculo do troco.
  invalidarRevisao();
  elementos.itensCarrinho.replaceChildren();
  const resumo = calcularResumoCarrinho(carrinho);
  elementos.carrinhoVazio.hidden = carrinho.length > 0;
  elementos.limparCarrinho.disabled = carrinho.length === 0;
  elementos.quantidadeCarrinho.textContent = resumo.quantidade;
  elementos.subtotalCarrinho.textContent = formatarDinheiro(resumo.subtotalCentavos);
  // Qualquer mudança no carrinho também atualiza a taxa e o total do pedido.
  atualizarTotaisPedido();

  carrinho.forEach((item) => {
    const linha = criarElemento("li", "", "item-carrinho");
    linha.dataset.itemId = item.id;
    const titulo = criarElemento("h3", item.nomeProduto);
    titulo.id = `titulo-item-${item.id}`;
    titulo.tabIndex = -1;
    linha.append(titulo, criarElemento("p", item.nomeApresentacao));

    const detalhes = criarElemento("ul", "", "item-detalhes");
    item.detalhes.forEach((texto) => detalhes.append(criarElemento("li", texto)));
    if (item.detalhes.length > 0) {
      linha.append(detalhes);
    }
    if (item.observacao) {
      linha.append(criarElemento("p", `Observação: ${item.observacao}`, "item-observacao"));
    }
    linha.append(criarElemento("p", `${formatarDinheiro(item.precoUnitarioCentavos)} por item`));

    const controles = criarElemento("div", "", "quantidade-item");
    controles.setAttribute("role", "group");
    controles.setAttribute("aria-label", `Quantidade de ${item.nomeProduto} (${item.nomeApresentacao})`);

    const diminuir = criarElemento("button", "−", "botao botao-quantidade");
    diminuir.type = "button";
    diminuir.id = `diminuir-item-${item.id}`;
    diminuir.setAttribute("aria-label", "Diminuir quantidade");
    diminuir.disabled = item.quantidade <= CONFIG_LOJA.limites.quantidadeMinima;
    diminuir.addEventListener("click", () => alterarQuantidadeItem(item.id, -1));

    const aumentar = criarElemento("button", "+", "botao botao-quantidade");
    aumentar.type = "button";
    aumentar.id = `aumentar-item-${item.id}`;
    aumentar.setAttribute("aria-label", "Aumentar quantidade");
    aumentar.disabled = item.quantidade >= CONFIG_LOJA.limites.quantidadeMaxima;
    aumentar.addEventListener("click", () => alterarQuantidadeItem(item.id, 1));

    controles.append(diminuir, criarElemento("span", `Quantidade: ${item.quantidade}`), aumentar);
    const subtotal = criarElemento("p", "Subtotal: ");
    subtotal.append(criarElemento("strong", formatarDinheiro(item.precoUnitarioCentavos * item.quantidade)));

    const remover = criarElemento("button", "Remover item", "botao botao-remover");
    remover.type = "button";
    remover.setAttribute("aria-label", `Remover ${item.nomeProduto} (${item.nomeApresentacao})`);
    remover.addEventListener("click", () => removerItem(item.id));

    linha.append(controles, subtotal, remover);
    elementos.itensCarrinho.append(linha);
  });
}

function alterarQuantidadeItem(id, variacao) {
  const item = carrinho.find((item) => item.id === id);
  if (!item) {
    return;
  }

  const novaQuantidade = item.quantidade + variacao;
  if (!Number.isInteger(novaQuantidade) ||
      novaQuantidade < CONFIG_LOJA.limites.quantidadeMinima ||
      novaQuantidade > CONFIG_LOJA.limites.quantidadeMaxima) {
    return;
  }

  item.quantidade = novaQuantidade;
  salvarCarrinho();
  renderizarCarrinho();
  elementos.mensagemCarrinho.textContent = `Quantidade de ${item.nomeProduto} (${item.nomeApresentacao}): ${item.quantidade}.`;

  // Os botões foram recriados. Recuperamos o foco para quem usa teclado.
  const prefixo = variacao > 0 ? "aumentar" : "diminuir";
  const botao = document.getElementById(`${prefixo}-item-${id}`);
  const destino = botao.disabled ? document.getElementById(`titulo-item-${id}`) : botao;
  destino.focus({ preventScroll: true });
}

function removerItem(id) {
  const item = carrinho.find((item) => item.id === id);
  if (!item) {
    return;
  }
  // filter devolve uma lista que contém somente os outros itens.
  carrinho = carrinho.filter((item) => item.id !== id);
  salvarCarrinho();
  renderizarCarrinho();
  elementos.mensagemCarrinho.textContent = `Removido: ${item.nomeProduto} (${item.nomeApresentacao}).`;
  elementos.tituloCarrinho.focus({ preventScroll: true });
}

function esvaziarCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();
  elementos.mensagemCarrinho.textContent = "Carrinho esvaziado.";
  elementos.tituloCarrinho.focus({ preventScroll: true });
}

// 11. ENTREGA E RETIRADA: calculamos a taxa uma vez por pedido.
function taxaConhecida(taxaCentavos) {
  // Zero é uma taxa válida (grátis). null representa uma taxa desconhecida.
  return Number.isInteger(taxaCentavos) && taxaCentavos >= 0;
}

// Só lê o cadastro e devolve dados. Não consulta nem modifica o HTML.
function calcularRecebimento(tipo, bairroId) {
  if (!CONFIG_LOJA.retirada.ativa && !CONFIG_LOJA.entrega.ativa) {
    return { taxaCentavos: null, pendencia: "Indisponível", mensagem: "Retirada e entrega estão indisponíveis no momento." };
  }

  if (tipo === "retirada") {
    if (!CONFIG_LOJA.retirada.ativa) {
      return { taxaCentavos: null, pendencia: "Indisponível", mensagem: "Retirada indisponível. Escolha entrega." };
    }
    const taxa = CONFIG_LOJA.retirada.taxaCentavos;
    if (!taxaConhecida(taxa)) {
      return { taxaCentavos: null, pendencia: "A confirmar", mensagem: "O valor da retirada precisa ser confirmado com a Bety." };
    }
    return { taxaCentavos: taxa, pendencia: "", mensagem: "Retirada selecionada." };
  }

  if (tipo !== "entrega") {
    return { taxaCentavos: null, pendencia: "A definir", mensagem: "Escolha retirada ou entrega." };
  }
  if (!CONFIG_LOJA.entrega.ativa) {
    return { taxaCentavos: null, pendencia: "Indisponível", mensagem: "Entrega indisponível. Escolha retirada." };
  }

  const bairro = CONFIG_LOJA.entrega.bairros.find((item) => item.id === bairroId);
  if (!bairro) {
    return { taxaCentavos: null, pendencia: "A definir", mensagem: "Selecione um bairro para calcular a entrega." };
  }
  if (!taxaConhecida(bairro.taxaCentavos)) {
    return { taxaCentavos: null, pendencia: "A confirmar", mensagem: "A disponibilidade da entrega e a taxa para esse bairro dependem de confirmação da Bety." };
  }

  const observacaoTaxa = CONFIG_LOJA.modoDemonstracao ? " Taxa demonstrativa." : "";
  return { taxaCentavos: bairro.taxaCentavos, pendencia: "", mensagem: `Entrega para ${bairro.nome}.${observacaoTaxa}` };
}

function calcularTotaisPedido(itens, tipo, bairroId) {
  const resumo = calcularResumoCarrinho(itens);
  const recebimento = calcularRecebimento(tipo, bairroId);
  let totalCentavos = null;

  if (resumo.quantidade === 0) {
    // Um carrinho vazio não gera cobrança de entrega.
    totalCentavos = 0;
  } else if (taxaConhecida(recebimento.taxaCentavos)) {
    totalCentavos = resumo.subtotalCentavos + recebimento.taxaCentavos;
  }

  return {
    quantidade: resumo.quantidade,
    subtotalCentavos: resumo.subtotalCentavos,
    recebimento: recebimento,
    totalCentavos: totalCentavos,
  };
}

function preencherBairros() {
  elementos.bairroEntrega.replaceChildren();
  const placeholder = criarElemento("option", "Selecione o bairro");
  placeholder.value = "";
  elementos.bairroEntrega.append(placeholder);

  CONFIG_LOJA.entrega.bairros.forEach((bairro) => {
    const textoTaxa = taxaConhecida(bairro.taxaCentavos)
      ? formatarDinheiro(bairro.taxaCentavos)
      : "entrega e taxa a confirmar";
    const opcao = criarElemento("option", `${bairro.nome} — ${textoTaxa}`);
    opcao.value = bairro.id;
    elementos.bairroEntrega.append(opcao);
  });
}

function configurarRecebimento() {
  elementos.tipoRetirada.disabled = !CONFIG_LOJA.retirada.ativa;
  elementos.tipoEntrega.disabled = !CONFIG_LOJA.entrega.ativa;
  // Começamos com retirada; se estiver indisponível, usamos entrega.
  elementos.tipoRetirada.checked = CONFIG_LOJA.retirada.ativa;
  elementos.tipoEntrega.checked = !CONFIG_LOJA.retirada.ativa && CONFIG_LOJA.entrega.ativa;

  let textoRetirada = "taxa a confirmar";
  if (taxaConhecida(CONFIG_LOJA.retirada.taxaCentavos)) {
    textoRetirada = CONFIG_LOJA.retirada.taxaCentavos === 0
      ? "grátis"
      : formatarDinheiro(CONFIG_LOJA.retirada.taxaCentavos);
  }
  elementos.rotuloRetirada.textContent = CONFIG_LOJA.retirada.ativa
    ? `Retirada — ${textoRetirada}`
    : "Retirada — indisponível";
  elementos.rotuloEntrega.textContent = CONFIG_LOJA.entrega.ativa
    ? "Entrega — taxa conforme o bairro"
    : "Entrega — indisponível";
  elementos.informacaoRetirada.textContent = CONFIG_LOJA.retirada.endereco;
  preencherBairros();
}

function lerTipoRecebimento() {
  if (elementos.tipoRetirada.checked) {
    return "retirada";
  }
  if (elementos.tipoEntrega.checked) {
    return "entrega";
  }
  return "";
}

function atualizarCamposEntrega() {
  const tipo = lerTipoRecebimento();
  const usaEntrega = tipo === "entrega" && CONFIG_LOJA.entrega.ativa;
  const usaOutroBairro = usaEntrega && elementos.bairroEntrega.value === "outro";

  // hidden cuida da visibilidade; disabled cuida da participação no formulário.
  elementos.camposEntrega.hidden = !usaEntrega;
  elementos.camposEntrega.disabled = !usaEntrega;
  elementos.bairroEntrega.required = usaEntrega;
  elementos.ruaEntrega.required = usaEntrega;
  elementos.numeroEntrega.required = usaEntrega;
  elementos.campoOutroBairro.hidden = !usaOutroBairro;
  elementos.outroBairro.disabled = !usaOutroBairro;
  elementos.outroBairro.required = usaOutroBairro;
  elementos.informacaoRetirada.hidden = tipo !== "retirada" || !CONFIG_LOJA.retirada.ativa;
  // Os valores digitados são preservados ao alternar, mas campos desativados
  // não participam da validação nativa nem dos dados de um FormData.
}

function atualizarTotaisPedido() {
  const tipo = lerTipoRecebimento();
  const resultado = calcularTotaisPedido(carrinho, tipo, elementos.bairroEntrega.value);
  const recebimento = resultado.recebimento;
  elementos.rotuloTaxaCarrinho.textContent = tipo === "retirada"
    ? "Retirada"
    : tipo === "entrega" ? "Entrega" : "Entrega / retirada";

  if (resultado.quantidade === 0) {
    elementos.entregaCarrinho.textContent = "—";
    elementos.totalCarrinho.textContent = formatarDinheiro(0);
    elementos.avisoRecebimento.textContent = recebimento.pendencia === "Indisponível"
      ? recebimento.mensagem
      : `${recebimento.mensagem} Adicione produtos ao carrinho para calcular o total.`;
    return;
  }

  if (resultado.totalCentavos === null) {
    elementos.entregaCarrinho.textContent = recebimento.pendencia;
    elementos.totalCarrinho.textContent = recebimento.pendencia;
    elementos.avisoRecebimento.textContent = `${recebimento.mensagem} Subtotal dos produtos: ${formatarDinheiro(resultado.subtotalCentavos)}. Total ainda a definir.`;
    return;
  }

  elementos.entregaCarrinho.textContent = recebimento.taxaCentavos === 0
    ? "Grátis"
    : formatarDinheiro(recebimento.taxaCentavos);
  elementos.totalCarrinho.textContent = formatarDinheiro(resultado.totalCentavos);
  elementos.avisoRecebimento.textContent = `${recebimento.mensagem} Total do pedido: ${formatarDinheiro(resultado.totalCentavos)}.`;
}

function atualizarRecebimento() {
  atualizarCamposEntrega();
  atualizarTotaisPedido();
}

// 12. PAGAMENTO: lemos as opções do cadastro e calculamos o troco em centavos.
function reaisParaCentavos(texto) {
  const valor = texto.trim();
  // Aceita 100, 100,50 ou 100.50; rejeita letras e separadores de milhares.
  if (!/^\d+([.,]\d{1,2})?$/.test(valor)) {
    return null;
  }
  const partes = valor.replace(",", ".").split(".");
  const reais = Number(partes[0]);
  const centavos = Number((partes[1] || "").padEnd(2, "0"));
  const resultado = reais * 100 + centavos;
  return Number.isSafeInteger(resultado) ? resultado : null;
}

function calcularPagamento(pagamentoId, textoTroco, totalCentavos, subtotalCentavos = 0) {
  const forma = CONFIG_LOJA.pagamentos.find((item) => item.id === pagamentoId);
  if (!forma) {
    return { campo: "pagamento", erro: "Escolha uma forma de pagamento disponível." };
  }

  const resultado = {
    nome: forma.nome,
    permiteTroco: forma.permiteTroco,
    trocoParaCentavos: null,
    trocoCentavos: null,
  };
  // Um valor antigo de troco é ignorado ao mudar para Pix ou cartão.
  if (!forma.permiteTroco || textoTroco.trim() === "") {
    return resultado;
  }

  const valor = reaisParaCentavos(textoTroco);
  if (valor === null || valor <= 0) {
    return { campo: "troco", erro: "Informe um valor maior que zero, como 100 ou 100,50, sem separar milhares." };
  }
  const minimo = totalCentavos === null ? subtotalCentavos : totalCentavos;
  if (valor < minimo) {
    const referencia = totalCentavos === null ? "subtotal dos produtos" : "total do pedido";
    return { campo: "troco", erro: `O valor para pagamento precisa cobrir o ${referencia}: ${formatarDinheiro(minimo)}.` };
  }

  resultado.trocoParaCentavos = valor;
  // Uma taxa pendente não permite calcular o valor final do troco.
  resultado.trocoCentavos = totalCentavos === null ? null : valor - totalCentavos;
  return resultado;
}

function preencherPagamentos() {
  elementos.pagamento.replaceChildren();
  const placeholder = criarElemento("option", "Selecione uma opção");
  placeholder.value = "";
  elementos.pagamento.append(placeholder);
  CONFIG_LOJA.pagamentos.forEach((forma) => {
    const opcao = criarElemento("option", forma.nome);
    opcao.value = forma.id;
    elementos.pagamento.append(opcao);
  });
}

function atualizarPagamento() {
  const forma = CONFIG_LOJA.pagamentos.find((item) => item.id === elementos.pagamento.value);
  const permiteTroco = Boolean(forma && forma.permiteTroco);
  elementos.campoTroco.hidden = !permiteTroco;
  elementos.troco.disabled = !permiteTroco;
}

// 13. DADOS E VALIDAÇÃO: nenhuma leitura de data ou horário é necessária.
function normalizarTelefone(texto) {
  if (!/^\+?[\d\s()-]+$/.test(texto.trim())) {
    return "";
  }
  let digitos = texto.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {
    digitos = digitos.slice(2);
  }
  // Validação simples do formato brasileiro com DDD; não verifica existência.
  return /^\d{10,11}$/.test(digitos) ? digitos : "";
}

function lerDadosPedido() {
  return {
    nome: elementos.clienteNome.value.trim(),
    telefone: normalizarTelefone(elementos.clienteTelefone.value),
    tipoRecebimento: lerTipoRecebimento(),
    bairroId: elementos.bairroEntrega.value,
    outroBairro: elementos.outroBairro.value.trim(),
    rua: elementos.ruaEntrega.value.trim(),
    numero: elementos.numeroEntrega.value.trim(),
    complemento: elementos.complementoEntrega.value.trim(),
    referencia: elementos.referenciaEntrega.value.trim(),
    pagamentoId: elementos.pagamento.value,
    textoTroco: elementos.troco.value.trim(),
    observacao: elementos.observacaoPedido.value.trim(),
  };
}

function validarDadosPedido(dados, totais) {
  if (totais.quantidade === 0) {
    return { campo: "tituloCarrinho", erro: "Adicione um produto ao carrinho antes de revisar." };
  }
  if (totais.subtotalCentavos < CONFIG_LOJA.pedidoMinimoCentavos) {
    return { campo: "tituloCarrinho", erro: `O mínimo em produtos é ${formatarDinheiro(CONFIG_LOJA.pedidoMinimoCentavos)}.` };
  }
  if (!dados.nome) {
    return { campo: "clienteNome", erro: "Informe seu nome; espaços sozinhos não preenchem o campo." };
  }
  if (!dados.telefone) {
    return { campo: "clienteTelefone", erro: "Informe um telefone com DDD e 10 ou 11 dígitos. O prefixo +55 é opcional." };
  }
  if (totais.recebimento.pendencia === "Indisponível") {
    return { campo: "tituloFinalizacao", erro: totais.recebimento.mensagem };
  }
  if (dados.tipoRecebimento !== "retirada" && dados.tipoRecebimento !== "entrega") {
    return { campo: "tituloFinalizacao", erro: "Escolha retirada ou entrega." };
  }
  if (dados.tipoRecebimento === "entrega") {
    const bairro = CONFIG_LOJA.entrega.bairros.find((item) => item.id === dados.bairroId);
    if (!bairro) {
      return { campo: "bairroEntrega", erro: "Selecione o bairro da entrega." };
    }
    if (bairro.id === "outro" && !dados.outroBairro) {
      return { campo: "outroBairro", erro: "Informe o nome do outro bairro." };
    }
    if (!dados.rua) {
      return { campo: "ruaEntrega", erro: "Informe a rua da entrega." };
    }
    if (!dados.numero) {
      return { campo: "numeroEntrega", erro: "Informe o número do endereço ou s/n." };
    }
  }
  if (dados.observacao.length > CONFIG_LOJA.limites.observacaoPedidoMaxima) {
    return { campo: "observacaoPedido", erro: "A observação geral ultrapassou o limite de caracteres." };
  }
  return null;
}

// 14. REVISÃO: montamos texto com os dados atuais, sem enviar nada.
function gerarTextoPedido(itens, dados, totais, pagamento) {
  const linhas = [
    `Pedido para ${CONFIG_LOJA.nome}`,
    "",
    `Cliente: ${dados.nome}`,
    `Telefone com DDD: ${dados.telefone}`,
    "",
    "PRODUTOS",
  ];

  itens.forEach((item, indice) => {
    linhas.push(`${indice + 1}. ${item.quantidade} × ${item.nomeProduto} (${item.nomeApresentacao})`);
    item.detalhes.forEach((detalhe) => linhas.push(`   ${detalhe}`));
    if (item.observacao) {
      linhas.push(`   Observação: ${item.observacao}`);
    }
    linhas.push(`   Por item: ${formatarDinheiro(item.precoUnitarioCentavos)}`);
    linhas.push(`   Subtotal: ${formatarDinheiro(item.precoUnitarioCentavos * item.quantidade)}`, "");
  });

  if (dados.tipoRecebimento === "entrega") {
    const bairro = CONFIG_LOJA.entrega.bairros.find((item) => item.id === dados.bairroId);
    const nomeBairro = bairro.id === "outro" ? dados.outroBairro : bairro.nome;
    linhas.push("RECEBIMENTO: ENTREGA", `Bairro: ${nomeBairro}`, `Endereço: ${dados.rua}, ${dados.numero}`);
    if (dados.complemento) {
      linhas.push(`Complemento: ${dados.complemento}`);
    }
    if (dados.referencia) {
      linhas.push(`Referência: ${dados.referencia}`);
    }
  } else {
    linhas.push("RECEBIMENTO: RETIRADA", `Local: ${CONFIG_LOJA.retirada.endereco}`);
  }

  const taxa = totais.recebimento.taxaCentavos;
  linhas.push("", "VALORES", `Subtotal dos produtos: ${formatarDinheiro(totais.subtotalCentavos)}`);
  linhas.push(`Taxa de ${dados.tipoRecebimento}: ${taxa === null ? "a confirmar" : formatarDinheiro(taxa)}`);
  linhas.push(`Total: ${totais.totalCentavos === null ? "a confirmar" : formatarDinheiro(totais.totalCentavos)}`);
  if (totais.totalCentavos === null) {
    linhas.push(totais.recebimento.mensagem);
  }

  linhas.push("", `PAGAMENTO: ${pagamento.nome}`);
  if (pagamento.permiteTroco) {
    if (pagamento.trocoParaCentavos === null) {
      linhas.push("Troco: não solicitado.");
    } else {
      linhas.push(`Valor para pagamento: ${formatarDinheiro(pagamento.trocoParaCentavos)}`);
      linhas.push(pagamento.trocoCentavos === null
        ? "Troco e valor necessário para pagamento: a confirmar após definição da taxa."
        : `Troco calculado: ${formatarDinheiro(pagamento.trocoCentavos)}`);
    }
  }
  if (dados.observacao) {
    linhas.push("", `Observação geral: ${dados.observacao}`);
  }
  linhas.push("", "Pedido sujeito à confirmação da Bety.");
  // \n representa uma quebra de linha no texto, não uma tag HTML.
  return linhas.join("\n");
}

function invalidarRevisao() {
  const estavaVisivel = !elementos.revisao.hidden;
  elementos.revisao.hidden = true;
  elementos.resumoPedido.replaceChildren();
  elementos.mensagemWhatsapp.value = "";
  elementos.editarPedido.disabled = true;
  elementos.revisarPedido.disabled = carrinho.length === 0 ||
    (!CONFIG_LOJA.retirada.ativa && !CONFIG_LOJA.entrega.ativa) ||
    CONFIG_LOJA.pagamentos.length === 0;
  elementos.avisoValidacao.textContent = estavaVisivel
    ? "Pedido alterado. Clique em Revisar pedido para conferir os dados atualizados."
    : "";
  // Uma mensagem personalizada antiga não deve impedir uma nova tentativa.
  elementos.formularioPedido.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.setCustomValidity("");
  });
  atualizarBotoesEnvio();
}

function mostrarErroPedido(resultado) {
  elementos.avisoValidacao.textContent = resultado.erro;
  const campo = elementos[resultado.campo];
  if (typeof campo.setCustomValidity === "function") {
    campo.setCustomValidity(resultado.erro);
    campo.reportValidity();
  } else {
    campo.focus({ preventScroll: true });
    campo.scrollIntoView({ block: "start" });
  }
}

function revisarPedido(evento) {
  evento.preventDefault();
  invalidarRevisao();
  const dados = lerDadosPedido();
  const totais = calcularTotaisPedido(carrinho, dados.tipoRecebimento, dados.bairroId);
  const erroDados = validarDadosPedido(dados, totais);
  if (erroDados) {
    mostrarErroPedido(erroDados);
    return;
  }
  const pagamento = calcularPagamento(dados.pagamentoId, dados.textoTroco, totais.totalCentavos, totais.subtotalCentavos);
  if (pagamento.erro) {
    mostrarErroPedido(pagamento);
    return;
  }
  // Mantemos também as regras do HTML, como required e maxlength.
  if (!elementos.formularioPedido.reportValidity()) {
    elementos.avisoValidacao.textContent = "Confira o campo indicado pelo navegador.";
    return;
  }

  const textoTotal = totais.totalCentavos === null ? "A confirmar com a Bety" : formatarDinheiro(totais.totalCentavos);
  const resumo = criarElemento("p", `${totais.quantidade} item(ns) no pedido\nTotal: ${textoTotal}\nPagamento: ${pagamento.nome}`, "texto-revisao");
  elementos.resumoPedido.replaceChildren(resumo);
  elementos.mensagemWhatsapp.value = gerarTextoPedido(carrinho, dados, totais, pagamento);
  elementos.avisoValidacao.textContent = "Dados conferidos. Revise o pedido abaixo; ele ainda não foi enviado.";
  elementos.editarPedido.disabled = false;
  elementos.revisao.hidden = false;
  atualizarBotoesEnvio();
  elementos.tituloRevisao.focus({ preventScroll: true });
  elementos.tituloRevisao.scrollIntoView({ block: "start" });
}

function voltarParaEditar() {
  invalidarRevisao();
  elementos.avisoValidacao.textContent = "Altere o que precisar e clique novamente em Revisar pedido.";
  elementos.tituloFinalizacao.focus({ preventScroll: true });
  elementos.tituloFinalizacao.scrollIntoView({ block: "start" });
}

// 15. WHATSAPP: só abrimos a conversa após um clique e uma revisão válida.
function numeroWhatsappValido(numero) {
  // Esta loja usa números brasileiros: 55 + DDD + 8 ou 9 dígitos.
  // Conferimos o formato, não a existência de uma conta no WhatsApp.
  return typeof numero === "string" && /^55[1-9]\d\d{8,9}$/.test(numero.trim());
}

function montarLinkWhatsapp(numero, texto) {
  if (!numeroWhatsappValido(numero) || typeof texto !== "string" || !texto.trim()) {
    return "";
  }
  // Codificamos somente a mensagem, preservando o endereço e o parâmetro text.
  return `https://wa.me/${numero.trim()}?text=${encodeURIComponent(texto)}`;
}

function atualizarBotoesEnvio() {
  const temRevisao = !elementos.revisao.hidden && elementos.mensagemWhatsapp.value.trim() !== "";
  const numeroValido = numeroWhatsappValido(CONFIG_LOJA.whatsapp);
  elementos.copiarPedido.disabled = !temRevisao;
  elementos.enviarWhatsapp.disabled = !temRevisao || !numeroValido;
  elementos.contatoWhatsapp.textContent = numeroValido
    ? `WhatsApp da loja: +${CONFIG_LOJA.whatsapp.trim()}`
    : "WhatsApp da loja: a definir.";

  if (!temRevisao) {
    elementos.avisoWhatsapp.textContent = "";
    return;
  }
  elementos.avisoWhatsapp.textContent = numeroValido
    ? `Destino: +${CONFIG_LOJA.whatsapp.trim()}. A mensagem será preenchida para você conferir e enviar.`
    : "O WhatsApp da loja ainda não está disponível. Você pode copiar o texto do pedido.";
}

function obterTextoRevisado() {
  if (elementos.revisao.hidden || !elementos.mensagemWhatsapp.value.trim()) {
    elementos.avisoValidacao.textContent = "Clique em Revisar pedido antes de continuar.";
    return "";
  }

  // Conferimos novamente os dados atuais, inclusive antes de copiar o texto.
  const dados = lerDadosPedido();
  const totais = calcularTotaisPedido(carrinho, dados.tipoRecebimento, dados.bairroId);
  const pagamento = calcularPagamento(dados.pagamentoId, dados.textoTroco, totais.totalCentavos, totais.subtotalCentavos);
  const dadosValidos = !validarDadosPedido(dados, totais) && !pagamento.erro &&
    elementos.formularioPedido.checkValidity();
  const textoAtual = dadosValidos ? gerarTextoPedido(carrinho, dados, totais, pagamento) : "";

  if (!dadosValidos || textoAtual !== elementos.mensagemWhatsapp.value) {
    invalidarRevisao();
    elementos.avisoValidacao.textContent = "O pedido mudou. Clique em Revisar pedido para conferir novamente.";
    elementos.tituloFinalizacao.focus({ preventScroll: true });
    elementos.tituloFinalizacao.scrollIntoView({ block: "start" });
    return "";
  }
  return textoAtual;
}

function abrirWhatsapp() {
  const texto = obterTextoRevisado();
  if (!texto) {
    return;
  }
  const link = montarLinkWhatsapp(CONFIG_LOJA.whatsapp, texto);
  if (!link) {
    atualizarBotoesEnvio();
    return;
  }

  // A chamada ocorre diretamente no clique, sem esperar uma tarefa assíncrona.
  // noopener separa as abas; noreferrer também omite o endereço de origem.
  window.open(link, "_blank", "noopener,noreferrer");
  // Não usamos o retorno para afirmar que abriu: noopener pode retornar null.
  elementos.avisoWhatsapp.textContent = "Confira a conversa e toque em Enviar no WhatsApp. Se não abrir ou o texto não aparecer completo, use Copiar pedido. Aguarde a confirmação da Bety.";
  // Preservamos o carrinho: abrir uma conversa não comprova envio ou recebimento.
}

async function copiarPedido() {
  const texto = obterTextoRevisado();
  if (!texto) {
    return;
  }

  if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      // A pessoa pode ter editado o pedido enquanto o navegador copiava.
      if (!elementos.revisao.hidden && elementos.mensagemWhatsapp.value === texto) {
        elementos.avisoWhatsapp.textContent = "Texto copiado. Cole na conversa correta do WhatsApp, confira e toque em Enviar.";
      }
      return;
    } catch {
      // Se a cópia automática não for permitida, oferecemos a seleção manual.
    }
  }

  if (elementos.revisao.hidden || elementos.mensagemWhatsapp.value !== texto) {
    return;
  }
  elementos.mensagemWhatsapp.focus();
  elementos.mensagemWhatsapp.select();
  elementos.mensagemWhatsapp.setSelectionRange(0, texto.length);
  elementos.avisoWhatsapp.textContent = "O texto foi selecionado. Pressione Ctrl+C (ou Command+C no Mac); no celular, use a opção Copiar. Depois cole na conversa correta do WhatsApp.";
}

// 16. PERSISTÊNCIA: guardamos escolhas e quantidades; preços vêm do cadastro atual.
function prepararCarrinhoParaSalvar(itens) {
  return {
    versao: 1,
    itens: itens.map((item) => ({
      produtoId: item.produtoId,
      apresentacaoId: item.apresentacaoId,
      quantidade: item.quantidade,
      escolhas: item.escolhas,
      observacao: item.observacao,
    })),
  };
}

function recuperarCarrinhoSalvo(dados) {
  if (!dados || dados.versao !== 1 || !Array.isArray(dados.itens)) {
    return { itens: [], descartados: 0, invalido: true };
  }
  const itens = [];
  let descartados = 0;

  for (const salvo of dados.itens) {
    if (!salvo || typeof salvo !== "object" || Array.isArray(salvo)) {
      descartados += 1;
      continue;
    }
    const produto = PRODUTOS.find((item) => item.id === salvo.produtoId);
    // criarItemCarrinho verifica disponibilidade, tamanho, quantidade e escolhas.
    // Nomes e preços salvos por versões antigas nunca são usados no cálculo.
    const item = criarItemCarrinho(
      itens.length + 1,
      produto,
      salvo.apresentacaoId,
      salvo.quantidade,
      salvo.escolhas,
      salvo.observacao
    );
    if (item.erro) {
      descartados += 1;
      continue;
    }
    itens.push(item);
  }
  return { itens: itens, descartados: descartados, invalido: false };
}

function salvarCarrinho() {
  try {
    if (carrinho.length === 0) {
      // Removemos somente a chave do carrinho, não os demais dados do navegador.
      window.localStorage.removeItem(CHAVE_CARRINHO);
      elementos.avisoArmazenamento.textContent = "Carrinho esvaziado também neste navegador.";
    } else {
      const dados = prepararCarrinhoParaSalvar(carrinho);
      window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(dados));
      elementos.avisoArmazenamento.textContent = "Carrinho salvo neste navegador.";
    }
    return true;
  } catch {
    // Uma recusa do navegador ou falta de espaço não impede montar o pedido.
    elementos.avisoArmazenamento.textContent = "Não foi possível salvar a alteração neste navegador. Ao atualizar ou reabrir a página, esta alteração pode não ser mantida.";
    return false;
  }
}

function restaurarCarrinho() {
  try {
    const textoSalvo = window.localStorage.getItem(CHAVE_CARRINHO);
    if (!textoSalvo) {
      return;
    }
    const resultado = recuperarCarrinhoSalvo(JSON.parse(textoSalvo));
    if (resultado.invalido) {
      elementos.avisoArmazenamento.textContent = "O carrinho salvo está em um formato que não pode ser recuperado. Monte um novo pedido.";
      return;
    }
    carrinho = resultado.itens;
    proximoIdItem = carrinho.length + 1;
    if (resultado.descartados > 0) {
      elementos.avisoArmazenamento.textContent = "Alguns itens salvos não estão mais disponíveis ou válidos e foram retirados do carrinho. Confira os produtos e os preços atuais.";
    } else if (carrinho.length > 0) {
      elementos.avisoArmazenamento.textContent = "Carrinho recuperado neste navegador. Os preços foram recalculados pelo cardápio atual.";
    }
  } catch {
    // Dados incompletos ou armazenamento bloqueado não interrompem a página.
    elementos.avisoArmazenamento.textContent = "Não foi possível recuperar o carrinho salvo. Você pode montar seu pedido nesta página.";
  }
}

// 17. EVENTOS: respondemos às mudanças nos produtos e nos dados do pedido.
elementos.formularioProduto.addEventListener("change", (evento) => {
  if (!produtoAtual) {
    return;
  }

  // closest procura o fieldset do grupo ao qual o campo alterado pertence.
  const campo = evento.target.closest("fieldset[data-grupo-id]");
  if (campo) {
    const grupo = produtoAtual.grupos.find((item) => item.id === campo.dataset.grupoId);
    aplicarLimite(campo, grupo);
  }

  atualizarPreco();
});

// input atualiza o preço enquanto a pessoa digita a quantidade.
elementos.quantidade.addEventListener("input", atualizarPreco);

// Substitui o antigo listener que apenas impedia o envio do formulário.
elementos.formularioProduto.addEventListener("submit", adicionarAoCarrinho);
elementos.limparCarrinho.addEventListener("click", esvaziarCarrinho);

// Mudanças no recebimento atualizam os campos e o total, sem recriar o carrinho.
[
  elementos.tipoRetirada,
  elementos.tipoEntrega,
  elementos.bairroEntrega,
].forEach((campo) => campo.addEventListener("change", atualizarRecebimento));

elementos.pagamento.addEventListener("change", atualizarPagamento);
elementos.formularioPedido.addEventListener("input", invalidarRevisao);
elementos.formularioPedido.addEventListener("change", invalidarRevisao);
elementos.formularioPedido.addEventListener("submit", revisarPedido);
elementos.editarPedido.addEventListener("click", voltarParaEditar);
elementos.enviarWhatsapp.addEventListener("click", abrirWhatsapp);
elementos.copiarPedido.addEventListener("click", copiarPedido);

// 18. INICIALIZAÇÃO: defer garante que o HTML foi lido antes destas chamadas.
elementos.nomeLoja.textContent = CONFIG_LOJA.nome;
elementos.descricaoLoja.textContent = CONFIG_LOJA.descricao;
elementos.nomeLojaRodape.textContent = CONFIG_LOJA.nome;
elementos.enderecoRodape.textContent = CONFIG_LOJA.retirada.ativa
  ? CONFIG_LOJA.retirada.endereco
  : "Retirada indisponível no momento.";
document.title = `${CONFIG_LOJA.nome} | Cardápio`;
configurarRecebimento();
atualizarCamposEntrega();
preencherPagamentos();
atualizarPagamento();
elementos.observacaoPedido.maxLength = CONFIG_LOJA.limites.observacaoPedidoMaxima;
// A validação nativa será chamada por reportValidity dentro de revisarPedido.
elementos.formularioPedido.noValidate = true;
restaurarCarrinho();
renderizarCardapio();
renderizarCarrinho();
