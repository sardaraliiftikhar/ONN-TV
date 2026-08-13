const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function loadNews() {
  const box = document.getElementById("latestNews");

  if (!box) return;

  box.innerHTML = `<div class="loading">Loading news...</div>`;

  const { data, error } = await client
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("NEWS ERROR:", error);

    box.innerHTML = `
      <div class="loading">
        News could not be loaded.
      </div>
    `;

    return;
  }

  if (!data || data.length === 0) {
    box.innerHTML = `
      <div class="loading">
        No news available.
      </div>
    `;
    return;
  }

  /* =========================
     LATEST NEWS
     ========================= */

  box.innerHTML = data.slice(0, 8).map((news, index) => {

    const id = news.id;

    const title =
      news.title ||
      news.headline ||
      news.name ||
      "Untitled News";

    const category =
      news.category ||
      news.section ||
      "News";

    const image =
      news.image_url ||
      news.image ||
      news.imageUrl ||
      news.featured_image ||
      news.featured_image_url ||
      news.photo ||
      "";

    const date =
      news.created_at ||
      news.date ||
      news.published_at ||
      "";

    const imageHTML = image
      ? `
        <img
          src="${escapeHTML(image)}"
          alt="${escapeHTML(title)}"
          onerror="this.style.display='none';this.parentElement.innerHTML='<div class=number>${String(index + 1).padStart(2, "0")}</div>';"
        >
      `
      : `
        <div class="number">
          ${String(index + 1).padStart(2, "0")}
        </div>
      `;

    return `
      <a
        href="article.html?id=${encodeURIComponent(id)}"
        class="news-card"
      >

        <div class="thumbnail">
          ${imageHTML}
        </div>

        <div class="news-info">

          <span class="news-category">
            ${escapeHTML(category)}
          </span>

          <h3>
            ${escapeHTML(title)}
          </h3>

          <small>
            ${formatDate(date)}
          </small>

        </div>

      </a>
    `;

  }).join("");


  /* =========================
     HERO / TOP STORY
     ========================= */

  const top = data[0];

  const hero = document.getElementById("hero");

  if (!hero || !top) return;

  const title =
    top.title ||
    top.headline ||
    top.name ||
    "Latest News";

  const category =
    top.category ||
    top.section ||
    "TOP STORY";

  const image =
    top.image_url ||
    top.image ||
    top.imageUrl ||
    top.featured_image ||
    top.featured_image_url ||
    top.photo ||
    "";

  const excerpt =
    top.excerpt ||
    top.description ||
    top.summary ||
    top.content ||
    top.body ||
    "";

  const heroImage = image
    ? `
      <img
        src="${escapeHTML(image)}"
        alt="${escapeHTML(title)}"
      >
    `
    : `
      <div class="hero-placeholder">
        ONN TV
      </div>
    `;

  hero.innerHTML = `

    <div class="hero-image">
      ${heroImage}
    </div>

    <div class="hero-info">

      <div class="category">
        ${escapeHTML(category)}
      </div>

      <h1>
        ${escapeHTML(title)}
      </h1>

      <p>
        ${escapeHTML(
          String(excerpt).substring(0, 220)
        )}
      </p>

      <a
        href="article.html?id=${encodeURIComponent(top.id)}"
        class="read-button"
      >
        Read Full Story →
      </a>

    </div>

  `;
}


/* =========================
   ARTICLE DATE
   ========================= */

function formatDate(value) {

  if (!value) return "";

  const d = new Date(value);

  if (isNaN(d.getTime())) {
    return String(value);
  }

  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}


/* =========================
   SECURITY
   ========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


loadNews();
