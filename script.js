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

// Menu do celular (abre e fecha a coleira)
const coleira = document.getElementById("coleira");
const botaoMenu = coleira.querySelector(".coleira__menu");
botaoMenu.addEventListener("click", () => {
  const aberta = coleira.classList.toggle("aberta");
  botaoMenu.setAttribute("aria-expanded", aberta);
});
coleira.querySelectorAll(".coleira__links a").forEach((link) =>
  link.addEventListener("click", () => {
    coleira.classList.remove("aberta");
    botaoMenu.setAttribute("aria-expanded", "false");
  })
);

// A medalhinha balança quando a página rola
const medalha = document.querySelector(".medalha");
let paradaRolagem;
window.addEventListener("scroll", () => {
  medalha.classList.add("balanca");
  clearTimeout(paradaRolagem);
  paradaRolagem = setTimeout(() => medalha.classList.remove("balanca"), 1000);
}, { passive: true });

// Hero: os pets olham para o cursor e os brinquedos fazem parallax
const hero = document.querySelector(".hero");
const palco = document.getElementById("palco");
const pupilas = [...document.querySelectorAll(".pupila")];
let ultimoMovimento = 0;
let quadro;

function olharPara(x, y) {
  pupilas.forEach((pupila) => {
    const r = pupila.parentNode.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    const distancia = Math.hypot(dx, dy) || 1;
    const alcance = Math.min(distancia / 120, 1) * 3.5;
    pupila.setAttribute("transform", `translate(${(dx / distancia) * alcance} ${(dy / distancia) * alcance})`);
  });
  hero.style.setProperty("--mx", (x / innerWidth - 0.5) * 2);
  hero.style.setProperty("--my", (y / innerHeight - 0.5) * 2);
}

window.addEventListener("pointermove", (e) => {
  ultimoMovimento = Date.now();
  cancelAnimationFrame(quadro);
  quadro = requestAnimationFrame(() => olharPara(e.clientX, e.clientY));
}, { passive: true });

// Sem mouse (celular) ou parado: os pets ficam olhando em volta
setInterval(() => {
  if (Date.now() - ultimoMovimento < 3000) return;
  const r = palco.getBoundingClientRect();
  olharPara(r.left + Math.random() * r.width, r.top + Math.random() * r.height);
}, 1800);

// Carinho: o pet pula, fica feliz e solta coraçõezinhos
const CORACAO = '<svg viewBox="0 0 40 36"><path d="M20 34C4 22 0 12 6 6s14-2 14 4c0-6 8-10 14-4s2 16-14 28Z" fill="#FF9EAA" stroke="#1C1612" stroke-width="3" stroke-linejoin="round"/></svg>';

function soltarCoracoes(x, y) {
  const r = palco.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const coracao = document.createElement("span");
    coracao.className = "coracao";
    coracao.innerHTML = CORACAO;
    coracao.style.left = `${x - r.left}px`;
    coracao.style.top = `${y - r.top}px`;
    coracao.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
    coracao.style.setProperty("--s", 0.7 + Math.random() * 0.7);
    coracao.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
    coracao.style.animationDelay = `${i * 70}ms`;
    coracao.addEventListener("animationend", () => coracao.remove());
    palco.appendChild(coracao);
  }
}

document.querySelectorAll(".pet").forEach((pet) => {
  pet.addEventListener("click", (e) => {
    pet.classList.remove("pulo");
    pet.getBoundingClientRect(); // reinicia a animação
    pet.classList.add("pulo", "contente");
    clearTimeout(pet.timer);
    pet.timer = setTimeout(() => pet.classList.remove("contente"), 1500);
    soltarCoracoes(e.clientX, e.clientY);
  });
});

// Copiar chave Pix
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
