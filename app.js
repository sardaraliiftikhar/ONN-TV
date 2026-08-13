const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


async function loadNews() {

  const latestNews =
    document.getElementById("latestNews");


  const { data, error } =
    await supabaseClient

      .from("news")

      .select("*")

      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(error);

    latestNews.innerHTML = `
      <div class="loading">
        Unable to load news.
      </div>
    `;

    return;
  }


  if (!data || data.length === 0) {

    latestNews.innerHTML = `
      <div class="loading">
        No news available.
      </div>
    `;

    return;
  }


  /* =====================================
     LATEST NEWS
     ===================================== */


  latestNews.innerHTML =
    data.slice(0, 6).map(

      (news, index) => {


        const image =

          news.image_url

            ? `
              <img
                src="${news.image_url}"
                alt="${escapeHTML(news.title)}"
              >
            `

            : `
              <div class="number">
                ${String(index + 1).padStart(2, "0")}
              </div>
            `;


        return `

          <a
            class="news-card"
            href="article.html?id=${news.id}"
          >


            <div class="thumbnail">

              ${image}

            </div>


            <div class="news-info">


              <span class="news-category">

                ${escapeHTML(
                  news.category || "News"
                )}

              </span>


              <h3>

                ${escapeHTML(
                  news.title
                )}

              </h3>


              <small>

                ${formatDate(
                  news.created_at
                )}

              </small>


            </div>


          </a>

        `;

      }

    ).join("");


  /* =====================================
     HERO
     ===================================== */


  const top =
    data[0];


  const hero =
    document.getElementById("hero");


  if (!hero || !top) {
    return;
  }


  const heroImage =

    top.image_url

      ? `
        <img
          src="${top.image_url}"
          alt="${escapeHTML(top.title)}"
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

        ${escapeHTML(
          top.category || "TOP STORY"
        )}

      </div>


      <h1>

        ${escapeHTML(
          top.title
        )}

      </h1>


      <p>

        ${escapeHTML(
          top.excerpt || ""
        )}

      </p>


      <a
        class="read-button"
        href="article.html?id=${top.id}"
      >

        Read Full Story →

      </a>


    </div>

  `;

}


/* =====================================
   DATE
   ===================================== */


function formatDate(date) {

  return new Date(
    date
  ).toLocaleString();

}


/* =====================================
   SECURITY
   ===================================== */


function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


loadNews();
