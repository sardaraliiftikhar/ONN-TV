/* =========================================
   ONN TV — HOMEPAGE SCRIPT
========================================= */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");


/* =========================================
   MOBILE MENU
========================================= */

if (menuButton && navLinks) {

  menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

  });

}


/* =========================================
   DATE
========================================= */

const dateElement =
  document.getElementById("currentDate");

if (dateElement) {

  const today = new Date();

  dateElement.textContent =
    today.toLocaleDateString("ur-PK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

}


/* =========================================
   SUPABASE
========================================= */

const onnClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================
   HELPERS
========================================= */

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
    "اہم خبر"
  );

}


function getCategory(news) {

  return (
    news.category ||
    news.section ||
    "تازہ خبر"
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
      month: "long",
      day: "numeric"
    }
  );

}


/* =========================================
   LOAD ALL NEWS
========================================= */

async function loadONNNews() {

  try {

    const { data, error } =
      await onnClient
        .from("news")
        .select("*")
        .order("created_at", {
          ascending: false
        });


    if (error) {

      console.error(
        "ONN TV NEWS ERROR:",
        error
      );

      showEmptyNews();

      return;

    }


    if (!data || data.length === 0) {

      showEmptyNews();

      return;

    }


    /* HERO */

    createHero(data[0]);


    /* STORIES */

    createStories(
      data.slice(0, 5)
    );


    /* LATEST */

    createNewsGrid(
      "latestNews",
      data.slice(0, 8)
    );


    /* CATEGORIES */

    createCategory(
      "pakistanNews",
      data,
      "پاکستان"
    );


    createCategory(
      "worldNews",
      data,
      "دنیا"
    );


    createCategory(
      "sportsNews",
      data,
      "کھیل"
    );


    createCategory(
      "businessNews",
      data,
      "کاروبار"
    );


    createCategory(
      "technologyNews",
      data,
      "ٹیکنالوجی"
    );


    /* BREAKING */

    const breakingText =
      document.getElementById(
        "breakingText"
      );

    if (
      breakingText &&
      data[0]
    ) {

      breakingText.textContent =
        getTitle(data[0]);

    }

  }

  catch (error) {

    console.error(
      "ONN TV ERROR:",
      error
    );

    showEmptyNews();

  }

}


/* =========================================
   HERO
========================================= */

function createHero(news) {

  const hero =
    document.getElementById("hero");

  if (!hero || !news) return;


  const title =
    getTitle(news);

  const category =
    getCategory(news);

  const image =
    getImage(news);

  const excerpt =
    getExcerpt(news);


  hero.innerHTML = `

    <a
      href="article.html?id=${encodeURIComponent(news.id)}"
      class="hero-news-link"
    >

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
                excerpt.substring(0, 220)
              )}
            </p>
          `
          : ""
        }

      </div>

    </a>

  `;


  createSideNews();

}


/* =========================================
   SIDE NEWS
========================================= */

function createSideNews() {

  const side =
    document.getElementById(
      "sideNews"
    );

  if (!side) return;


  /* side news is populated separately */
  loadSideNews();

}


async function loadSideNews() {

  const side =
    document.getElementById(
      "sideNews"
    );

  if (!side) return;


  const { data } =
    await onnClient
      .from("news")
      .select("*")
      .order("created_at", {
        ascending: false
      })
      .range(1, 3);


  if (!data || data.length === 0) {

    side.innerHTML = "";

    return;

  }


  side.innerHTML =
    data.map(news => {

      const title =
        getTitle(news);

      const category =
        getCategory(news);

      const image =
        getImage(news);


      return `

        <a
          href="article.html?id=${encodeURIComponent(news.id)}"
          class="side-news-card"
        >

          ${
            image
            ? `
              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
              >
            `
            : ""
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


/* =========================================
   STORIES
========================================= */

function createStories(news) {

  const box =
    document.getElementById(
      "storiesContainer"
    );

  if (!box) return;


  box.innerHTML =
    news.map(item => {

      const title =
        getTitle(item);

      const image =
        getImage(item);


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
                  src="${escapeHTML(image)}"
                  alt="${escapeHTML(title)}"
                >
              `
              : `
                <div class="story-placeholder">
                  ONN TV
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


/* =========================================
   NEWS GRID
========================================= */

function createNewsGrid(
  elementId,
  news
) {

  const box =
    document.getElementById(
      elementId
    );

  if (!box) return;


  if (!news || news.length === 0) {

    box.innerHTML = `
      <div class="loading">
        ابھی اس سیکشن میں کوئی خبر موجود نہیں۔
      </div>
    `;

    return;

  }


  box.innerHTML =
    news.map(item => {

      const title =
        getTitle(item);

      const category =
        getCategory(item);

      const image =
        getImage(item);

      const excerpt =
        getExcerpt(item);


      return `

        <a
          href="article.html?id=${encodeURIComponent(item.id)}"
          class="news-card"
        >

          ${
            image
            ? `
              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
              >
            `
            : `
              <div class="news-card-placeholder">
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
                    excerpt.substring(0, 120)
                  )}
                </p>
              `
              : ""
            }

            <small>
              ${formatDate(
                item.created_at
              )}
            </small>

          </div>

        </a>

      `;

    }).join("");

}


/* =========================================
   CATEGORY
========================================= */

function createCategory(
  elementId,
  allNews,
  category
) {

  const filtered =
    allNews.filter(news => {

      return (
        String(
          news.category ||
          news.section ||
          ""
        ).trim() === category
      );

    });


  createNewsGrid(
    elementId,
    filtered.slice(0, 6)
  );

}


/* =========================================
   EMPTY NEWS
========================================= */

function showEmptyNews() {

  const ids = [
    "storiesContainer",
    "latestNews",
    "pakistanNews",
    "worldNews",
    "sportsNews",
    "businessNews",
    "technologyNews"
  ];


  ids.forEach(id => {

    const box =
      document.getElementById(id);

    if (box) {

      box.innerHTML = `
        <div class="loading">
          خبریں دستیاب نہیں ہیں۔
        </div>
      `;

    }

  });


  const hero =
    document.getElementById("hero");

  if (hero) {

    hero.innerHTML = `
      <div class="hero-placeholder">
        ONN TV
      </div>
    `;

  }

}


/* =========================================
   START
========================================= */

loadONNNews();
