# Site APASCS

Landing page da APASCS — Associação Protetora dos Animais de São Caetano do Sul.
Feita em HTML, CSS e JavaScript puros. A Vercel publica o site sozinha a cada
commit na `main`.

Os animais disponíveis para adoção ficam no Instagram @apascsong — o site leva
até lá e não precisa ser atualizado a cada adoção.

## Como mudar um texto (Pix, telefone, horário, endereço)

1. Abra o arquivo `index.html` e clique no lápis (**Edit**).
2. Use Ctrl+F (ou Cmd+F) para achar o texto que quer trocar.
3. Troque só o texto, sem apagar o que está entre `<` e `>`.
4. Clique em **Commit changes**. Em 1 ou 2 minutos o site atualiza sozinho.

O número do WhatsApp dos botões fica no início do arquivo `script.js`.

## Rodar no computador

Precisa do Node.js instalado.

```sh
npm install
npm run dev     # abre em http://localhost:3000
npm run build   # gera a versão final na pasta dist (a Vercel faz isso sozinha)
```

Para testar no celular, deixe o `npm run dev` rodando e use `ngrok http 3000`.

## Arquivos

- `index.html` — textos e ilustrações do site
- `styles.css` — visual (primeiro a base, depois uma parte por seção, na ordem da
  página; os ajustes de celular ficam juntos no fim, em `max-width: 899px`)
- `script.js` — botões de WhatsApp, botão de copiar o Pix e as animações
- `vite.config.js` — configuração do servidor local
