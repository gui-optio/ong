// WhatsApp da APASCS (só números, com 55 + DDD)
const WHATSAPP = "5511968460029";

const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)");

const linkWhats = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

// Botões de WhatsApp com mensagem pronta
document.querySelectorAll("[data-whats]").forEach((el) => {
  el.href = linkWhats(el.dataset.whats);
  el.target = "_blank";
  el.rel = "noopener";
});

// ---------- Navbar ----------
const nav = document.getElementById("nav");
const botaoMenu = nav.querySelector(".nav__menu");
const abrirMenu = (aberta) => {
  nav.classList.toggle("aberta", aberta);
  botaoMenu.setAttribute("aria-expanded", aberta);
  botaoMenu.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
};
const fecharMenu = () => abrirMenu(false);
botaoMenu.addEventListener("click", () => abrirMenu(!nav.classList.contains("aberta")));
nav.querySelectorAll(".nav__links a").forEach((link) => link.addEventListener("click", fecharMenu));
// Tocar fora do menu ou apertar Esc também fecha
document.addEventListener("click", (e) => { if (!nav.contains(e.target)) fecharMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenu(); });

// Patinha embaixo do link da seção que está na tela
const linksNav = [...nav.querySelectorAll(".nav__links a")];
const espiao = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    linksNav.forEach((l) => l.classList.toggle("ativo", l.hash === `#${e.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((secao) => espiao.observe(secao));

// ---------- Cantinho dos pets: olham para o cursor e ganham carinho ----------
const cena = document.getElementById("cena");
const pets = [...cena.querySelectorAll("[data-pet]")];
const pupilas = [...cena.querySelectorAll(".pupila")];
let ultimoMovimento = 0;

function olharPara(x, y) {
  pupilas.forEach((pupila) => {
    const r = pupila.parentNode.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(d / 120, 1) * 3.5;
    pupila.setAttribute("transform", `translate(${(dx / d) * k} ${(dy / d) * k})`);
  });
}

window.addEventListener("pointermove", (e) => {
  ultimoMovimento = performance.now();
  olharPara(e.clientX, e.clientY);
}, { passive: true });

// Sem mouse por perto, eles dão uma olhadinha em volta de vez em quando
setInterval(() => {
  if (performance.now() - ultimoMovimento < 3000) return;
  const r = cena.getBoundingClientRect();
  olharPara(r.left + Math.random() * r.width, r.top + Math.random() * r.height);
}, 2500);

// Corações que sobem e somem (usados pelos pets e pelo gatinho do Pix).
// Com "reduzir movimento" não saem: sem animação eles ficariam parados na tela.
const CORACAO = '<svg class="ilus" viewBox="0 0 40 36"><path class="p" d="M20 34C4 22 0 12 6 6s14-2 14 4c0-6 8-10 14-4s2 16-14 28Z"/></svg>';

function soltarCoracoes(onde, classe, quantos, { espalhar, escala, giro, intervalo, x, y }) {
  if (reduzMovimento.matches) return;
  for (let i = 0; i < quantos; i++) {
    const c = document.createElement("span");
    c.className = classe;
    c.innerHTML = CORACAO;
    if (x !== undefined) {
      c.style.left = `${x}px`;
      c.style.top = `${y}px`;
    }
    c.style.setProperty("--dx", `${(Math.random() - 0.5) * espalhar}px`);
    c.style.setProperty("--s", escala + Math.random() * 0.5);
    c.style.setProperty("--rot", `${(Math.random() - 0.5) * giro}deg`);
    c.style.animationDelay = `${i * intervalo}ms`;
    c.addEventListener("animationend", () => c.remove());
    onde.appendChild(c);
  }
}

function deixarContente(pet) {
  pet.classList.add("contente");
  clearTimeout(pet.fimCarinho);
  pet.fimCarinho = setTimeout(() => pet.classList.remove("contente"), 1200);
}

// x e y são da tela; os corações ficam posicionados dentro da cena
function carinho(pet, x, y, quantos) {
  deixarContente(pet);
  const r = cena.getBoundingClientRect();
  soltarCoracoes(cena, "coracao", quantos, { espalhar: 140, escala: 0.7, giro: 60, intervalo: 70, x: x - r.left, y: y - r.top });
}

// Carinho = passar o mouse em cima (ou tocar, no celular)
pets.forEach((pet) => {
  let percorrido = 0, anterior = null, ultimoCoracao = 0;
  pet.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (anterior) percorrido += Math.hypot(e.clientX - anterior.x, e.clientY - anterior.y);
    anterior = { x: e.clientX, y: e.clientY };
    if (percorrido > 50 && performance.now() - ultimoCoracao > 300) {
      percorrido = 0;
      ultimoCoracao = performance.now();
      carinho(pet, e.clientX, e.clientY, 2);
    } else {
      deixarContente(pet);
    }
  });
  pet.addEventListener("pointerleave", () => { anterior = null; percorrido = 0; });
  pet.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") carinho(pet, e.clientX, e.clientY, 5);
  });
});

// ---------- Como adotar: no celular não tem hover ----------
// O passo que chega no meio da tela ganha o destaque e o ícone se mexe.
if (matchMedia("(hover: none)").matches) {
  const passos = document.querySelectorAll(".jornada__passo");
  const foco = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => e.target.classList.toggle("em-foco", e.isIntersecting));
  }, { rootMargin: "-45% 0px -45% 0px" });
  passos.forEach((passo) => foco.observe(passo));
}

// ---------- Sanfona (Guarda responsável) ----------
// No celular as perguntas começam fechadas, para caberem numa tela só
if (matchMedia("(max-width: 899px)").matches) {
  document.querySelectorAll(".sanfona details[open]").forEach((d) => (d.open = false));
}

// ---------- Carteirinha de vacina (Guarda responsável) ----------
// Os checks e o carimbo esperam escondidos até a ilustração aparecer na tela;
// passar o mouse repete a sequência.
const carteirinha = document.querySelector(".guarda__ilus");
if (carteirinha && !reduzMovimento.matches) {
  const carimbar = () => {
    carteirinha.classList.remove("espera", "carimbar");
    carteirinha.getBoundingClientRect(); // reinicia as animações
    carteirinha.classList.add("carimbar");
  };
  carteirinha.classList.add("espera");
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    carimbar();
    obs.disconnect();
  }, { threshold: 0.5 }).observe(carteirinha);
  carteirinha.addEventListener("mouseenter", carimbar);
}

// ---------- Copiar chave Pix ----------
const botaoPix = document.getElementById("copiar-pix");
const textoBotaoPix = botaoPix.innerHTML;
// no celular o botão fica dentro da caixinha do Pix, então usa a versão curta do texto
const textoBotao = (longo, curto) =>
  `<span class="texto-longo">${longo}</span><span class="texto-curto">${curto}</span>`;
const cardPix = botaoPix.closest(".ajuda__card");

// O gatinho fecha os olhos de alegria, dá um pulinho e solta corações
function gatoFeliz() {
  cardPix.classList.remove("feliz");
  void cardPix.offsetWidth; // reinicia o pulinho se clicar de novo
  cardPix.classList.add("feliz");
  clearTimeout(cardPix.fimFeliz);
  cardPix.fimFeliz = setTimeout(() => cardPix.classList.remove("feliz"), 2500);
  soltarCoracoes(cardPix, "coracao-pix", 4, { espalhar: 90, escala: 0.8, giro: 50, intervalo: 110 });
}
botaoPix.addEventListener("click", async () => {
  const chave = document.getElementById("pix-chave").textContent.replace(/\D/g, "");
  const aviso = document.getElementById("pix-aviso");
  try {
    await navigator.clipboard.writeText(chave);
    aviso.textContent = "Chave copiada! Obrigado por ajudar 🧡";
    botaoPix.innerHTML = textoBotao("Copiado! Obrigado 🧡", "Copiado!");
    gatoFeliz();
  } catch {
    aviso.textContent = `Copie manualmente: ${chave}`;
    botaoPix.innerHTML = textoBotao("Copie a chave acima", "Copie à mão");
  }
  clearTimeout(botaoPix.volta);
  botaoPix.volta = setTimeout(() => (botaoPix.innerHTML = textoBotaoPix), 2500);
});

// ---------- Cards de ajuda entram em sequência quando aparecem ----------
const ajuda = document.querySelector(".ajuda");
ajuda.classList.add("anima");
new IntersectionObserver((entradas, obs) => {
  if (!entradas[0].isIntersecting) return;
  ajuda.classList.add("visivel");
  obs.disconnect();
}, { threshold: 0.2 }).observe(ajuda);
