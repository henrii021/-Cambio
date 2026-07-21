/* ==========================================================
   CÂMBIO · painel de cotações
   Consome a AwesomeAPI (sem chave), renderiza um telão de
   moedas e desenha o gráfico de 30 dias em SVG na mão.
   ========================================================== */

const API_BASE = "https://economia.awesomeapi.com.br/json";

const MOEDAS = [
  { par: "USD-BRL", codigo: "USD", nome: "Dólar" },
  { par: "EUR-BRL", codigo: "EUR", nome: "Euro" },
  { par: "GBP-BRL", codigo: "GBP", nome: "Libra" },
  { par: "BTC-BRL", codigo: "BTC", nome: "Bitcoin" },
];

const telao = document.getElementById("telao");
const erro = document.getElementById("erro");
const atualizadoEm = document.getElementById("atualizadoEm");

let cotacoes = {};          // { USD: { valor, variacao, nome } ... }
let moedaAtiva = "USD";     // moeda exibida no gráfico e no conversor

// ---------- Carga inicial ----------

iniciar();
document.getElementById("btnTentar").addEventListener("click", iniciar);

async function iniciar() {
  erro.hidden = true;
  renderEsqueleto();

  try {
    await carregarCotacoes();
    renderTelao();
    await carregarHistorico(moedaAtiva);
    atualizarConversor();
  } catch (e) {
    console.error(e);
    telao.innerHTML = "";
    erro.hidden = false;
    atualizadoEm.textContent = "sem conexão";
  }
}

function renderEsqueleto() {
  telao.innerHTML = MOEDAS.map(
    (m) => `
    <div class="moeda esqueleto">
      <span class="moeda-codigo">${m.codigo} / BRL</span>
      <div class="moeda-valor">0,0000</div>
      <div class="moeda-variacao">&nbsp;</div>
    </div>`
  ).join("");
}

// ---------- Cotações do dia ----------

async function carregarCotacoes() {
  const pares = MOEDAS.map((m) => m.par).join(",");
  const resposta = await fetch(`${API_BASE}/last/${pares}`);
  if (!resposta.ok) throw new Error("API respondeu " + resposta.status);

  const dados = await resposta.json();

  MOEDAS.forEach((m) => {
    // A API devolve as chaves sem o hífen: USDBRL, EURBRL...
    const item = dados[m.par.replace("-", "")];
    cotacoes[m.codigo] = {
      nome: m.nome,
      valor: parseFloat(item.bid),
      variacao: parseFloat(item.pctChange),
    };
  });

  const agora = new Date();
  atualizadoEm.textContent =
    "atualizado às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function renderTelao() {
  telao.innerHTML = "";

  MOEDAS.forEach((m) => {
    const c = cotacoes[m.codigo];
    const subiu = c.variacao >= 0;

    const card = document.createElement("button");
    card.className = "moeda" + (m.codigo === moedaAtiva ? " ativa" : "");
    card.innerHTML = `
      <span class="moeda-codigo">${m.codigo} / BRL · ${c.nome}</span>
      <div class="moeda-valor">${formatarBRL(c.valor, m.codigo === "BTC" ? 0 : 4)}</div>
      <div class="moeda-variacao ${subiu ? "sobe" : "desce"}">
        ${subiu ? "▲" : "▼"} ${c.variacao.toFixed(2)}% hoje
      </div>
    `;

    card.addEventListener("click", async () => {
      moedaAtiva = m.codigo;
      renderTelao();
      atualizarConversor();
      await carregarHistorico(m.codigo);
    });

    telao.appendChild(card);
  });
}

function formatarBRL(valor, casas) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

// ---------- Histórico + gráfico SVG ----------

async function carregarHistorico(codigo) {
  const par = MOEDAS.find((m) => m.codigo === codigo).par;
  const resposta = await fetch(`${API_BASE}/daily/${par}/30`);
  if (!resposta.ok) throw new Error("API respondeu " + resposta.status);

  const dados = await resposta.json();

  // A API devolve do mais recente para o mais antigo; invertemos
  const serie = dados
    .map((d) => parseFloat(d.bid))
    .reverse();

  desenharGrafico(serie, codigo);
}

