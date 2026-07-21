/* ==========================================================
   CÂMBIO · painel de cotações
   Consome a AwesomeAPI (sem chave), renderiza um telão com
   minigráficos, fita de cotações, gráfico SVG de 30 dias
   desenhado à mão e tooltip interativo. Sem bibliotecas.
   ========================================================== */

const API_BASE = "https://economia.awesomeapi.com.br/json";

const MOEDAS = [
  { par: "USD-BRL", codigo: "USD", nome: "Dólar", bandeira: "🇺🇸" },
  { par: "EUR-BRL", codigo: "EUR", nome: "Euro", bandeira: "🇪🇺" },
  { par: "GBP-BRL", codigo: "GBP", nome: "Libra", bandeira: "🇬🇧" },
  { par: "BTC-BRL", codigo: "BTC", nome: "Bitcoin", bandeira: "₿" },
];

const telao = document.getElementById("telao");
const erro = document.getElementById("erro");
const atualizadoEm = document.getElementById("atualizadoEm");
const led = document.getElementById("led");

let cotacoes = {};        // { USD: { valor, variacao, nome, mini: [...] } }
let serieAtual = [];      // série de 30 dias da moeda ativa (para o tooltip)
let moedaAtiva = "USD";

// ---------- Carga inicial ----------

iniciar();
document.getElementById("btnTentar").addEventListener("click", iniciar);

async function iniciar() {
  erro.hidden = true;
  led.className = "led";
  renderEsqueleto();

  try {
    await carregarCotacoes();
    await carregarMinis();
    renderTelao();
    renderFita();
    await carregarHistorico(moedaAtiva);
    atualizarConversor();
    led.className = "led on";
  } catch (e) {
    console.error(e);
    telao.innerHTML = "";
    erro.hidden = false;
    led.className = "led off";
    atualizadoEm.textContent = "sem conexão";
  }
}

