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

// ---------- Quintal: os pets brincam sozinhos e o visitante pode interagir ----------
const quintal = document.getElementById("quintal");
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const semMouse = matchMedia("(hover: none)").matches;

if (semMouse) {
  document.getElementById("dica").querySelector("span").innerHTML =
    "<strong>Toque no quintal</strong> pra jogar a bolinha e <strong>toque neles</strong> pra fazer carinho.";
}

const cao = { el: document.getElementById("cao"), x: 0, dir: 1, estado: "sentado", timer: 1.2, prop: 216 / 268, largura: 0.4, margem: 0.4 };
const gato = { el: document.getElementById("gato"), x: 0, dir: -1, estado: "parado", timer: 2, prop: 176 / 218, largura: 0.31, margem: 0.6 };
const bola = { el: document.getElementById("bola"), sombra: document.getElementById("sombra-bola"), x: 0, y: 0, vx: 0, vy: 0, rot: 0, tam: 0.075, presa: false };
const novelo = { el: document.getElementById("novelo"), x: 0, y: 0, vx: 0, vy: 0, rot: 0, tam: 0.085 };

let L = 0, A = 0, chao = 0, gravidade = 0;

function medir() {
  L = quintal.clientWidth;
  A = quintal.clientHeight;
  chao = A * 0.88;
  gravidade = L * 2.6;
  for (const b of [cao, gato]) {
    b.w = L * b.largura;
    b.h = b.w / b.prop;
    b.el.style.width = `${b.w}px`;
  }
  for (const o of [bola, novelo]) {
    o.r = (L * o.tam) / 2;
    o.el.style.width = `${o.r * 2}px`;
  }
  bola.sombra.style.width = `${bola.r * 2}px`;
}

function posicoesIniciais() {
  cao.x = L * 0.3;
  gato.x = L * 0.74;
  bola.x = L * 0.5; bola.y = chao - bola.r;
  novelo.x = L * 0.62; novelo.y = chao - novelo.r;
}

medir();
posicoesIniciais();
new ResizeObserver(() => {
  const proporcao = L ? quintal.clientWidth / L : 1;
  medir();
  for (const o of [cao, gato, bola, novelo]) o.x *= proporcao;
}).observe(quintal);

const aleatorio = (min, max) => min + Math.random() * (max - min);
const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

function fisica(o, dt) {
  o.vy += gravidade * dt;
  o.x += o.vx * dt;
  o.y += o.vy * dt;
  if (o.y + o.r >= chao) {
    o.y = chao - o.r;
    o.vy = o.vy > L * 0.15 ? -o.vy * 0.5 : 0;
    o.vx *= Math.pow(0.3, dt);
  }
  if (o.x < o.r) { o.x = o.r; o.vx = Math.abs(o.vx) * 0.6; }
  if (o.x > L - o.r) { o.x = L - o.r; o.vx = -Math.abs(o.vx) * 0.6; }
  if (o.y < o.r) { o.y = o.r; o.vy = Math.abs(o.vy) * 0.3; }
  o.rot += ((o.vx * dt) / o.r) * 57.3;
}

const noChao = (o) => o.y + o.r >= chao - 1;

function andar(b, alvo, velocidade, dt) {
  alvo = limitar(alvo, b.w * b.margem, L - b.w * b.margem);
  const dx = alvo - b.x;
  if (Math.abs(dx) < 2) return true;
  b.dir = Math.sign(dx);
  b.x += b.dir * Math.min(Math.abs(dx), velocidade * L * dt);
  return Math.abs(alvo - b.x) < 2;
}

function chutar(o, forca) {
  const lado = o.x < L / 2 ? 1 : -1;
  o.vx = lado * L * aleatorio(0.4, 0.9) * forca;
  o.vy = -L * aleatorio(0.8, 1.2) * forca;
}

