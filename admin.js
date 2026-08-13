const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


const loginForm =
  document.getElementById("loginForm");

const loginBox =
  document.getElementById("loginBox");

const adminPanel =
  document.getElementById("adminPanel");

const loginMessage =
  document.getElementById("loginMessage");

const newsForm =
  document.getElementById("newsForm");

const statusBox =
  document.getElementById("status");

const logoutBtn =
  document.getElementById("logoutBtn");


/* =========================
   CHECK LOGIN
========================= */

async function checkLogin() {

  const { data } =
    await client.auth.getSession();

  if (data.session) {

    showAdmin();

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
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;


    const { error } =
      await client.auth.signInWithPassword({

        email,
        password

      });


    if (error) {

      loginMessage.textContent =
        "Login failed: " + error.message;

      return;

    }


    loginMessage.textContent = "";

    showAdmin();

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
   PUBLISH NEWS
========================= */

newsForm.addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();


    statusBox.textContent =
      "خبر شائع کی جا رہی ہے...";


    const title =
      document.getElementById("title").value.trim();


    const excerpt =
      document.getElementById("excerpt").value.trim();


    const content =
      document.getElementById("content").value.trim();


    const category =
      document.getElementById("category").value;


    const author =
      document.getElementById("author").value.trim();


    const imageFile =
      document.getElementById("image").files[0];


    let imageUrl = null;


    /* =========================
       IMAGE UPLOAD
    ========================= */

    if (imageFile) {

      const fileName =
        Date.now() +
        "-" +
        imageFile.name
          .replace(/[^a-zA-Z0-9.-]/g, "-");


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
          .getPublicUrl(fileName);


      imageUrl =
        publicData.publicUrl;

    }


    /* =========================
       SAVE NEWS
    ========================= */

    const { error } =
      await client
        .from("news")
        .insert({

          title: title,

          excerpt: excerpt,

          content: content,

          image_url: imageUrl,

          category: category,

          author: author

        });


    if (error) {

      statusBox.textContent =
        "خبر publish نہیں ہوئی: " +
        error.message;

      return;

    }


    /* =========================
       SUCCESS
    ========================= */

    statusBox.textContent =
      "✅ خبر کامیابی سے شائع ہو گئی!";


    newsForm.reset();


    document.getElementById("author").value =
      "ONN TV News Desk";

  }
);


/* =========================
   START
========================= */

checkLogin();
