const sectors = [
  { name: "Healthcare", productIds: ["medistock", "sanjeevi-hospitals", "physiotherapy", "ss-dental"] },
  { name: "Retail & Services", productIds: ["motostock", "glamora", "dc-radiants"] },
  { name: "Education, Hospitality & Spiritual", productIds: ["dc-college", "lumina", "sri-parasakthi-peetam"] },
  {
    name: "Construction, Real Estate & Interiors",
    productIds: ["dc-realestate", "ganesh-constructions", "sri-venkateswara-constructions", "dc-interiors"],
  },
  { name: "Trade & Logistics", productIds: ["dc-imports-exports"] },
];

const caseSections = Array.from(document.querySelectorAll(".case-study"));

function textFrom(element) {
  return element ? element.textContent.replace(/\s+/g, " ").trim() : "";
}

function getCards(section, headingText) {
  const orderedSection = Array.from(section.querySelectorAll(".ordered-section")).find(
    (item) => textFrom(item.querySelector("h3")).toLowerCase() === headingText.toLowerCase()
  );

  if (!orderedSection) return [];

  return Array.from(orderedSection.querySelectorAll(".info-card")).map((card) => ({
    title: textFrom(card.querySelector("h4")),
    text: textFrom(card.querySelector("p")),
  }));
}

function getScreens(section) {
  const orderedSection = Array.from(section.querySelectorAll(".ordered-section")).find(
    (item) => textFrom(item.querySelector("h3")).toLowerCase() === "screens"
  );

  if (!orderedSection) return [];

  return Array.from(orderedSection.querySelectorAll(".featured-screen, .screen-card, .landscape-card"))
    .map((card, index) => {
      const image = card.querySelector("img");

      return {
        number: `Screen ${String(index + 1).padStart(2, "0")}`,
        title: textFrom(card.querySelector("h4")),
        description: textFrom(card.querySelector("p")),
        image: image ? image.getAttribute("src") : "",
        alt: image ? image.getAttribute("alt") : "",
      };
    })
    .filter((screen) => screen.image);
}

function getProducts() {
  return caseSections.map((section) => {
    const hero = section.querySelector(".case-hero");
    const icon = hero ? hero.querySelector("img") : section.querySelector("img");

    return {
      id: section.id,
      name: textFrom(hero ? hero.querySelector(".eyebrow") : section.querySelector(".eyebrow")),
      tagline: textFrom(hero ? hero.querySelector("h2") : section.querySelector("h2")),
      icon: icon ? icon.getAttribute("src") : "",
      iconAlt: icon ? icon.getAttribute("alt") : "",
      problems: getCards(section, "Problem Statements"),
      solutions: getCards(section, "Solutions"),
      screens: getScreens(section),
    };
  });
}

const products = getProducts();
const productMap = new Map(products.map((product) => [product.id, product]));

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function productUrl(product) {
  return `/products/${product.id}`;
}

function getCurrentProductId() {
  const pathMatch = window.location.pathname.match(/\/products\/([^/]+)\/?$/);
  if (pathMatch) return pathMatch[1];
  if (window.location.hash) return window.location.hash.slice(1);
  return "";
}

function renderDirectory() {
  return `
    <section class="directory section" aria-labelledby="directory-title">
      <div class="directory-heading reveal">
        <p class="eyebrow">Product Directory</p>
        <h1 id="directory-title">Our Products</h1>
      </div>
      <div class="sector-stack">
        ${sectors
          .map((sector) => {
            const sectorProducts = sector.productIds.map((id) => productMap.get(id)).filter(Boolean);
            const sectorId = sector.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            return `
              <section class="sector reveal" aria-labelledby="${sectorId}">
                <h2 id="${sectorId}">${escapeHtml(sector.name)}</h2>
                <div class="product-grid">
                  ${sectorProducts
                    .map(
                      (product) => `
                        <article class="product-card">
                          <img src="${escapeHtml(product.icon)}" alt="${escapeHtml(
                        product.iconAlt || `${product.name} product icon`
                      )}" />
                          <h3>${escapeHtml(product.name)}</h3>
                          <a class="view-link" href="${productUrl(product)}" data-route="${product.id}">
                            View Product <span aria-hidden="true">-&gt;</span>
                          </a>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </section>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderCards(items) {
  return `
    <div class="functionality-grid">
      ${items
        .map(
          (item, index) => `
            <article class="functionality-card">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h4>${escapeHtml(item.title)}</h4>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderScreens(product) {
  return `
    <section class="product-section screens-section reveal" aria-labelledby="screens-title">
      <p class="eyebrow">Screens</p>
      <h2 id="screens-title">Screens</h2>
      <div class="screen-stack">
        ${product.screens
          .map(
            (screen, index) => `
              <article class="screen-showcase ${index % 2 ? "is-reversed" : ""}">
                <div class="screen-media">
                  <img src="${escapeHtml(screen.image)}" alt="${escapeHtml(screen.alt)}" />
                </div>
                <div class="screen-content">
                  <span>${escapeHtml(screen.number)}</span>
                  <h3>${escapeHtml(screen.title)}</h3>
                  <p>${escapeHtml(screen.description)}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderProduct(product) {
  return `
    <article class="product-detail section">
      <a class="back-link reveal" href="/" data-home>&lt;- Back to Products</a>
      <header class="product-header reveal">
        <img src="${escapeHtml(product.icon)}" alt="${escapeHtml(product.iconAlt || `${product.name} product icon`)}" />
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(product.tagline)}</p>
      </header>
      <section class="product-section reveal" aria-labelledby="functionality-title">
        <p class="eyebrow">Complete Functionality</p>
        <h2 id="functionality-title">Complete Functionality</h2>
        <div class="functionality-group">
          <h3>Problem Statements</h3>
          ${renderCards(product.problems)}
        </div>
        <div class="functionality-group">
          <h3>Solutions</h3>
          ${renderCards(product.solutions)}
        </div>
      </section>
      ${renderScreens(product)}
    </article>
  `;
}

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function render() {
  const productId = getCurrentProductId();
  const product = productMap.get(productId);
  const existingApp = document.querySelector("#app");

  document.body.classList.toggle("product-route", Boolean(product));
  document.querySelector(".site-header")?.remove();
  if (existingApp) existingApp.remove();

  const app = document.createElement("main");
  app.id = "app";
  app.innerHTML = product ? renderProduct(product) : renderDirectory();
  document.body.prepend(app);

  caseSections.forEach((section) => section.setAttribute("hidden", ""));
  document.querySelector(".poc-home")?.setAttribute("hidden", "");
  observeReveals();
  window.scrollTo({ top: 0, left: 0 });
}

document.addEventListener("click", (event) => {
  const productLink = event.target.closest("[data-route]");
  const homeLink = event.target.closest("[data-home]");

  if (productLink) {
    event.preventDefault();
    const product = productMap.get(productLink.dataset.route);
    if (!product) return;
    window.history.pushState({}, "", productUrl(product));
    render();
  }

  if (homeLink) {
    event.preventDefault();
    window.history.pushState({}, "", "/");
    render();
  }
});

window.addEventListener("popstate", render);
render();