function atualizarCao(dt) {
  let andando = false;
  cao.timer -= dt;
  switch (cao.estado) {
    case "sentado":
      if (cao.timer <= 0 && !reduzMovimento) {
        if (bola.presa) { bola.presa = false; chutar(bola, 1); cao.estado = "olhando"; cao.timer = 0.5; }
        else cao.estado = "buscar";
      }
      break;
    case "olhando":
      if (cao.timer <= 0) cao.estado = "buscar";
      break;
    case "buscar":
      andando = !andar(cao, bola.x, 0.55, dt);
      if (Math.abs(bola.x - cao.x) < cao.w * 0.2 && bola.y > chao - cao.h * 0.4) {
        bola.presa = true;
        cao.estado = "trazer";
        cao.alvo = L * aleatorio(0.2, 0.55);
      }
      break;
    case "trazer":
      andando = !andar(cao, cao.alvo, 0.38, dt);
      if (!andando) { cao.estado = "sentado"; cao.timer = aleatorio(1, 2); }
      break;
    case "carinho":
      if (cao.timer <= 0) { cao.estado = "sentado"; cao.timer = 0.6; }
      break;
  }
  cao.andando = andando;
}

function atualizarGato(dt) {
  let andando = false;
  gato.timer -= dt;
  // se o cachorro chega correndo, o gato sai da frente (e aproveita pra ir até o novelo)
  const cachorroVindo = cao.andando && Math.abs(gato.x - cao.x) < (cao.w + gato.w) * 0.35;
  switch (gato.estado) {
    case "parado":
      if (cachorroVindo && !reduzMovimento) {
        if (Math.abs(novelo.x - cao.x) > cao.w) gato.estado = "brincar";
        else { gato.estado = "andar"; gato.alvo = cao.x < L / 2 ? L * 0.85 : L * 0.15; }
      } else if (gato.timer <= 0 && !reduzMovimento) {
        if (Math.random() < 0.6) gato.estado = "brincar";
        else { gato.estado = "andar"; gato.alvo = cao.x < L / 2 ? L * aleatorio(0.6, 0.88) : L * aleatorio(0.12, 0.4); }
      }
      break;
    case "andar":
      andando = !andar(gato, gato.alvo, 0.25, dt);
      if (!andando) { gato.estado = "parado"; gato.timer = aleatorio(1.5, 3.5); }
      break;
    case "brincar": {
      const lado = novelo.x > gato.x ? -1 : 1;
      andando = !andar(gato, novelo.x + lado * gato.w * 0.35, 0.3, dt);
      if (!andando && noChao(novelo)) {
        gato.dir = -lado;
        novelo.vx = -lado * L * aleatorio(0.3, 0.6);
        novelo.vy = -L * aleatorio(0.3, 0.6);
        gato.el.classList.remove("pulo");
        void gato.el.offsetWidth;
        gato.el.classList.add("pulo");
        gato.estado = "parado";
        gato.timer = aleatorio(2, 4);
      }
      break;
    }
    case "carinho":
      if (gato.timer <= 0) { gato.estado = "parado"; gato.timer = 1; }
      break;
  }
  gato.andando = andando;
}

// Olhos: seguem o mouse quando ele está por perto; senão, acompanham os brinquedos
let ponteiro = null, ultimoMovimento = 0;
window.addEventListener("pointermove", (e) => {
  ponteiro = { x: e.clientX, y: e.clientY };
  ultimoMovimento = performance.now();
}, { passive: true });

function olhar(bicho, alvoX, alvoY) {
  bicho.el.querySelectorAll(".pupila").forEach((pupila) => {
    const r = pupila.parentNode.getBoundingClientRect();
    const dx = alvoX - (r.left + r.width / 2);
    const dy = alvoY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(d / 100, 1) * 3.5;
    pupila.setAttribute("transform", `translate(${(dx / d) * k} ${(dy / d) * k})`);
  });
}

