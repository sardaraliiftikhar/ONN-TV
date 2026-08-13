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

async function checkLogin() {
  const { data } = await client.auth.getSession();

  if (data.session) {
    showAdmin();
  }
}

function showAdmin() {
  loginBox.style.display = "none";
  adminPanel.style.display = "block";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginMessage.textContent = "Logging in...";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = error.message;
    return;
  }

  loginMessage.textContent = "";
  showAdmin();
});


logoutBtn.addEventListener("click", async () => {
  await client.auth.signOut();
  location.reload();
});


newsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusBox.textContent = "Publishing news...";

  const title = document.getElementById("title").value;
  const excerpt = document.getElementById("excerpt").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").value;
  const author = document.getElementById("author").value;
  const imageFile = document.getElementById("image").files[0];

  let imageUrl = null;


  // Upload image
  if (imageFile) {

    const fileName =
      Date.now() + "-" +
      imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-");

    const { error: uploadError } =
      await client.storage
        .from("news-images")
        .upload(fileName, imageFile);

    if (uploadError) {
      statusBox.textContent =
        "Image upload error: " + uploadError.message;
      return;
    }


    const { data: publicData } =
      client.storage
        .from("news-images")
        .getPublicUrl(fileName);

    imageUrl = publicData.publicUrl;
  }


  // Save news
  const { error } = await client
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
      "News publish error: " + error.message;
    return;
  }


  statusBox.textContent =
    "✅ News published successfully!";

  newsForm.reset();

  document.getElementById("author").value =
    "ONN TV News Desk";
});


checkLogin();
