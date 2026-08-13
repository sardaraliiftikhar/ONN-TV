/* ================================
   ONN TV - MAIN JAVASCRIPT
================================ */


/* ---------- DATE ---------- */

const dateElement = document.getElementById("currentDate");

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


/* ---------- MOBILE MENU ---------- */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("open");
    });

}


/* ---------- STORY DATA ---------- */

const stories = [

    {
        title: "پاکستان کی اہم ترین خبر",
        category: "پاکستان",
        image:
            "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1000&q=85",
        text:
            "پاکستان سے متعلق اہم ترین خبر اور تازہ صورتحال کی مکمل تفصیل یہاں ظاہر ہوگی۔ ONN TV اپنے ناظرین کو تازہ ترین معلومات فراہم کرتا ہے۔"
    },

    {
        title: "دنیا کی بڑی خبر سامنے آگئی",
        category: "دنیا",
        image:
            "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1000&q=85",
        text:
            "دنیا بھر سے آنے والی اہم خبر کی مکمل تفصیل یہاں ظاہر ہوگی۔ عالمی صورتحال پر تازہ ترین معلومات ONN TV پر دستیاب ہوں گی۔"
    },

    {
        title: "کھیلوں کی دنیا سے بڑی خبر",
        category: "کھیل",
        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=85",
        text:
            "کھیلوں کی دنیا سے تازہ ترین خبر، میچ اپ ڈیٹس اور اہم معلومات یہاں دکھائی جائیں گی۔"
    },

    {
        title: "تازہ ترین بریکنگ نیوز",
        category: "بریکنگ نیوز",
        image:
            "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=85",
        text:
            "یہ ONN TV کی بریکنگ نیوز ہے۔ خبر کی مکمل تفصیل یہاں دکھائی جائے گی۔"
    },

    {
        title: "کاروباری دنیا کی اہم اپ ڈیٹ",
        category: "کاروبار",
        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
        text:
            "کاروباری اور معاشی صورتحال کی تازہ ترین معلومات یہاں ظاہر ہوں گی۔"
    }

];


/* ---------- MODAL ELEMENTS ---------- */

const storyModal = document.getElementById("storyModal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");

const modalCategory = document.getElementById("modalCategory");

const modalText = document.getElementById("modalText");


/* ---------- OPEN STORY ---------- */

function openStory(index) {

    const story = stories[index];

    if (!story) {
        return;
    }

    modalImage.src = story.image;

    modalImage.alt = story.title;

    modalTitle.textContent = story.title;

    modalCategory.textContent = story.category;

    modalText.textContent = story.text;

    storyModal.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* ---------- CLOSE STORY ---------- */

function closeStory() {

    storyModal.classList.remove("active");

    document.body.style.overflow = "";

}


/* ---------- CLOSE ON BACKGROUND CLICK ---------- */

if (storyModal) {

    storyModal.addEventListener("click", function (event) {

        if (event.target === storyModal) {

            closeStory();

        }

    });

}


/* ---------- CLOSE WITH ESCAPE ---------- */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeStory();

    }

});


/* ---------- IMAGE ERROR HANDLING ---------- */

document.addEventListener(
    "error",
    function (event) {

        if (event.target.tagName === "IMG") {

            event.target.style.backgroundColor = "#eeeeee";

        }

    },
    true
);


/* ---------- NAVIGATION AUTO CLOSE ---------- */

if (navLinks) {

    const links = navLinks.querySelectorAll("a");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("open");

        });

    });

}


/* ---------- PAGE READY ---------- */

console.log("ONN TV website loaded successfully.");
