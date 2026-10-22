// WhatsApp da APASCS (só números, com 55 + DDD)
const WHATSAPP = "5511968460029";

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
botaoMenu.addEventListener("click", () => {
  const aberta = nav.classList.toggle("aberta");
  botaoMenu.setAttribute("aria-expanded", aberta);
  botaoMenu.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll(".nav__links a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("aberta");
    botaoMenu.setAttribute("aria-expanded", "false");
  })
);

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

const CORACAO = '<svg viewBox="0 0 40 36"><path d="M20 34C4 22 0 12 6 6s14-2 14 4c0-6 8-10 14-4s2 16-14 28Z" fill="#FF9EAA" stroke="#1C1612" stroke-width="3" stroke-linejoin="round"/></svg>';

function soltarCoracoes(x, y, quantos) {
  const r = cena.getBoundingClientRect();
  for (let i = 0; i < quantos; i++) {
    const c = document.createElement("span");
    c.className = "coracao";
    c.innerHTML = CORACAO;
    c.style.left = `${x - r.left}px`;
    c.style.top = `${y - r.top}px`;
    c.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
    c.style.setProperty("--s", 0.7 + Math.random() * 0.6);
    c.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
    c.style.animationDelay = `${i * 70}ms`;
    c.addEventListener("animationend", () => c.remove());
    cena.appendChild(c);
  }
}

function carinho(pet, x, y, quantos) {
  pet.classList.add("contente");
  clearTimeout(pet.fimCarinho);
  pet.fimCarinho = setTimeout(() => pet.classList.remove("contente"), 1200);
  soltarCoracoes(x, y, quantos);
}

// Carinho = passar o mouse em cima (ou tocar, no celular)
pets.forEach((pet) => {
  let percorrido = 0, anterior = null, ultimoCoracao = 0;
  pet.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (anterior) percorrido += Math.hypot(e.clientX - anterior.x, e.clientY - anterior.y);
    anterior = { x: e.clientX, y: e.clientY };
    pet.classList.add("contente");
    clearTimeout(pet.fimCarinho);
    pet.fimCarinho = setTimeout(() => pet.classList.remove("contente"), 1200);
    if (percorrido > 50 && performance.now() - ultimoCoracao > 300) {
      percorrido = 0;
      ultimoCoracao = performance.now();
      soltarCoracoes(e.clientX, e.clientY, 2);
    }
  });
  pet.addEventListener("pointerleave", () => { anterior = null; percorrido = 0; });
  pet.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") carinho(pet, e.clientX, e.clientY, 5);
  });
});

// ---------- Copiar chave Pix ----------
document.getElementById("copiar-pix").addEventListener("click", async () => {
  const chave = document.getElementById("pix-chave").textContent.replace(/\D/g, "");
  const aviso = document.getElementById("pix-aviso");
  try {
    await navigator.clipboard.writeText(chave);
    aviso.textContent = "Chave copiada! Obrigado por ajudar 🧡";
  } catch {
    aviso.textContent = `Copie manualmente: ${chave}`;
  }
});