function renderEsqueleto() {
  telao.innerHTML = MOEDAS.map(
    (m) => `
    <div class="moeda esqueleto">
      <div class="moeda-cabeca">
        <span class="moeda-codigo">${m.codigo} / BRL</span>
      </div>
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
      bandeira: m.bandeira,
      valor: parseFloat(item.bid),
      variacao: parseFloat(item.pctChange),
      mini: [],
    };
  });

  const agora = new Date();
  atualizadoEm.textContent =
    "atualizado às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Busca 7 dias de cada moeda para o minigráfico dos cards.
// Promise.all dispara as 4 requisições em paralelo.

async function carregarMinis() {
  const respostas = await Promise.all(
    MOEDAS.map((m) =>
      fetch(`${API_BASE}/daily/${m.par}/7`).then((r) => (r.ok ? r.json() : []))
    )
  );

  respostas.forEach((dados, i) => {
    cotacoes[MOEDAS[i].codigo].mini = dados
      .map((d) => parseFloat(d.bid))
      .reverse();
  });
}

function renderTelao() {
  telao.innerHTML = "";

  MOEDAS.forEach((m) => {
    const c = cotacoes[m.codigo];
    const subiu = c.variacao >= 0;

    const card = document.createElement("button");
    card.className = "moeda" + (m.codigo === moedaAtiva ? " ativa" : "");
    card.setAttribute("aria-pressed", m.codigo === moedaAtiva);
    card.innerHTML = `
      <div class="moeda-cabeca">
        <span class="moeda-codigo">${m.codigo} / BRL · ${c.nome}</span>
        <span class="moeda-bandeira" aria-hidden="true">${c.bandeira}</span>
      </div>
      <div class="moeda-valor">${formatarBRL(c.valor, m.codigo === "BTC" ? 0 : 4)}</div>
      <div class="moeda-variacao ${subiu ? "sobe" : "desce"}">
        ${subiu ? "▲" : "▼"} ${c.variacao.toFixed(2).replace(".", ",")}% hoje
      </div>
      ${miniGrafico(c.mini, subiu)}
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

// Minigráfico: polyline SVG com a série de 7 dias normalizada

function miniGrafico(serie, subiu) {
  if (serie.length < 2) return "";

  const min = Math.min(...serie);
  const max = Math.max(...serie);
  const amp = max - min || 1;

  const pontos = serie
    .map((v, i) => {
      const px = (i / (serie.length - 1)) * 100;
      const py = 24 - ((v - min) / amp) * 20 - 2;
      return px.toFixed(1) + "," + py.toFixed(1);
    })
    .join(" ");

  return `
    <svg class="moeda-mini ${subiu ? "mini-sobe" : "mini-desce"}"
         viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${pontos}"/>
    </svg>`;
}

// ---------- Fita de cotações ----------
// O conteúdo é duplicado para a animação de translateX(-50%)
// emendar sem salto, como uma esteira contínua.

function renderFita() {
  const itens = MOEDAS.map((m) => {
    const c = cotacoes[m.codigo];
    const subiu = c.variacao >= 0;
    return `<span>
      <span class="fita-par">${m.codigo}/BRL</span>
      ${c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      <span class="${subiu ? "fita-sobe" : "fita-desce"}">${subiu ? "▲" : "▼"}${Math.abs(c.variacao).toFixed(2).replace(".", ",")}%</span>
    </span>`;
  }).join("");

  document.getElementById("fitaTrilho").innerHTML = itens + itens + itens + itens;
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

const GRAFICO = { LARGURA: 640, ALTURA: 240, topo: 18, base: 30, esq: 12, dir: 64 };

async function carregarHistorico(codigo) {
  const par = MOEDAS.find((m) => m.codigo === codigo).par;
  const resposta = await fetch(`${API_BASE}/daily/${par}/30`);
  if (!resposta.ok) throw new Error("API respondeu " + resposta.status);

  const dados = await resposta.json();

  // A API devolve do mais recente para o mais antigo; invertemos
  serieAtual = dados
    .map((d) => ({
      valor: parseFloat(d.bid),
      data: new Date(parseInt(d.timestamp, 10) * 1000),
    }))
    .reverse();

  desenharGrafico(codigo);
}

function coordenadas() {
  const areaL = GRAFICO.LARGURA - GRAFICO.esq - GRAFICO.dir;
  const areaA = GRAFICO.ALTURA - GRAFICO.topo - GRAFICO.base;

  const valores = serieAtual.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const amp = max - min || 1; // evita divisão por zero em série plana

  return {
    min, max,
    x: (i) => GRAFICO.esq + (i / (serieAtual.length - 1)) * areaL,
    y: (v) => GRAFICO.topo + (1 - (v - min) / amp) * areaA,
    baseY: GRAFICO.topo + areaA,
  };
}

function desenharGrafico(codigo) {
  const svg = document.getElementById("grafico");
  const { min, max, x, y, baseY } = coordenadas();
  const casas = codigo === "BTC" ? 0 : 2;

  const caminhoLinha = serieAtual
    .map((p, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(p.valor).toFixed(1))
    .join(" ");

  const caminhoArea =
    caminhoLinha +
    ` L ${x(serieAtual.length - 1).toFixed(1)} ${baseY}` +
    ` L ${GRAFICO.esq} ${baseY} Z`;

  const ultimo = serieAtual[serieAtual.length - 1];

  svg.innerHTML = `
    <defs>
      <linearGradient id="degradeArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E8C468" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#E8C468" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line class="linha-guia" x1="${GRAFICO.esq}" y1="${y(max)}" x2="${GRAFICO.LARGURA - GRAFICO.dir}" y2="${y(max)}"/>
    <line class="linha-guia" x1="${GRAFICO.esq}" y1="${y(min)}" x2="${GRAFICO.LARGURA - GRAFICO.dir}" y2="${y(min)}"/>
    <text class="texto-eixo" x="${GRAFICO.LARGURA - GRAFICO.dir + 6}" y="${y(max) + 4}">${max.toFixed(casas)}</text>
    <text class="texto-eixo" x="${GRAFICO.LARGURA - GRAFICO.dir + 6}" y="${y(min) + 4}">${min.toFixed(casas)}</text>
    <path class="area-serie" fill="url(#degradeArea)" d="${caminhoArea}"/>
    <path class="linha-serie" d="${caminhoLinha}"/>
    <circle class="ponto-final" cx="${x(serieAtual.length - 1)}" cy="${y(ultimo.valor)}" r="4"/>
    <g id="mira" hidden>
      <line class="mira-linha" y1="${GRAFICO.topo}" y2="${baseY}"/>
      <circle class="mira-ponto" r="4.5"/>
    </g>
    <text class="texto-eixo" x="${GRAFICO.esq}" y="${GRAFICO.ALTURA - 8}">30 dias atrás</text>
    <text class="texto-eixo" x="${GRAFICO.LARGURA - GRAFICO.dir - 30}" y="${GRAFICO.ALTURA - 8}">hoje</text>
  `;

  const nome = cotacoes[codigo].nome;
  document.getElementById("graficoTitulo").textContent = `${nome} · últimos 30 dias`;
  document.getElementById("graficoLegenda").textContent =
    `mín ${min.toFixed(2)} · máx ${max.toFixed(2)}`;
}

// ---------- Tooltip do gráfico ----------
// Convertemos a posição do mouse para o índice mais próximo da
// série e movemos a mira (linha + ponto) e o balão flutuante.

const area = document.getElementById("graficoArea");
const tooltip = document.getElementById("tooltip");

area.addEventListener("mousemove", (ev) => {
  if (!serieAtual.length) return;

  const svg = document.getElementById("grafico");
  const rect = svg.getBoundingClientRect();
  const escala = GRAFICO.LARGURA / rect.width;
  const mouseX = (ev.clientX - rect.left) * escala;

  const { x, y } = coordenadas();
  const areaL = GRAFICO.LARGURA - GRAFICO.esq - GRAFICO.dir;
  const fracao = (mouseX - GRAFICO.esq) / areaL;
  const indice = Math.round(fracao * (serieAtual.length - 1));

  if (indice < 0 || indice > serieAtual.length - 1) {
    esconderMira();
    return;
  }

  const ponto = serieAtual[indice];
  const px = x(indice);
  const py = y(ponto.valor);

  const mira = document.getElementById("mira");
  mira.hidden = false;
  const linha = mira.querySelector("line");
  linha.setAttribute("x1", px);
  linha.setAttribute("x2", px);
  const circulo = mira.querySelector("circle");
  circulo.setAttribute("cx", px);
  circulo.setAttribute("cy", py);

  tooltip.hidden = false;
  tooltip.style.left = (px / escala) + "px";
  tooltip.style.top = (py / escala) + "px";
  document.getElementById("tooltipValor").textContent =
    formatarBRL(ponto.valor, moedaAtiva === "BTC" ? 0 : 4);
  document.getElementById("tooltipData").textContent =
    ponto.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
});

area.addEventListener("mouseleave", esconderMira);

function esconderMira() {
  tooltip.hidden = true;
  const mira = document.getElementById("mira");
  if (mira) mira.hidden = true;
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
  document.getElementById("conversorTaxa").textContent =
    `taxa usada: 1 ${moedaAtiva} = ${formatarBRL(c.valor, moedaAtiva === "BTC" ? 0 : 4)}`;
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
