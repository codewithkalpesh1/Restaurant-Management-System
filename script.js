// Cozy Corner Restaurant - Main JavaScript
// Default Food Items

const seedFoods = [

    ["Khaman Dhokla", 450, "Breakfast", "img/khman.png"],
    ["Khakhra", 250, "Breakfast", "img/khakhra.png"],
    ["Aloo Paratha", 150, "Breakfast", "img/alau paratha.png"],
    ["Masala Dosa", 200, "Breakfast", "img/Dosa.jpg"],
    ["Poha", 100, "Breakfast", "img/poha.jpg"],
    ["Paneer Paratha", 180, "Breakfast", "img/paneer-paratha.jpg"],

    ["Rajma Chawal", 150, "Lunch", "img/Rajma-Chawal.jpg"],
    ["Matar Mushroom with Butter Naan", 200, "Lunch", "img/Matar-Mushroom-with-Butter-Naan.jpg"],
    ["Cheese Tomato", 180, "Lunch", "img/Cheese-Tomato.jpg"],
    ["Paneer Tikka Butter Masala", 250, "Lunch", "img/Paneer-Tikka-Butter-Masala.jpg"],
    ["Veg Biryani with Raita", 180, "Lunch", "img/Veg-Biryani-with-Rait.jpg"],

    ["Dal Tadka", 90, "Dinner", "img/Dal Tadka.jpg"],
    ["Chole Bhature", 100, "Dinner", "img/Chole Bhature.jpg"],
    ["Gobi Manchurian", 120, "Dinner", "img/Gobi Manchurian.jpg"],
    ["Pav Bhaji", 80, "Dinner", "img/Pav Bhaji.jpg"],

    ["Gulab Jamun", 50, "Dessert", "img/Gulab Jamun.jpg"],
    ["Rasgulla", 60, "Dessert", "img/Rasgulla.jpg"],
    ["Kheer", 70, "Dessert", "img/Kheer.jpg"],
    ["Jalebi", 40, "Dessert", "img/Jalebi.jpg"],

    ["Cold Coffee", 80, "Cold Drinks", "img/Cold Coffee.jpg"],
    ["Lemon Soda", 60, "Cold Drinks", "img/Lemon Soda.jpg"],
    ["Lassi", 70, "Cold Drinks", "img/Lassi.jpg"]

];

// Local Storage Functions

const read = (key, fallback = []) => {

    try {

        return JSON.parse(localStorage.getItem(key)) || fallback;

    } catch {

        return fallback;

    }

};


const save = (key, value) => {

    localStorage.setItem(key, JSON.stringify(value));

};

// Get Food Items

function getFoods() {

    let foods = read("cc_foods");

    if (!foods.length) {

        foods = seedFoods.map((f, i) => ({

            id: i + 1,

            name: f[0],

            price: f[1],

            category: f[2],

            image: f[3]

        }));

        save("cc_foods", foods);

    }

    return foods;

}

// Toast Notification

function toast(message) {

    const el = document.getElementById("toast");

    if (!el) return;

    el.textContent = message;

    el.classList.add("show");

    setTimeout(() => {

        el.classList.remove("show");

    }, 2800);

}

// HTML Safety Function

function esc(s) {

    return String(s ?? "").replace(/[&<>"']/g, c => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#39;"

    }[c]));

}

// Render Menu Items

function renderMenu(category = "Breakfast") {

    const grid = document.getElementById("menuGrid");

    if (!grid) return;

    const foods = getFoods().filter(f => f.category === category);


    grid.innerHTML = foods.length

        ? foods.map(f => `

            <article class="food-card">

                <img
                    src="${esc(f.image || "img/bg-img.png")}"
                    alt="${esc(f.name)}"
                    onerror="this.src='img/bg-img.png'"
                >

                <div class="food-info">

                    <h3>${esc(f.name)}</h3>

                    <strong>
                        ₹${Number(f.price).toFixed(2)}
                    </strong>

                </div>

            </article>

        `).join("")

        : '<p class="text-center">No menu items available in this category.</p>';

}

