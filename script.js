<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Câmbio · painel de cotações</title>
  <meta name="description" content="Painel de cotações de moedas em tempo real com gráfico SVG desenhado à mão, consumindo a AwesomeAPI.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&family=Spline+Sans+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="topo">
    <div>
      <h1>CÂMBIO</h1>
      <p class="topo-sub">cotações em tempo real · fonte: AwesomeAPI</p>
    </div>
    <p class="atualizado" id="atualizadoEm">carregando…</p>
  </header>

  <main class="painel">

    <!-- Telão de moedas -->
    <section class="telao" id="telao" aria-label="Cotações do dia">
      <!-- Cards de moeda entram via script.js -->
    </section>

    <!-- Gráfico dos últimos 30 dias -->
    <section class="grafico-bloco">
      <header class="grafico-cabeca">
        <h2 id="graficoTitulo">Dólar · últimos 30 dias</h2>
        <div class="grafico-legenda" id="graficoLegenda"></div>
      </header>
      <div class="grafico-area" id="graficoArea">
        <svg id="grafico" viewBox="0 0 640 220" role="img"
             aria-label="Gráfico de linha da variação da moeda nos últimos 30 dias"></svg>
      </div>
    </section>

    <!-- Conversor -->
    <section class="conversor" aria-label="Conversor de moedas">
      <h2>Conversor rápido</h2>
      <div class="conversor-linha">
        <label>
          Reais (BRL)
          <input type="number" id="inputBRL" min="0" step="0.01" value="100">
        </label>
        <span class="conversor-seta" aria-hidden="true">⇄</span>
        <label>
          <span id="rotuloMoeda">Dólar (USD)</span>
          <input type="number" id="inputMoeda" min="0" step="0.01">
        </label>
      </div>
    </section>

    <p class="erro" id="erro" hidden>
      Não consegui falar com a API de cotações agora. Verifique sua conexão e
      <button type="button" id="btnTentar">tente de novo</button>.
    </p>

  </main>

  <footer class="rodape">
    <p>HTML, CSS e JavaScript puro · gráfico SVG desenhado à mão · dados da AwesomeAPI (economia.awesomeapi.com.br)</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
