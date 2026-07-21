/* ==========================================================
   CÂMBIO · painel de cotações
   Identidade: telão de bolsa. Verde cédula escuro, âmbar de
   painel luminoso e dados sempre em mono tabular.
   ========================================================== */

:root {
  --fundo: #0F2E28;
  --fundo-alto: #143B33;
  --linha: #24544A;
  --ambar: #E8C468;
  --claro: #EDEAE0;
  --claro-fraco: #9DB4AC;
  --alta: #7FD99A;
  --baixa: #F08A7E;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background:
    radial-gradient(1200px 600px at 70% -10%, #16453B 0%, transparent 60%),
    var(--fundo);
  color: var(--claro);
  font-family: "Sora", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ---------- Topo ---------- */

.topo {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.topo h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--ambar);
}

.topo-sub {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.75rem;
  color: var(--claro-fraco);
  margin-top: 4px;
}

.atualizado {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.75rem;
  color: var(--claro-fraco);
}

/* ---------- Painel ---------- */

.painel {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ---------- Telão de moedas ---------- */

.telao {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.moeda {
  background: var(--fundo-alto);
  border: 1px solid var(--linha);
  border-radius: 6px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: border-color 0.15s ease, transform 0.1s ease;
}

.moeda:hover { border-color: var(--ambar); transform: translateY(-2px); }
.moeda:focus-visible { outline: 3px solid var(--ambar); outline-offset: 2px; }

.moeda.ativa {
  border-color: var(--ambar);
  box-shadow: inset 0 0 0 1px var(--ambar);
}

.moeda-codigo {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--claro-fraco);
}

.moeda-valor {
  font-family: "Spline Sans Mono", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--ambar);
  margin-top: 6px;
  line-height: 1.1;
}

.moeda-variacao {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.78rem;
  font-weight: 500;
  margin-top: 6px;
}

.sobe { color: var(--alta); }
.desce { color: var(--baixa); }

/* Esqueleto de carregamento */
.moeda.esqueleto .moeda-valor {
  color: transparent;
  background: var(--linha);
  border-radius: 4px;
  animation: brilho 1.2s ease-in-out infinite;
}

@keyframes brilho { 50% { opacity: 0.45; } }

@media (prefers-reduced-motion: reduce) {
  .moeda.esqueleto .moeda-valor { animation: none; }
}

/* ---------- Gráfico ---------- */

.grafico-bloco {
  background: var(--fundo-alto);
  border: 1px solid var(--linha);
  border-radius: 6px;
  padding: 18px;
}

.grafico-cabeca {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.grafico-cabeca h2 { font-size: 1rem; font-weight: 600; }

.grafico-legenda {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.72rem;
  color: var(--claro-fraco);
}

.grafico-area { width: 100%; }

#grafico { width: 100%; height: auto; display: block; }

.linha-serie {
  fill: none;
  stroke: var(--ambar);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.area-serie { fill: var(--ambar); opacity: 0.1; }

.linha-guia {
  stroke: var(--linha);
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.texto-eixo {
  font-family: "Spline Sans Mono", monospace;
  font-size: 11px;
  fill: var(--claro-fraco);
}

.ponto-final { fill: var(--ambar); }

/* ---------- Conversor ---------- */

.conversor {
  background: var(--fundo-alto);
  border: 1px solid var(--linha);
  border-radius: 6px;
  padding: 18px;
}

.conversor h2 { font-size: 1rem; font-weight: 600; margin-bottom: 12px; }

.conversor-linha {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}

.conversor label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--claro-fraco);
  flex: 1;
  min-width: 160px;
}

.conversor input {
  font-family: "Spline Sans Mono", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 1.1rem;
  padding: 10px 12px;
  background: var(--fundo);
  border: 1px solid var(--linha);
  border-radius: 4px;
  color: var(--claro);
  width: 100%;
}

.conversor input:focus { border-color: var(--ambar); outline: none; }

.conversor-seta {
  font-size: 1.2rem;
  color: var(--ambar);
  padding-bottom: 10px;
}

/* ---------- Erro ---------- */

.erro {
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.85rem;
  color: var(--baixa);
  background: rgba(240, 138, 126, 0.08);
  border: 1px solid var(--baixa);
  border-radius: 6px;
  padding: 14px 16px;
}

.erro button {
  background: none;
  border: none;
  color: var(--ambar);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

/* ---------- Rodapé ---------- */

.rodape { border-top: 1px solid var(--linha); padding: 14px 24px; }

.rodape p {
  max-width: 960px;
  margin: 0 auto;
  font-family: "Spline Sans Mono", monospace;
  font-size: 0.7rem;
  color: var(--claro-fraco);
}

@media (max-width: 560px) {
  .topo { padding-top: 28px; }
  .conversor-seta { display: none; }
}
