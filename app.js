const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function loadNews() {
  const { data, error } = await supabaseClient
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  if (!data || data.length === 0) {
    return;
  }

  // =========================
  // LATEST NEWS
  // =========================

  const latestNews = document.getElementById("latestNews");

  if (latestNews) {
    latestNews.innerHTML = data.slice(0, 5).map((news, index) => {

      const thumbnail = news.image_url
        ? `<img src="${news.image_url}" alt="${escapeHtml(news.title)}">`
        : `<span>${String(index + 1).padStart(2, "0")}</span>`;

      return `
        <a href="article.html?id=${news.id}" class="mini-card">

          <div class="mini-thumb">
            ${thumbnail}
          </div>

          <div>
            <span>${escapeHtml(news.category || "News")}</span>

            <h3>
              ${escapeHtml(news.title)}
            </h3>

            <small>
              ${formatDate(news.created_at)}
            </small>
          </div>

        </a>
      `;
    }).join("");
  }


  // =========================
  // HERO / TOP STORY
  // =========================

  const hero = document.querySelector(".hero-card");

  if (hero && data[0]) {

    const news = data[0];

    const heroImage = news.image_url
      ? `<img src="${news.image_url}" alt="${escapeHtml(news.title)}">`
      : `<span>ONN TV</span>`;

    hero.innerHTML = `
      <div class="hero-image">
        ${heroImage}
      </div>

      <div class="hero-content">

        <span class="category">
          ${escapeHtml(news.category || "TOP STORY")}
        </span>

        <h1>
          ${escapeHtml(news.title)}
        </h1>

        <p>
          ${escapeHtml(news.excerpt || "")}
        </p>

        <a class="read-more" href="article.html?id=${news.id}">
          Read Full Story →
        </a>

      </div>
    `;
  }
}


// =========================
// DATE
// =========================

function formatDate(date) {
  return new Date(date).toLocaleString();
}


// =========================
// SECURITY
// =========================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


loadNews();