function desenhar() {
  const q = quintal.getBoundingClientRect();
  for (const b of [cao, gato]) {
    b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${chao - b.h}px, 0)`;
    b.el.style.setProperty("--dir", b.dir);
    b.el.classList.toggle("andando", b.andando);
  }
  if (bola.presa) {
    bola.x = cao.x;
    bola.y = chao - cao.h * 0.53;
  }
  bola.el.style.zIndex = bola.presa ? 5 : "";
  for (const o of [bola, novelo]) {
    o.el.style.transform = `translate3d(${o.x - o.r}px, ${o.y - o.r}px, 0) rotate(${o.rot}deg)`;
  }
  const altura = limitar((chao - bola.y - bola.r) / A, 0, 1);
  bola.sombra.style.transform = `translate3d(${bola.x - bola.r}px, ${chao - 4}px, 0) scale(${1 - altura * 0.7})`;
  bola.sombra.style.opacity = bola.presa ? 0 : 1;

  const mouseRecente = ponteiro && performance.now() - ultimoMovimento < 1500;
  if (mouseRecente) {
    olhar(cao, ponteiro.x, ponteiro.y);
    olhar(gato, ponteiro.x, ponteiro.y);
  } else {
    olhar(cao, q.left + bola.x, q.top + bola.y);
    const alvoGato = Math.abs(bola.vx) + Math.abs(bola.vy) > Math.abs(novelo.vx) + Math.abs(novelo.vy) ? bola : novelo;
    olhar(gato, q.left + alvoGato.x, q.top + alvoGato.y);
  }
}

let ultimo = performance.now();
let visivel = true;
function quadro(agora) {
  const dt = Math.min((agora - ultimo) / 1000, 0.033);
  ultimo = agora;
  if (visivel) {
    if (!bola.presa) fisica(bola, dt);
    fisica(novelo, dt);
    atualizarCao(dt);
    atualizarGato(dt);
    desenhar();
  }
  requestAnimationFrame(quadro);
}
requestAnimationFrame(quadro);
new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(quintal);

// Clique no quintal: joga a bolinha naquele ponto
quintal.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".bicho")) return;
  const q = quintal.getBoundingClientRect();
  const alvoX = limitar(e.clientX - q.left, bola.r, L - bola.r);
  const alvoY = limitar(e.clientY - q.top, bola.r, chao - bola.r);
  if (bola.presa) { bola.presa = false; bola.y = chao - cao.h * 0.53; }
  const t = 0.55;
  bola.vx = (alvoX - bola.x) / t;
  bola.vy = (alvoY - bola.y) / t - 0.5 * gravidade * t;
  cao.estado = "olhando";
  cao.timer = 0.25;
});

// Carinho: passar o mouse (ou tocar) em cima do pet
const CORACAO = '<svg viewBox="0 0 40 36"><path d="M20 34C4 22 0 12 6 6s14-2 14 4c0-6 8-10 14-4s2 16-14 28Z" fill="#FF9EAA" stroke="#1C1612" stroke-width="3" stroke-linejoin="round"/></svg>';

function soltarCoracoes(x, y, quantos) {
  const q = quintal.getBoundingClientRect();
  for (let i = 0; i < quantos; i++) {
    const c = document.createElement("span");
    c.className = "coracao";
    c.innerHTML = CORACAO;
    c.style.left = `${x - q.left}px`;
    c.style.top = `${y - q.top}px`;
    c.style.setProperty("--dx", `${aleatorio(-70, 70)}px`);
    c.style.setProperty("--s", aleatorio(0.7, 1.3));
    c.style.setProperty("--rot", `${aleatorio(-30, 30)}deg`);
    c.style.animationDelay = `${i * 70}ms`;
    c.addEventListener("animationend", () => c.remove());
    quintal.appendChild(c);
  }
}

function carinho(bicho, x, y, quantos) {
  if (bicho === cao && bola.presa) bicho.timer = Math.max(bicho.timer, 1.4);
  else { bicho.estado = "carinho"; bicho.timer = 1.4; }
  bicho.el.classList.add("contente");
  clearTimeout(bicho.fimCarinho);
  bicho.fimCarinho = setTimeout(() => bicho.el.classList.remove("contente"), 1400);
  soltarCoracoes(x, y, quantos);
}

for (const bicho of [cao, gato]) {
  let percorrido = 0, anterior = null, ultimoCoracao = 0;
  bicho.el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (anterior) percorrido += Math.hypot(e.clientX - anterior.x, e.clientY - anterior.y);
    anterior = { x: e.clientX, y: e.clientY };
    if (percorrido > 60 && performance.now() - ultimoCoracao > 350) {
      percorrido = 0;
      ultimoCoracao = performance.now();
      carinho(bicho, e.clientX, e.clientY, 2);
    }
  });
  bicho.el.addEventListener("pointerleave", () => { anterior = null; percorrido = 0; });
  bicho.el.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;
    carinho(bicho, e.clientX, e.clientY, 5);
  });
}

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
