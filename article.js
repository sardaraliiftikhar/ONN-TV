const articleClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const articleBox = document.getElementById("article");

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {

  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("ur-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatContent(text) {

  if (!text) {
    return `
      <p>
        اس خبر کی مکمل تفصیل دستیاب نہیں۔
      </p>
    `;
  }

  return String(text)
    .split(/\n+/)
    .filter(p => p.trim())
    .map(p => `
      <p>${escapeHTML(p)}</p>
    `)
    .join("");
}


async function loadArticle() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const id = params.get("id");

  if (!id) {

    articleBox.innerHTML = `
      <div class="article-error">

        <h1>
          خبر دستیاب نہیں
        </h1>

        <p>
          کوئی خبر منتخب نہیں کی گئی۔
        </p>

        <a href="index.html">
          ← ہوم پیج پر واپس جائیں
        </a>

      </div>
    `;

    return;
  }


  const { data, error } =
    await articleClient
      .from("news")
      .select("*")
      .eq("id", id)
      .single();


  if (error || !data) {

    console.error(
      "ARTICLE ERROR:",
      error
    );

    articleBox.innerHTML = `
      <div class="article-error">

        <h1>
          خبر نہیں مل سکی
        </h1>

        <p>
          یہ خبر اس وقت دستیاب نہیں ہے۔
        </p>

        <a href="index.html">
          ← ہوم پیج پر واپس جائیں
        </a>

      </div>
    `;

    return;
  }


  const title =
    data.title ||
    data.headline ||
    data.name ||
    "بغیر عنوان خبر";


  const category =
    data.category ||
    data.section ||
    "تازہ خبر";


  const image =
    data.image_url ||
    data.image ||
    data.featured_image ||
    data.featured_image_url ||
    "";


  const excerpt =
    data.excerpt ||
    data.description ||
    data.summary ||
    "";


  const content =
    data.content ||
    data.body ||
    "";


  articleBox.innerHTML = `

    <article class="article">

      <a
        href="index.html"
        class="back-button">

        ← ہوم پیج پر واپس جائیں

      </a>


      <div class="article-category">

        ${escapeHTML(category)}

      </div>


      <h1 class="article-title">

        ${escapeHTML(title)}

      </h1>


      <div class="article-date">

        ${formatDate(data.created_at)}

      </div>


      ${
        image
          ? `
            <div class="article-image">

              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
              >

            </div>
          `
          : ""
      }


      ${
        excerpt
          ? `
            <div class="article-excerpt">

              ${escapeHTML(excerpt)}

            </div>
          `
          : ""
      }


      <div class="article-content">

        ${formatContent(content)}

      </div>


      <div class="article-footer">

        ONN TV — آن لائن نیوز نیٹ ورک

      </div>


      <a
        href="index.html"
        class="back-button bottom">

        ← مزید خبریں دیکھیں

      </a>

    </article>

  `;


  document.title =
    `${title} | ONN TV`;
}


loadArticle();
