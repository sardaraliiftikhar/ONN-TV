/* ==========================================
   ONN TV - LIVE SUPABASE NEWS
========================================== */

const onnSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* ==========================================
   HELPERS
========================================== */

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleOf(news) {
  return news.title || news.headline || news.name || "بغیر عنوان خبر";
}

function categoryOf(news) {
  return news.category || news.section || "تازہ خبر";
}

function imageOf(news) {
  return (
    news.image_url ||
    news.image ||
    news.imageUrl ||
    news.featured_image ||
    news.featured_image_url ||
    news.photo ||
    ""
  );
}

function excerptOf(news) {
  return (
    news.excerpt ||
    news.description ||
    news.summary ||
    ""
  );
}

function dateOf(news) {
  return news.created_at || news.published_at || news.date || "";
}

function formatDate(value) {
  if (!value) return "";

  const d = new Date(value);

  if (isNaN(d.getTime())) {
    return String(value);
  }

  return d.toLocaleDateString("ur-PK", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


/* ==========================================
   CARD
========================================== */

function newsCard(news) {

  const id = news.id;
  const title = titleOf(news);
  const category = categoryOf(news);
  const image = imageOf(news);
  const excerpt = excerptOf(news);

  return `
    <a
      href="article.html?id=${encodeURIComponent(id)}"
      class="news-card"
    >

      ${
        image
          ? `
            <img
              src="${esc(image)}"
              alt="${esc(title)}"
              loading="lazy"
            >
          `
          : `
            <div class="news-placeholder">
              ONN TV
            </div>
          `
      }

      <div class="news-card-content">

        <span class="news-label">
          ${esc(category)}
        </span>

        <h3>
          ${esc(title)}
        </h3>

        ${
          excerpt
            ? `
              <p>
                ${esc(String(excerpt).substring(0, 140))}
              </p>
            `
            : ""
        }

        <small>
          ${esc(formatDate(dateOf(news)))}
        </small>

      </div>

    </a>
  `;
}


/* ==========================================
   HERO
========================================== */

function showHero(news) {

  const hero = document.getElementById("hero");

  if (!hero || !news) return;

  const title = titleOf(news);
  const category = categoryOf(news);
  const image = imageOf(news);
  const excerpt = excerptOf(news);

  hero.innerHTML = `
    ${
      image
        ? `
          <img
            src="${esc(image)}"
            alt="${esc(title)}"
          >
        `
        : `
          <div class="hero-placeholder">
            ONN TV
          </div>
        `
    }

    <div class="hero-overlay">

      <span class="news-label">
        ${esc(category)}
      </span>

      <h1>
        ${esc(title)}
      </h1>

      ${
        excerpt
          ? `
            <p>
              ${esc(String(excerpt).substring(0, 220))}
            </p>
          `
          : ""
      }

      <span class="hero-read">
        مکمل خبر پڑھیں ←
      </span>

    </div>
  `;

  hero.onclick = () => {
    window.location.href =
      `article.html?id=${encodeURIComponent(news.id)}`;
  };
}


/* ==========================================
   SIDE NEWS
========================================== */

function showSideNews(news) {

  const box = document.getElementById("sideNews");

  if (!box) return;

  const items = news.slice(1, 4);

  box.innerHTML = items.map(item => {

    const title = titleOf(item);
    const category = categoryOf(item);
    const image = imageOf(item);

    return `
      <a
        href="article.html?id=${encodeURIComponent(item.id)}"
        class="side-news-card"
      >

        ${
          image
            ? `
              <img
                src="${esc(image)}"
                alt="${esc(title)}"
                loading="lazy"
              >
            `
            : `
              <div class="side-placeholder">
                ONN
              </div>
            `
        }

        <div>

          <span class="news-label">
            ${esc(category)}
          </span>

          <h3>
            ${esc(title)}
          </h3>

        </div>

      </a>
    `;

  }).join("");
}


/* ==========================================
   STORIES
========================================== */

function showStories(news) {

  const box =
    document.getElementById("storiesContainer");

  if (!box) return;

  const items = news.slice(0, 8);

  box.innerHTML = items.map(item => {

    const title = titleOf(item);
    const image = imageOf(item);

    return `
      <a
        href="article.html?id=${encodeURIComponent(item.id)}"
        class="story"
      >

        <div class="story-image">

          ${
            image
              ? `
                <img
                  src="${esc(image)}"
                  alt="${esc(title)}"
                  loading="lazy"
                >
              `
              : `
                <div class="story-placeholder">
                  ONN
                </div>
              `
          }

        </div>

        <h3>
          ${esc(title)}
        </h3>

      </a>
    `;

  }).join("");
}


/* ==========================================
   CATEGORY
========================================== */

function showCategory(id, news, words) {

  const box = document.getElementById(id);

  if (!box) return;

  const items = news.filter(item => {

    const category =
      categoryOf(item).toLowerCase();

    return words.some(word =>
      category.includes(word)
    );

  }).slice(0, 6);

  if (!items.length) {

    box.innerHTML = `
      <div class="loading">
        اس زمرے میں ابھی کوئی خبر موجود نہیں۔
      </div>
    `;

    return;
  }

  box.innerHTML =
    items.map(newsCard).join("");
}


/* ==========================================
   BREAKING
========================================== */

function showBreaking(news) {

  const box =
    document.getElementById("breakingText");

  if (!box || !news.length) return;

  box.textContent =
    titleOf(news[0]);
}


/* ==========================================
   ERROR
========================================== */

function showError(message) {

  const boxes = [
    "latestNews",
    "storiesContainer",
    "hero"
  ];

  boxes.forEach(id => {

    const box = document.getElementById(id);

    if (box) {

      box.innerHTML = `
        <div class="loading">

          <strong>
            ONN TV News Error
          </strong>

          <br><br>

          ${esc(message)}

        </div>
      `;
    }

  });
}


/* ==========================================
   LOAD NEWS
========================================== */

async function loadNews() {

  console.log("ONN TV: Loading news...");

  const latest =
    document.getElementById("latestNews");

  if (latest) {

    latest.innerHTML = `
      <div class="loading">
        خبریں لوڈ ہو رہی ہیں...
      </div>
    `;

  }


  try {

    const result =
      await onnSupabase
        .from("news")
        .select("*")
        .order("created_at", {
          ascending: false
        });


    const data = result.data;
    const error = result.error;


    console.log(
      "ONN TV Supabase result:",
      data,
      error
    );


    if (error) {

      console.error(
        "SUPABASE NEWS ERROR:",
        error
      );

      showError(
        error.message ||
        "Supabase سے خبریں حاصل نہیں ہو سکیں۔"
      );

      return;
    }


    if (!data || data.length === 0) {

      showError(
        "Supabase میں news table خالی ہے یا اس کی rows پڑھنے کی اجازت نہیں ہے۔"
      );

      return;
    }


    console.log(
      `ONN TV: ${data.length} news loaded`
    );


    /* HERO */

    showHero(data[0]);


    /* SIDE NEWS */

    showSideNews(data);


    /* STORIES */

    showStories(data);


    /* BREAKING */

    showBreaking(data);


    /* LATEST */

    if (latest) {

      latest.innerHTML =
        data
          .slice(0, 12)
          .map(newsCard)
          .join("");

    }


    /* PAKISTAN */

    showCategory(
      "pakistanNews",
      data,
      [
        "pakistan",
        "پاکستان",
        "national",
        "قومی"
      ]
    );


    /* WORLD */

    showCategory(
      "worldNews",
      data,
      [
        "world",
        "دنیا",
        "international",
        "عالمی"
      ]
    );


    /* SPORTS */

    showCategory(
      "sportsNews",
      data,
      [
        "sports",
        "sport",
        "کھیل",
        "کرکٹ",
        "cricket"
      ]
    );


    /* BUSINESS */

    showCategory(
      "businessNews",
      data,
      [
        "business",
        "کاروبار",
        "معیشت",
        "economy"
      ]
    );


    /* TECHNOLOGY */

    showCategory(
      "technologyNews",
      data,
      [
        "technology",
        "tech",
        "ٹیکنالوجی",
        "ٹیک"
      ]
    );

  }

  catch (error) {

    console.error(
      "ONN TV unexpected error:",
      error
    );

    showError(
      error.message ||
      "Unexpected error occurred."
    );

  }

}


/* ==========================================
   START
========================================== */

loadNews();