// DOM Content Loaded

document.addEventListener("DOMContentLoaded", () => {

// Menu Section

    if (document.getElementById("menuGrid")) {

        getFoods();

        renderMenu();


        // Get Categories

        let categories = read(
            "cc_categories",
            [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Dessert",
                "Cold Drinks"
            ]
        );


        // Render Menu Tabs

        document.getElementById("menuTabs").innerHTML =

            categories.map((c, i) => `

                <button
                    class="${i === 0 ? "active" : ""}"
                    data-category="${esc(c)}"
                >
                    ${esc(c)}
                </button>

            `).join("");


        // Menu Category Click Event

        document.getElementById("menuTabs").addEventListener("click", e => {

            const b = e.target.closest("button[data-category]");

            if (!b) return;


            // Remove Active Class

            document.querySelectorAll("#menuTabs button").forEach(x => {

                x.classList.remove("active");

            });


            // Add Active Class

            b.classList.add("active");


            // Render Selected Category

            renderMenu(b.dataset.category);

        });

    }

// Gallery Section

    const galleryGrid = document.getElementById("galleryGrid");

    if (galleryGrid) {

        let gallery = read("cc_gallery");


        // Default Gallery Images

        if (!gallery.length) {

            gallery = [

                {
                    src: "img/about1.jpg",
                    alt: "Restaurant dining"
                },

                {
                    src: "img/about2.jpg",
                    alt: "Fresh food"
                },

                {
                    src: "img/about3.jpg",
                    alt: "Restaurant interior"
                },

                {
                    src: "img/about4.jpg",
                    alt: "Food served"
                },

                {
                    src: "img/our restro .jpg",
                    alt: "Restaurant"
                },

                {
                    src: "img/reserve bg.jpg",
                    alt: "Dinner table"
                }

            ];

        }


        // Display Gallery

        galleryGrid.innerHTML = gallery.map(g => `

            <img
                src="${esc(g.src)}"
                alt="${esc(g.alt)}"
                onerror="this.src='img/bg-img.png'"
            >

        `).join("");

    }

// Mobile Navigation Toggle

    const toggle = document.getElementById("navToggle");

    if (toggle) {

        toggle.addEventListener("click", () => {

            document.getElementById("mainNav").classList.toggle("open");

        });

    }

// Reservation Date Validation

    const date = document.getElementById("reservationDate");

    if (date) {

        date.min = new Date().toISOString().split("T")[0];

    }

// Reservation Form

    const rf = document.getElementById("reservationForm");

    if (rf) {

        rf.addEventListener("submit", e => {

            e.preventDefault();


            // Validate Form

            if (!rf.reportValidity()) return;


            // Get Form Data

            const d = Object.fromEntries(new FormData(rf));


            // Get Existing Reservations

            let rows = read("cc_reservations");


            // Add New Reservation

            rows.unshift({

                ...d,

                id: Date.now(),

                status: "Pending"

            });


            // Save Reservation

            save("cc_reservations", rows);


            // Reset Form

            rf.reset();


            // Success Message

            toast(
                "Your table reservation has been submitted successfully!"
            );

        });

    }


// Contact Form
    const cf = document.getElementById("contactForm");

    if (cf) {

        cf.addEventListener("submit", e => {

            e.preventDefault();


            // Validate Form

            if (!cf.reportValidity()) return;


            // Get Existing Messages

            let msgs = read("cc_messages");


            // Add New Message

            msgs.unshift({

                ...Object.fromEntries(new FormData(cf)),

                id: Date.now(),

                date: new Date().toLocaleString()

            });


            // Save Message

            save("cc_messages", msgs);


            // Reset Form

            cf.reset();


            // Success Message

            toast("Thank you! Your message has been sent.");

        });

    }

});