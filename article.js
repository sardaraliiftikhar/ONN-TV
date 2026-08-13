const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


async function loadArticle() {

  const articleBox =
    document.getElementById("article");


  const params =
    new URLSearchParams(
      window.location.search
    );


  const id =
    params.get("id");


  if (!id) {

    articleBox.innerHTML = `
      <div class="article-error">
        <h1>Story not found</h1>
        <p>No news article was selected.</p>
        <a href="index.html">
          Back to Home
        </a>
      </div>
    `;

    return;
  }


  const { data, error } =
    await supabaseClient
      .from("news")
      .select("*")
      .eq("id", id)
      .single();


  if (error || !data) {

    console.error(error);

    articleBox.innerHTML = `
      <div class="article-error">
        <h1>Story not found</h1>
        <p>
          This news article could not be loaded.
        </p>

        <a href="index.html">
          ← Back to Home
        </a>
      </div>
    `;

    return;
  }


  const imageHTML =
    data.image_url

      ? `
        <img
          src="${data.image_url}"
          alt="${escapeHTML(data.title)}"
        >
      `

      : "";


  articleBox.innerHTML = `

    <div class="article-category">
      ${escapeHTML(
        data.category || "NEWS"
      )}
    </div>


    <h1 class="article-title">
      ${escapeHTML(data.title)}
    </h1>


    <div class="article-date">
      ${formatDate(data.created_at)}
    </div>


    ${
      imageHTML

        ? `
          <div class="article-image">
            ${imageHTML}
          </div>
        `

        : ""
    }


    ${
      data.excerpt

        ? `
          <p class="article-excerpt">
            ${escapeHTML(data.excerpt)}
          </p>
        `

        : ""
    }


    <div class="article-content">

      ${formatContent(data.content || data.body || "")}

    </div>

  `;


  document.title =
    `${data.title} | ONN TV`;

}


function formatDate(date) {

  if (!date) return "";

  return new Date(date).toLocaleString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


function formatContent(text) {

  if (!text) {

    return `
      <p>
        No full story content is available.
      </p>
    `;

  }


  return String(text)
    .split(/\n+/)
    .filter(p => p.trim())
    .map(
      p => `<p>${escapeHTML(p)}</p>`
    )
    .join("");

}


function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


loadArticle();
