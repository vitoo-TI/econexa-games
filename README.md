# EcoNexa Games — Guardiões da Ilha

Projeto front-end completo em **HTML5 + CSS3 + JavaScript puro**, sem React, Vue, Angular ou backend.

A identidade visual foi construída a partir do site de referência enviado, mantendo a linguagem de landing page original: header compacto, títulos grandes, seções claras/escuras, `eyebrows`, cards, progressão por missões e contraste entre Guardiões e Vilões.

## Como abrir no computador

1. Extraia a pasta `guardioes-da-ilha`.
2. Abra a pasta.
3. Dê duplo clique em `index.html`.
4. O site abre diretamente no navegador.

Não é necessário instalar Node.js ou qualquer servidor.

> A página usa uma fonte do Google Fonts quando há internet. Se estiver offline, o navegador usa as fontes de fallback e o restante do site continua funcionando.

## Estrutura

```text
guardioes-da-ilha/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── econexa-games.jpeg
    ├── guardioes-title.jpeg
    ├── guardioes-poster.jpeg
    ├── viloes-poster.jpeg
    ├── luna.jpg
    ├── iris.jpg
    ├── andrew.jpg
    ├── theo.jpg
    ├── valtor.jpg
    ├── stormy.jpg
    ├── ogron.jpg
    └── tritanus.jpg
```

Os JPGs individuais dos personagens são recortes das artes fornecidas para permitir que as imagens sejam utilizadas diretamente nos cards.

## Publicar gratuitamente no GitHub Pages

1. Crie um repositório no GitHub, por exemplo `guardioes-da-ilha`.
2. Envie **todos os arquivos e a pasta `assets`** para o repositório.
3. Abra `Settings` → `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Selecione a branch principal (`main`) e a pasta `/ (root)`.
6. Salve.
7. O GitHub Pages fornecerá o endereço público do site.

## Funcionalidades

- Menu responsivo com hambúrguer no celular.
- Navegação com seção ativa.
- Animações de entrada ao rolar.
- Mapa interativo por regiões.
- Progressão de missões com desbloqueio sequencial.
- HUD de sustentabilidade.
- Combate demonstrativo com quatro poderes.
- Interface fictícia da NEX.
- ECO BREAKER funcional com 48 blocos, 3 vidas, pontuação, teclado e controle por toque.
- Layout adaptado para celular, tablet, notebook e desktop.
