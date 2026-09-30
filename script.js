const works = [
  ["3982", "Nagô", "Precisão em cada desenho"],
  ["3983", "Box braids", "Textura e movimento"],
  ["3984", "French curl", "Cachos em tom acobreado"],
  ["3986", "Box braids", "Cor e personalidade"],
  ["3987", "French curl", "Comprimento e leveza"],
  ["3988", "Nagô", "Linhas que valorizam"],
  ["3989", "Entrelace", "Volume com identidade"],
  ["3990", "Ghana braids", "Detalhes marcantes"],
];

const grid = document.querySelector("#gallery-grid");
const dialog = document.querySelector("#lightbox");

let visible = works;
let current = 0;

/* Fotos WebP com carregamento iniciado ao abrir a página */
function render(filter = "Todos") {
  visible = works.filter((work) => filter === "Todos" || work[1] === filter);

  grid.innerHTML = visible
    .map(
      (work, index) => `
    <button
      type="button"
      class="gallery-item"
      data-index="${index}"
      aria-label="Ampliar ${work[1]}: ${work[2]}"
    >
      <div class="gallery-image">
        <img
          src="assets/resultado-${work[0]}.webp"
          alt="${work[1]} — ${work[2]}"
          loading="eager"
          decoding="async"
        >

        <span class="zoom" aria-hidden="true">
          <svg
            class="ui-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="6"/>
            <path d="M16 16l4 4M8 11h6M11 8v6"/>
          </svg>
        </span>
      </div>

      <div class="gallery-caption">
        ${work[1]}
        <span>${work[2]}</span>
      </div>
    </button>
  `,
    )
    .join("");

  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === filter;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

/* Imagem ampliada */
function show(index) {
  if (!visible.length) return;

  current = (index + visible.length) % visible.length;

  const work = visible[current];
  const image = dialog.querySelector("img");

  image.src = `assets/resultado-${work[0]}.webp`;
  image.alt = `${work[1]} — ${work[2]}`;

  dialog.querySelector("figcaption").textContent =
    `${work[1]} · ${current + 1} / ${visible.length}`;
}

function closeLightbox() {
  dialog.close();
}

/* Abrir foto */
grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");

  if (!button) return;

  show(Number(button.dataset.index));
  dialog.showModal();
});

/* Filtros da galeria */
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    render(button.dataset.filter);
  });
});

/* Seleção de especialidades */
document.querySelectorAll("[data-style]").forEach((link) => {
  link.addEventListener("click", () => {
    render(link.dataset.style);
  });
});

/* Controles da foto ampliada */
dialog.querySelector(".close").addEventListener("click", closeLightbox);

dialog.querySelector(".prev").addEventListener("click", () => {
  show(current - 1);
});

dialog.querySelector(".next").addEventListener("click", () => {
  show(current + 1);
});

/* Fechar clicando fora da foto */
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeLightbox();
  }
});

/* Navegação pelo teclado */
document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    show(current + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    show(current - 1);
  }
});

/* Deslizar entre fotos no celular */
let touchStart = null;

dialog.addEventListener(
  "touchstart",
  (event) => {
    touchStart = event.changedTouches[0].clientX;
  },
  { passive: true },
);

dialog.addEventListener(
  "touchend",
  (event) => {
    if (touchStart === null) return;

    const delta = event.changedTouches[0].clientX - touchStart;

    if (Math.abs(delta) > 60) {
      show(current + (delta < 0 ? 1 : -1));
    }

    touchStart = null;
  },
  { passive: true },
);

dialog.addEventListener(
  "touchcancel",
  () => {
    touchStart = null;
  },
  { passive: true },
);

/* Menu mobile */
const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir menu");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");

  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

/* Escolha de inspiração e mensagem para o WhatsApp */
const choiceButtons = document.querySelectorAll("[data-choice]");
const choiceText = document.querySelector("#choice-text");
const choiceLink = document.querySelector("#choice-link");

choiceButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    choiceButtons.forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    const style = button.dataset.choice;

    choiceText.textContent =
      `Sua inspiração: ${style}. ` + "Vamos descobrir as possibilidades?";

    const message =
      `Olá, Diana! Vi seu site e me interessei pelo estilo ${style}. ` +
      "Pode me orientar e informar valores e disponibilidade?";

    choiceLink.href =
      "https://wa.me/5527981900199?text=" + encodeURIComponent(message);
  });
});

/* Ano do rodapé */
document.querySelector("#year").textContent = new Date().getFullYear();

/* Inicia o carregamento de todas as fotos */
render();
