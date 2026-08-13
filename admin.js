const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginMessage = document.getElementById("loginMessage");

const newsForm = document.getElementById("newsForm");
const statusBox = document.getElementById("status");

const logoutBtn = document.getElementById("logoutBtn");
const adminNewsList = document.getElementById("adminNewsList");

const editingId = document.getElementById("editingId");
const publishButton = document.getElementById("publishButton");
const cancelEdit = document.getElementById("cancelEdit");
const refreshNews = document.getElementById("refreshNews");


/* =========================
   CHECK LOGIN
========================= */

async function checkLogin() {

  const { data, error } =
    await client.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  if (data.session) {
    showAdmin();
    loadAdminNews();
  }

}


/* =========================
   SHOW ADMIN
========================= */

function showAdmin() {

  loginBox.style.display = "none";

  adminPanel.style.display = "block";

}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();

    loginMessage.textContent =
      "Logging in...";

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const password =
      document
        .getElementById("password")
        .value;


    const { error } =
      await client.auth.signInWithPassword({

        email,
        password

      });


    if (error) {

      loginMessage.textContent =
        "Login failed: " +
        error.message;

      return;

    }


    loginMessage.textContent = "";

    showAdmin();

    loadAdminNews();

  }
);


/* =========================
   LOAD NEWS
========================= */

async function loadAdminNews() {

  adminNewsList.innerHTML = `
    <div class="loading">
      خبریں لوڈ ہو رہی ہیں...
    </div>
  `;


  const { data, error } =
    await client
      .from("news")
      .select("*")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(error);

    adminNewsList.innerHTML = `
      <div class="admin-message">
        خبریں لوڈ نہیں ہو سکیں۔
        <br>
        ${escapeHTML(error.message)}
      </div>
    `;

    return;

  }


  if (!data || data.length === 0) {

    adminNewsList.innerHTML = `
      <div class="admin-message">
        ابھی کوئی خبر موجود نہیں۔
      </div>
    `;

    return;

  }


  adminNewsList.innerHTML =
    data.map(news => {

      const image =
        news.image_url ||
        news.image ||
        "";

      const imageHTML =
        image
          ? `
            <img
              src="${escapeHTML(image)}"
              alt="${escapeHTML(news.title || "")}"
            >
          `
          : `
            <div class="admin-no-image">
              ONN TV
            </div>
          `;


      return `

        <div class="admin-news-card">

          <div class="admin-news-image">
            ${imageHTML}
          </div>


          <div class="admin-news-info">

            <span class="admin-news-category">
              ${escapeHTML(
                news.category || "NEWS"
              )}
            </span>


            <h3>
              ${escapeHTML(
                news.title || "Untitled"
              )}
            </h3>


            <p>
              ${escapeHTML(
                news.excerpt || ""
              ).substring(0, 150)}
            </p>


            <small>
              ${formatDate(news.created_at)}
            </small>


            <div class="admin-actions">

              <button
                class="edit-button"
                onclick="editNews('${escapeJS(news.id)}')">

                ✏️ Edit

              </button>


              <button
                class="delete-button"
                onclick="deleteNews('${escapeJS(news.id)}')">

                🗑️ Delete

              </button>

            </div>

          </div>

        </div>

      `;

    }).join("");

}


/* =========================
   EDIT NEWS
========================= */

