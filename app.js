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

  if (!data || data.length === 0) return;

  const latestNews = document.getElementById("latestNews");

  latestNews.innerHTML = data.slice(0, 5).map((news, index) => `
    <article class="mini-card">
      <div class="mini-thumb">
        ${String(index + 1).padStart(2, "0")}
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
    </article>
  `).join("");

  updateHero(data[0]);
}


function updateHero(news) {
  const hero = document.querySelector(".hero-card");

  if (!hero || !news) return;

  const image = news.image_url
    ? `<img src="${news.image_url}" alt="${escapeHtml(news.title)}">`
    : `<span>ONN TV</span>`;

  hero.innerHTML = `
    <div class="hero-image">
      ${image}
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


function formatDate(date) {
  return new Date(date).toLocaleString();
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


loadNews();
