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
    console.error(error);
    return;
  }

  if (!data || data.length === 0) return;

  const latestNews = document.getElementById("latestNews");

  latestNews.innerHTML = data.slice(0, 5).map((news, index) => `
    <article class="mini-card">

      <div class="mini-thumb">
        ${
          news.image_url
          ? `<img src="${news.image_url}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="">`
          : `<span>${index + 1}</span>`
        }
      </div>

      <div>
        <span>${news.category || "News"}</span>
        <h3>${news.title}</h3>
        <small>${new Date(news.created_at).toLocaleString()}</small>
      </div>

    </article>
  `).join("");

  const hero = document.querySelector(".hero-card");

  if (hero) {
    hero.innerHTML = `
      <div class="hero-image">
        ${
          data[0].image_url
          ? `<img src="${data[0].image_url}" style="width:100%;height:100%;object-fit:cover;" alt="">`
          : `<span>ONN TV</span>`
        }
      </div>

      <div class="hero-content">
        <span class="category">
          ${data[0].category || "TOP STORY"}
        </span>

        <h1>${data[0].title}</h1>

        <p>${data[0].excerpt || ""}</p>

        <a class="read-more" href="article.html?id=${data[0].id}">
          Read Full Story →
        </a>
      </div>
    `;
  }
}

loadNews();
