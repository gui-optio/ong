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
