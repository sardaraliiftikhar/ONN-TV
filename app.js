/* ==========================================
   ONN TV - DYNAMIC NEWS SYSTEM
   Supabase News Loader
========================================== */

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* ==========================================
   HELPERS
========================================== */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getTitle(news) {

  return (
    news.title ||
    news.headline ||
    news.name ||
    "Untitled News"
  );

}


function getCategory(news) {

  return (
    news.category ||
    news.section ||
    "News"
  );

}


function getImage(news) {

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


function getDate(news) {

  return (
    news.created_at ||
    news.date ||
    news.published_at ||
    ""
  );

}


function getExcerpt(news) {

  return (
    news.excerpt ||
    news.description ||
    news.summary ||
    ""
  );

}


function formatDate(value) {

  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    "ur-PK",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

}


/* ==========================================
   NEWS CARD
========================================== */

function createNewsCard(news) {

  const id = news.id;

  const title = getTitle(news);

  const category = getCategory(news);

  const image = getImage(news);

  const excerpt = getExcerpt(news);

  const date = getDate(news);


  return `

    <a
      href="article.html?id=${encodeURIComponent(id)}"
      class="news-card"
    >

      ${
        image

        ? `
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(title)}"
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
          ${escapeHTML(category)}
        </span>


        <h3>
          ${escapeHTML(title)}
        </h3>


        ${
          excerpt

          ? `
            <p>
              ${escapeHTML(
                String(excerpt).substring(0, 120)
              )}
            </p>
          `

          : ""
        }


        <small>
          ${escapeHTML(formatDate(date))}
        </small>

      </div>

    </a>

  `;

}


/* ==========================================
   HERO
========================================== */

function renderHero(news) {

  const hero = document.getElementById("hero");

  if (!hero || !news) return;


  const title = getTitle(news);

  const category = getCategory(news);

  const image = getImage(news);

  const excerpt = getExcerpt(news);


  hero.innerHTML = `

    ${
      image

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
      `
    }


    <div class="hero-overlay">

      <span class="news-label">
        ${escapeHTML(category)}
      </span>


      <h1>
        ${escapeHTML(title)}
      </h1>


      ${
        excerpt

        ? `
          <p>
            ${escapeHTML(
              String(excerpt).substring(0, 220)
            )}
          </p>
        `

        : ""
      }


      <span class="hero-read">
        مکمل خبر پڑھیں →
      </span>

    </div>

  `;


  hero.onclick = function () {

    window.location.href =
      `article.html?id=${encodeURIComponent(news.id)}`;

  };

}


/* ==========================================
   SIDE NEWS
========================================== */

function renderSideNews(news) {

  const box =
    document.getElementById("sideNews");

  if (!box) return;


  const items =
    news.slice(1, 4);


  if (!items.length) {

    box.innerHTML = "";

    return;

  }


  box.innerHTML =
    items.map((item) => {

      const title =
        getTitle(item);

      const category =
        getCategory(item);

      const image =
        getImage(item);


      return `

        <a
          href="article.html?id=${encodeURIComponent(item.id)}"
          class="side-news-card"
        >

          ${
            image

            ? `
              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
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
              ${escapeHTML(category)}
            </span>


            <h3>
              ${escapeHTML(title)}
            </h3>

          </div>

        </a>

      `;

    }).join("");

}


/* ==========================================
   STORIES
========================================== */

function renderStories(news) {

  const box =
    document.getElementById("storiesContainer");

  if (!box) return;


  const items =
    news.slice(0, 8);


  if (!items.length) {

    box.innerHTML =
      `<div class="loading">No stories available.</div>`;

    return;

  }


  box.innerHTML =
    items.map((item) => {

      const title =
        getTitle(item);

      const image =
        getImage(item);


      return `

        <a
          class="story"
          href="article.html?id=${encodeURIComponent(item.id)}"
        >

          <div class="story-image">

            ${
              image

              ? `
                <img
                  src="${escapeHTML(image)}"
                  alt="${escapeHTML(title)}"
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
            ${escapeHTML(title)}
          </h3>

        </a>

      `;

    }).join("");

}


/* ==========================================
   CATEGORY NEWS
========================================== */

function renderCategory(
  elementId,
  news,
  categories
) {

  const box =
    document.getElementById(elementId);

  if (!box) return;


  const filtered =
    news.filter((item) => {

      const category =
        getCategory(item).toLowerCase();

      return categories.some(
        c => category.includes(c)
      );

    }).slice(0, 6);


  if (!filtered.length) {

    box.innerHTML =
      `<div class="loading">
        اس category میں ابھی خبر موجود نہیں۔
      </div>`;

    return;

  }


  box.innerHTML =
    filtered
      .map(createNewsCard)
      .join("");

}


/* ==========================================
   BREAKING NEWS
========================================== */

function renderBreaking(news) {

  const box =
    document.getElementById("breakingText");

  if (!box || !news.length) return;


  const title =
    getTitle(news[0]);


  box.textContent =
    title;

}


/* ==========================================
   MAIN LOAD
========================================== */

async function loadNews() {

  const latestBox =
    document.getElementById("latestNews");


  if (latestBox) {

    latestBox.innerHTML =
      `<div class="loading">
        خبریں لوڈ ہو رہی ہیں...
      </div>`;

  }


  const {
    data,
    error
  } = await client

    .from("news")

    .select("*")

    .order(
      "created_at",
      {
        ascending: false
      }
    );


  if (error) {

    console.error(
      "ONN TV NEWS ERROR:",
      error
    );


    if (latestBox) {

      latestBox.innerHTML =
        `<div class="loading">
          News could not be loaded.
        </div>`;

    }

    return;

  }


  if (!data || data.length === 0) {

    if (latestBox) {

      latestBox.innerHTML =
        `<div class="loading">
          ابھی کوئی خبر موجود نہیں۔
        </div>`;

    }

    return;

  }


  /* HERO */

  renderHero(data[0]);


  /* SIDE */

  renderSideNews(data);


  /* STORIES */

  renderStories(data);


  /* BREAKING */

  renderBreaking(data);


  /* LATEST */

  if (latestBox) {

    latestBox.innerHTML =
      data
        .slice(0, 8)
        .map(createNewsCard)
        .join("");

  }


  /* CATEGORIES */

  renderCategory(
    "pakistanNews",
    data,
    [
      "pakistan",
      "پاکستان",
      "national",
      "قومی"
    ]
  );


  renderCategory(
    "worldNews",
    data,
    [
      "world",
      "دنیا",
      "international",
      "عالمی"
    ]
  );


  renderCategory(
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


  renderCategory(
    "businessNews",
    data,
    [
      "business",
      "businesses",
      "کاروبار",
      "معیشت",
      "economy"
    ]
  );


  renderCategory(
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


/* ==========================================
   START
========================================== */

loadNews();
