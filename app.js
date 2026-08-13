// ONN TV starter JavaScript
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("mainNav");
const searchBtn = document.getElementById("searchBtn");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.position = "absolute";
    nav.style.top = "72px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#fff";
    nav.style.padding = "18px 4%";
    nav.style.flexDirection = "column";
    nav.style.alignItems = "flex-start";
    nav.style.borderBottom = "1px solid #e4e6ea";
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = prompt("Search ONN TV:");
    if (query) alert("Search system will be connected to Supabase in the next step.");
  });
}