async function editNews(id) {

  statusBox.textContent =
    "خبر لوڈ ہو رہی ہے...";


  const { data, error } =
    await client
      .from("news")
      .select("*")
      .eq("id", id)
      .single();


  if (error || !data) {

    statusBox.textContent =
      "خبر لوڈ نہیں ہو سکی۔";

    return;

  }


  editingId.value =
    data.id;


  document.getElementById("title").value =
    data.title || "";


  document.getElementById("category").value =
    data.category || "";


  document.getElementById("excerpt").value =
    data.excerpt || "";


  document.getElementById("content").value =
    data.content || data.body || "";


  document.getElementById("author").value =
    data.author || "ONN TV News Desk";


  publishButton.textContent =
    "💾 خبر Update کریں";


  cancelEdit.style.display =
    "block";


  statusBox.textContent =
    "خبر edit کرنے کے لیے تیار ہے۔";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   CANCEL EDIT
========================= */

cancelEdit.addEventListener(
  "click",
  function () {

    resetForm();

  }
);


/* =========================
   PUBLISH / UPDATE
========================= */

newsForm.addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();


    const id =
      editingId.value;


    const title =
      document
        .getElementById("title")
        .value
        .trim();


    const excerpt =
      document
        .getElementById("excerpt")
        .value
        .trim();


    const content =
      document
        .getElementById("content")
        .value
        .trim();


    const category =
      document
        .getElementById("category")
        .value;


    const author =
      document
        .getElementById("author")
        .value
        .trim();


    const imageFile =
      document
        .getElementById("image")
        .files[0];


    statusBox.textContent =
      id
        ? "خبر update ہو رہی ہے..."
        : "خبر شائع ہو رہی ہے...";


    let imageUrl = null;


    /* =========================
       IMAGE UPLOAD
    ========================= */

    if (imageFile) {

      const fileName =
        Date.now() +
        "-" +
        imageFile.name
          .replace(
            /[^a-zA-Z0-9.-]/g,
            "-"
          );


      const { error: uploadError } =
        await client.storage
          .from("news-images")
          .upload(
            fileName,
            imageFile
          );


      if (uploadError) {

        statusBox.textContent =
          "تصویر upload نہیں ہوئی: " +
          uploadError.message;

        return;

      }


      const { data: publicData } =
        client.storage
          .from("news-images")
          .getPublicUrl(
            fileName
          );


      imageUrl =
        publicData.publicUrl;

    }


    /* =========================
       UPDATE EXISTING NEWS
    ========================= */

    if (id) {

      const updateData = {

        title,
        excerpt,
        content,
        category,
        author

      };


      if (imageUrl) {

        updateData.image_url =
          imageUrl;

      }


      const { error } =
        await client
          .from("news")
          .update(updateData)
          .eq("id", id);


      if (error) {

        statusBox.textContent =
          "خبر update نہیں ہوئی: " +
          error.message;

        return;

      }


      statusBox.textContent =
        "✅ خبر کامیابی سے update ہو گئی!";


      resetForm();

      loadAdminNews();

      return;

    }


    /* =========================
       INSERT NEW NEWS
    ========================= */

    const { error } =
      await client
        .from("news")
        .insert({

          title,
          excerpt,
          content,
          image_url: imageUrl,
          category,
          author

        });


    if (error) {

      statusBox.textContent =
        "خبر publish نہیں ہوئی: " +
        error.message;

      return;

    }


    statusBox.textContent =
      "✅ خبر کامیابی سے شائع ہو گئی!";


    resetForm();

    loadAdminNews();

  }
);


/* =========================
   DELETE NEWS
========================= */

async function deleteNews(id) {

  const confirmed =
    confirm(
      "کیا آپ واقعی یہ خبر delete کرنا چاہتے ہیں؟"
    );


  if (!confirmed) {
    return;
  }


  statusBox.textContent =
    "خبر delete ہو رہی ہے...";


  const { error } =
    await client
      .from("news")
      .delete()
      .eq("id", id);


  if (error) {

    console.error(error);

    statusBox.textContent =
      "خبر delete نہیں ہوئی: " +
      error.message;

    return;

  }


  statusBox.textContent =
    "✅ خبر delete ہو گئی!";


  loadAdminNews();

}


/* =========================
   RESET FORM
========================= */

function resetForm() {

  newsForm.reset();

  editingId.value = "";

  document.getElementById("author").value =
    "ONN TV News Desk";


  publishButton.textContent =
    "📰 خبر شائع کریں";


  cancelEdit.style.display =
    "none";

}


/* =========================
   REFRESH
========================= */

refreshNews.addEventListener(
  "click",
  function () {

    loadAdminNews();

  }
);


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
  "click",
  async function () {

    await client.auth.signOut();

    window.location.reload();

  }
);


/* =========================
   DATE
========================= */

function formatDate(value) {

  if (!value) {
    return "";
  }


  const d =
    new Date(value);


  if (isNaN(d.getTime())) {
    return String(value);
  }


  return d.toLocaleString(
    "ur-PK",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

  return String(value ?? "")

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


function escapeJS(value) {

  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"');

}


/* =========================
   START
========================= */

checkLogin();
