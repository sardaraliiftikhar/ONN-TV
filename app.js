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

  console.log("ONN TV News:", data);

  if (!data || data.length === 0) return;

  const latestNews = document.getElementById("latestNews");

  latestNews.innerHTML = data.slice(0, 5).map((news, index) => `
    <article class="mini-card">
      <div class="mini-thumb">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <span>${news.category || "News"}</span>
        <h3>${news.title}</h3>
        <small>${new Date(news.created_at).toLocaleString()}</small>
      </div>
    </article>
  `).join("");
}

loadNews();
