/* ==========================================
   ONN TV - HOMEPAGE UI
========================================== */


/* ---------- DATE ---------- */

const dateElement =
  document.getElementById("currentDate");

if (dateElement) {

  const today = new Date();

  dateElement.textContent =
    today.toLocaleDateString(
      "ur-PK",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

}


/* ---------- MOBILE MENU ---------- */

const menuButton =
  document.getElementById("menuButton");

const navLinks =
  document.getElementById("navLinks");


if (menuButton && navLinks) {

  menuButton.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle("open");

    }
  );

}


/* ---------- CLOSE MOBILE MENU ---------- */

if (navLinks) {

  const links =
    navLinks.querySelectorAll("a");

  links.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navLinks.classList.remove("open");

      }
    );

  });

}


/* ---------- SMOOTH SCROLL ---------- */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(link => {

  link.addEventListener(
    "click",
    function (e) {

      const target =
        document.querySelector(
          this.getAttribute("href")
        );

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );

});


/* ---------- HEADER SHADOW ---------- */

window.addEventListener(
  "scroll",
  () => {

    const header =
      document.querySelector(".header");

    if (!header) return;

    if (window.scrollY > 20) {

      header.classList.add(
        "header-scrolled"
      );

    } else {

      header.classList.remove(
        "header-scrolled"
      );

    }

  }
);