function desenharGrafico(serie, codigo) {
  const svg = document.getElementById("grafico");
  const LARGURA = 640;
  const ALTURA = 220;
  const MARGEM = { topo: 16, base: 26, esq: 12, dir: 64 };

  const areaL = LARGURA - MARGEM.esq - MARGEM.dir;
  const areaA = ALTURA - MARGEM.topo - MARGEM.base;

  const min = Math.min(...serie);
  const max = Math.max(...serie);
  const amplitude = max - min || 1; // evita divisão por zero em série plana

  // Converte índice e valor em coordenadas do SVG
  const x = (i) => MARGEM.esq + (i / (serie.length - 1)) * areaL;
  const y = (v) => MARGEM.topo + (1 - (v - min) / amplitude) * areaA;

  // Caminho da linha, ponto a ponto
  const caminhoLinha = serie
    .map((v, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1))
    .join(" ");

  // Mesmo caminho fechado até a base, para a área sombreada
  const caminhoArea =
    caminhoLinha +
    ` L ${x(serie.length - 1).toFixed(1)} ${MARGEM.topo + areaA}` +
    ` L ${MARGEM.esq} ${MARGEM.topo + areaA} Z`;

  const ultimo = serie[serie.length - 1];

  svg.innerHTML = `
    <line class="linha-guia" x1="${MARGEM.esq}" y1="${y(max)}" x2="${LARGURA - MARGEM.dir}" y2="${y(max)}"/>
    <line class="linha-guia" x1="${MARGEM.esq}" y1="${y(min)}" x2="${LARGURA - MARGEM.dir}" y2="${y(min)}"/>
    <text class="texto-eixo" x="${LARGURA - MARGEM.dir + 6}" y="${y(max) + 4}">${max.toFixed(codigo === "BTC" ? 0 : 2)}</text>
    <text class="texto-eixo" x="${LARGURA - MARGEM.dir + 6}" y="${y(min) + 4}">${min.toFixed(codigo === "BTC" ? 0 : 2)}</text>
    <path class="area-serie" d="${caminhoArea}"/>
    <path class="linha-serie" d="${caminhoLinha}"/>
    <circle class="ponto-final" cx="${x(serie.length - 1)}" cy="${y(ultimo)}" r="4"/>
    <text class="texto-eixo" x="${MARGEM.esq}" y="${ALTURA - 8}">30 dias atrás</text>
    <text class="texto-eixo" x="${LARGURA - MARGEM.dir - 30}" y="${ALTURA - 8}">hoje</text>
  `;

  const nome = cotacoes[codigo].nome;
  document.getElementById("graficoTitulo").textContent = `${nome} · últimos 30 dias`;
  document.getElementById("graficoLegenda").textContent =
    `mín ${min.toFixed(2)} · máx ${max.toFixed(2)}`;
}

// ---------- Conversor ----------

const inputBRL = document.getElementById("inputBRL");
const inputMoeda = document.getElementById("inputMoeda");
const rotuloMoeda = document.getElementById("rotuloMoeda");

inputBRL.addEventListener("input", () => converter("brl"));
inputMoeda.addEventListener("input", () => converter("moeda"));

function atualizarConversor() {
  const c = cotacoes[moedaAtiva];
  rotuloMoeda.textContent = `${c.nome} (${moedaAtiva})`;
  converter("brl");
}

function converter(origem) {
  const taxa = cotacoes[moedaAtiva]?.valor;
  if (!taxa) return;

  if (origem === "brl") {
    const brl = parseFloat(inputBRL.value) || 0;
    inputMoeda.value = (brl / taxa).toFixed(moedaAtiva === "BTC" ? 6 : 2);
  } else {
    const qtd = parseFloat(inputMoeda.value) || 0;
    inputBRL.value = (qtd * taxa).toFixed(2);
  }
}
