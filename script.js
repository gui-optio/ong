// WhatsApp da APASCS (só números, com 55 + DDD)
const WHATSAPP = "5511968460029";

const linkWhats = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const simNao = (valor) => (valor ? "Sim" : "Não");

function foto(animal, classe) {
  if (animal.foto) {
    return `<img class="${classe}" src="${escapar(animal.foto)}" alt="Foto de ${escapar(animal.nome)}" loading="lazy">`;
  }
  const icone = animal.especie === "Gato" ? "🐱" : "🐶";
  return `<div class="${classe} ${classe}--vazia" role="img" aria-label="Foto de ${escapar(animal.nome)} em breve"><span>${icone}</span></div>`;
}

function cartao(animal, i) {
  const n = String(i + 1).padStart(3, "0");
  return `
    <article class="rg">
      <header class="rg__topo">
        <span>Registro Geral de Adoção</span>
        <span>Nº ${n}</span>
      </header>
      <div class="rg__corpo">
        ${foto(animal, "rg__foto")}
        <div class="rg__dados">
          <h3 class="rg__nome">${escapar(animal.nome)}</h3>
          <dl>
            <div><dt>Espécie</dt><dd>${escapar(animal.especie)}</dd></div>
            <div><dt>Sexo</dt><dd>${escapar(animal.sexo)}</dd></div>
            <div><dt>Idade</dt><dd>${escapar(animal.idade)}</dd></div>
            <div><dt>Porte</dt><dd>${escapar(animal.porte)}</dd></div>
            <div><dt>Castrado</dt><dd>${simNao(animal.castrado)}</dd></div>
            <div><dt>Vacinado</dt><dd>${simNao(animal.vacinado)}</dd></div>
          </dl>
        </div>
      </div>
      <p class="rg__jeito"><strong>Jeitinho:</strong> ${escapar(animal.jeito)}</p>
      <a class="botao rg__botao" href="${linkWhats(`Oi! Vi o(a) ${animal.nome} no site da APASCS e quero conhecer.`)}" target="_blank" rel="noopener">
        Quero conhecer ${escapar(animal.nome)}
      </a>
    </article>`;
}

const animais = window.ANIMAIS || [];

document.getElementById("lista-animais").innerHTML = animais.map(cartao).join("");

// Pilha de fotos do topo: os três primeiros animais
document.getElementById("pilha").innerHTML = animais
  .slice(0, 3)
  .map((a) => `<figure class="polaroid">${foto(a, "polaroid__foto")}<figcaption>${escapar(a.nome)}</figcaption></figure>`)
  .join("");

// Botões de WhatsApp com mensagem pronta
document.querySelectorAll("[data-whats]").forEach((el) => {
  el.href = linkWhats(el.dataset.whats);
  el.target = "_blank";
  el.rel = "noopener";
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
