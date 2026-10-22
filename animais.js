/*
  ANIMAIS DISPONÍVEIS PARA ADOÇÃO
  ================================
  Para adicionar um animal: copie um bloco { ... }, cole no fim da lista
  e troque os valores. Não esqueça a vírgula entre um bloco e outro.

  foto      → nome do arquivo dentro da pasta "img" (ex.: "img/thor.jpg").
              Deixe "" se ainda não tiver foto.
  especie   → "Cão" ou "Gato"
  sexo      → "Macho" ou "Fêmea"
  porte     → "Pequeno", "Médio" ou "Grande"
  castrado / vacinado → true (sim) ou false (não)

  Para tirar um animal adotado: apague o bloco dele inteiro.

  ⚠ OS ANIMAIS ABAIXO SÃO EXEMPLOS — trocar pelos animais reais da APASCS.
*/

window.ANIMAIS = [
  {
    nome: "Paçoca",
    foto: "",
    especie: "Cão",
    sexo: "Fêmea",
    idade: "2 anos",
    porte: "Médio",
    castrado: true,
    vacinado: true,
    jeito: "Ama colo, se dá bem com outros cães e acha que é do tamanho de um gato."
  },
  {
    nome: "Frajola",
    foto: "",
    especie: "Gato",
    sexo: "Macho",
    idade: "1 ano",
    porte: "Pequeno",
    castrado: true,
    vacinado: true,
    jeito: "Curioso, ronrona alto e dorme em cima de qualquer caixa."
  },
  {
    nome: "Bolinha",
    foto: "",
    especie: "Cão",
    sexo: "Macho",
    idade: "6 meses",
    porte: "Pequeno",
    castrado: false,
    vacinado: true,
    jeito: "Filhote cheio de energia. Já sabe sentar (às vezes)."
  },
  {
    nome: "Mel",
    foto: "",
    especie: "Gato",
    sexo: "Fêmea",
    idade: "4 anos",
    porte: "Pequeno",
    castrado: true,
    vacinado: true,
    jeito: "Calma e carinhosa. Ideal para apartamento."
  },
  {
    nome: "Thor",
    foto: "",
    especie: "Cão",
    sexo: "Macho",
    idade: "5 anos",
    porte: "Grande",
    castrado: true,
    vacinado: true,
    jeito: "Tamanho de leão, coração de manteiga. Ótimo companheiro de caminhada."
  },
  {
    nome: "Pipoca",
    foto: "",
    especie: "Gato",
    sexo: "Fêmea",
    idade: "8 meses",
    porte: "Pequeno",
    castrado: false,
    vacinado: true,
    jeito: "Brincalhona. Corre atrás de tudo que se mexe."
  }
];
