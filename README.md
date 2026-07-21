# Câmbio

Painel de cotações de moedas em tempo real, feito em **HTML, CSS e JavaScript puro**. Consome a [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) e desenha o gráfico dos últimos 30 dias em **SVG escrito à mão**, sem nenhuma biblioteca de gráficos.

## O que ele faz

- Telão com Dólar, Euro, Libra e Bitcoin em relação ao Real, com variação do dia
- - Clique em qualquer moeda para trocar o gráfico e o conversor
  - - Gráfico de linha dos últimos 30 dias renderizado em SVG puro: o path é calculado ponto a ponto em JavaScript
    - - Conversor bidirecional: digite em reais ou na moeda estrangeira e o outro campo acompanha
      - - Estados de carregamento (esqueleto animado) e de erro com botão de tentar de novo
        - - Valores formatados com `toLocaleString` no padrão brasileiro
         
          - ## Como rodar
         
          - ```
            git clone https://github.com/henrii021/cambio.git
            ```

            Abra o `index.html` no navegador. A API é pública e não pede chave.

            ## Decisões que tomei

            **Por que desenhar o gráfico na mão em vez de usar Chart.js?** Porque montar o `path` do SVG a partir dos dados me obrigou a resolver o problema de verdade: normalizar a série entre mínimo e máximo, converter valor em coordenada de tela e tratar o caso da série plana (divisão por zero). São uns 40 linhas de código que ensinam mais que qualquer biblioteca.

            **Por que a AwesomeAPI?** É brasileira, aberta, sem chave e devolve tanto a cotação do momento quanto o histórico diário. Perfeita para um projeto que qualquer pessoa consegue clonar e rodar sem configurar nada.

            **Tratamento de erro em primeiro lugar.** API externa falha: sem internet, com limite de requisições, fora do ar. O painel nunca quebra em silêncio, ele mostra o que aconteceu e oferece o caminho de volta.

            **Detalhe de tipografia:** os números usam `font-variant-numeric: tabular-nums`, então os dígitos têm largura fixa e os valores não "dançam" quando atualizam.

            ## Stack

            HTML5 · CSS3 · JavaScript (ES6+) · Fetch API · SVG · AwesomeAPI
            
