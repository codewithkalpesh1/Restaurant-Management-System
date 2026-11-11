const AKEY = {
    foods: "cc_foods",
    cats: "cc_categories",
    reservations: "cc_reservations",
    gallery: "cc_gallery",
    messages: "cc_messages"
};

const initialCats = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Cold Drinks"
];


// Local Storage Functions

const get = (k, def = []) => {
    try {
        return JSON.parse(localStorage.getItem(k)) ?? def;
    } catch {
        return def;
    }
};

const put = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v));
};


// HTML Safety Function

const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[c]));


// Category Functions

function cats() {
    let c = get(AKEY.cats, initialCats);

    if (!c.length) {
        c = initialCats;
    }

    put(AKEY.cats, c);

    return c;
}


// Food Functions

function foods() {
    let f = get(AKEY.foods);

    if (!f.length) {
        f = [
            ["Khaman Dhokla", 450, "Breakfast", "img/khman.png"],
            ["Khakhra", 250, "Breakfast", "img/khakhra.png"],
            ["Poha", 100, "Breakfast", "img/poha.jpg"],
            ["Rajma Chawal", 150, "Lunch", "img/Rajma-Chawal.jpg"],
            ["Paneer Tikka Butter Masala", 250, "Lunch", "img/Paneer-Tikka-Butter-Masala.jpg"],
            ["Dal Tadka", 90, "Dinner", "img/Dal Tadka.jpg"],
            ["Chole Bhature", 100, "Dinner", "img/Chole Bhature.jpg"],
            ["Gulab Jamun", 50, "Dessert", "img/Gulab Jamun.jpg"],
            ["Cold Coffee", 80, "Cold Drinks", "img/Cold Coffee.jpg"]
        ].map((x, i) => ({
            id: i + 1,
            name: x[0],
            price: x[1],
            category: x[2],
            image: x[3]
        }));

        put(AKEY.foods, f);
    }

    return f;
}


// Table Generator

function table(headers, rows) {
    if (!rows.length) {
        return '<div class="empty">No records found.</div>';
    }

    return `
        <div class="table-wrap">
            <table class="table table-hover">
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join("")}
                    </tr>
                </thead>

                <tbody>
                    ${rows.join("")}
                </tbody>
            </table>
        </div>
    `;
}


// Page Navigation

function showPage(page) {
    document.querySelectorAll(".admin-page").forEach(p => {
        p.classList.add("hidden");
    });

    document.getElementById("page-" + page)?.classList.remove("hidden");

    document.querySelectorAll(".side-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.page === page);
    });

    renderAll();
}


// Dashboard Statistics

function renderStats() {
    document.getElementById("statFoods").textContent = foods().length;
    document.getElementById("statCats").textContent = cats().length;
    document.getElementById("statReservations").textContent = get(AKEY.reservations).length;

    document.getElementById("statGallery").textContent = get(
        AKEY.gallery,
        [
            { src: "img/about1.jpg" },
            { src: "img/about2.jpg" },
            { src: "img/about3.jpg" },
            { src: "img/about4.jpg" }
        ]
    ).length;

    const recent = get(AKEY.reservations).slice(0, 5);

    document.getElementById("recentReservations").innerHTML = table(
        ["Customer", "Date", "Time", "Guests", "Status"],

        recent.map(r => `
            <tr>
                <td>${safe(r.firstName)} ${safe(r.lastName)}</td>
                <td>${safe(r.date)}</td>
                <td>${safe(r.time)}</td>
                <td>${safe(r.guests)}</td>
                <td>${safe(r.status || "Pending")}</td>
            </tr>
        `)
    );
}


// Render Food Items

function renderFoods() {
    const cat = cats();

    document.getElementById("foodCategory").innerHTML = cat.map(c => `
        <option>${safe(c)}</option>
    `).join("");

    document.getElementById("foodTable").innerHTML = table(
        ["Image", "Food", "Category", "Price", "Action"],

        foods().map(f => `
            <tr>
                <td>
                    <img
                        class="thumb"
                        src="${safe(f.image)}"
                        onerror="this.src='img/bg-img.png'"
                    >
                </td>

                <td>${safe(f.name)}</td>
                <td>${safe(f.category)}</td>
                <td>₹${Number(f.price).toFixed(2)}</td>

                <td>
                    <button class="action-btn edit" data-edit-food="${f.id}">
                        Edit
                    </button>

                    <button class="action-btn delete" data-delete-food="${f.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `)
    );
}


// Render Categories

function renderCats() {
    document.getElementById("categoryTable").innerHTML = table(
        ["Category", "Food Items", "Action"],

        cats().map(c => `
            <tr>
                <td>${safe(c)}</td>

                <td>
                    ${foods().filter(f => f.category === c).length}
                </td>

                <td>
                    <button class="action-btn delete" data-delete-cat="${safe(c)}">
                        Delete
                    </button>
                </td>
            </tr>
        `)
    );
}


// Render Reservations

function renderReservations() {
    document.getElementById("reservationTable").innerHTML = table(
        [
            "Customer",
            "Email",
            "Mobile",
            "Date",
            "Time",
            "Guests",
            "Status",
            "Action"
        ],

        get(AKEY.reservations).map(r => `
            <tr>
                <td>${safe(r.firstName)} ${safe(r.lastName)}</td>
                <td>${safe(r.email)}</td>
                <td>${safe(r.mobile)}</td>
                <td>${safe(r.date)}</td>
                <td>${safe(r.time)}</td>
                <td>${safe(r.guests)}</td>

                <td>
                    <span class="status ${r.status === "Confirmed" ? "confirmed" : ""}">
                        ${safe(r.status || "Pending")}
                    </span>
                </td>

                <td>
                    <button class="action-btn edit" data-status="${r.id}">
                        Confirm
                    </button>

                    <button class="action-btn delete" data-delete-res="${r.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `)
    );
}


// Gallery Functions

function gallery() {
    let g = get(AKEY.gallery);

    if (!g.length) {
        g = [
            { id: 1, src: "img/about1.jpg", alt: "Restaurant dining" },
            { id: 2, src: "img/about2.jpg", alt: "Fresh food" },
            { id: 3, src: "img/about3.jpg", alt: "Restaurant interior" },
            { id: 4, src: "img/about4.jpg", alt: "Food served" },
            { id: 5, src: "img/our restro .jpg", alt: "Restaurant" },
            { id: 6, src: "img/reserve bg.jpg", alt: "Dinner table" }
        ];
    }

    put(AKEY.gallery, g);

    return g;
}


// Render Gallery

function renderGallery() {
    document.getElementById("galleryTable").innerHTML = table(
        ["Image", "Path", "Description", "Action"],

        gallery().map(g => `
            <tr>
                <td>
                    <img class="thumb" src="${safe(g.src)}">
                </td>

                <td>${safe(g.src)}</td>
                <td>${safe(g.alt)}</td>

                <td>
                    <button class="action-btn delete" data-delete-gallery="${g.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `)
    );
}


// Render Contact Messages

function renderMessages() {
    document.getElementById("messageTable").innerHTML = table(
        ["Name", "Email", "Message", "Date"],

        get(AKEY.messages).map(m => `
            <tr>
                <td>${safe(m.firstName)} ${safe(m.lastName)}</td>
                <td>${safe(m.email)}</td>
                <td>${safe(m.message)}</td>
                <td>${safe(m.date)}</td>
            </tr>
        `)
    );
}


// Render All Dashboard Data

function renderAll() {
    renderStats();
    renderFoods();
    renderCats();
    renderReservations();
    renderGallery();
    renderMessages();
}


// DOM Content Loaded

document.addEventListener("DOMContentLoaded", () => {

    // Admin Login

    if (location.pathname.endsWith("admin-login.html")) {

        document.getElementById("loginForm").addEventListener("submit", e => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value;
            const error = document.getElementById("loginError");

            if (
                email === "admin@cozycorner.com" &&
                pass === "admin123"
            ) {
                sessionStorage.setItem("cc_admin", "yes");
                location.href = "admin-dashboard.html";
            } else {
                error.textContent = "Invalid email or password. Please try again.";
            }
        });

        return;
    }


    // Dashboard Authentication

    if (!document.getElementById("page-dashboard")) {
        return;
    }

    if (sessionStorage.getItem("cc_admin") !== "yes") {
        location.replace("admin-login.html");
        return;
    }


    // Initialize Dashboard

    foods();
    cats();
    gallery();
    renderAll();


    // Sidebar Navigation

    document.querySelectorAll(".side-btn").forEach(b => {
        b.addEventListener("click", () => {
            showPage(b.dataset.page);
        });
    });


    // Logout

    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("cc_admin");
        location.href = "admin-login.html";
    });


    // Add / Edit Food

    document.getElementById("foodForm").addEventListener("submit", e => {
        e.preventDefault();

        const id = Number(document.getElementById("foodId").value);
        let list = foods();

        const item = {
            id: id || Date.now(),
            name: document.getElementById("foodName").value.trim(),
            price: Number(document.getElementById("foodPrice").value),
            category: document.getElementById("foodCategory").value,
            image: document.getElementById("foodImage").value.trim()
        };

        if (!item.name || item.price <= 0 || !item.image) {
            alert("Please enter valid food details.");
            return;
        }

        if (id) {
            list = list.map(x => x.id === id ? item : x);
        } else {
            list.push(item);
        }

        put(AKEY.foods, list);

        e.target.reset();

        document.getElementById("foodId").value = "";

        document.getElementById("foodFormTitle").textContent = "Add Food Item";

        renderAll();

        alert("Food item saved successfully.");
    });


    // Clear Food Form

    document.getElementById("foodCancel").addEventListener("click", () => {
        document.getElementById("foodId").value = "";

        document.getElementById("foodFormTitle").textContent = "Add Food Item";
    });


    // Add Category

    document.getElementById("categoryForm").addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("categoryName").value.trim();

        if (cats().some(c => c.toLowerCase() === name.toLowerCase())) {
            alert("Category already exists.");
            return;
        }

        put(AKEY.cats, [...cats(), name]);

        e.target.reset();

        renderAll();
    });


    // Add Gallery Image

    document.getElementById("galleryForm").addEventListener("submit", e => {
        e.preventDefault();

        let g = gallery();

        g.push({
            id: Date.now(),
            src: document.getElementById("galleryImage").value.trim(),
            alt: document.getElementById("galleryAlt").value.trim()
        });

        put(AKEY.gallery, g);

        e.target.reset();

        renderAll();

        alert("Gallery image added.");
    });


    // Dashboard Action Buttons

    document.addEventListener("click", e => {

        const t = e.target;


        // Edit Food

        if (t.dataset.editFood) {
            const f = foods().find(x => x.id === Number(t.dataset.editFood));

            if (!f) return;

            document.getElementById("foodId").value = f.id;
            document.getElementById("foodName").value = f.name;
            document.getElementById("foodPrice").value = f.price;
            document.getElementById("foodCategory").value = f.category;
            document.getElementById("foodImage").value = f.image;

            document.getElementById("foodFormTitle").textContent = "Edit Food Item";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }


        // Delete Food

        if (t.dataset.deleteFood) {
            if (confirm("Delete this food item?")) {
                put(
                    AKEY.foods,
                    foods().filter(f => f.id !== Number(t.dataset.deleteFood))
                );

                renderAll();
            }
        }


        // Delete Category

        if (t.dataset.deleteCat) {
            const c = t.dataset.deleteCat;

            if (foods().some(f => f.category === c)) {
                alert("Move or delete food items in this category first.");
                return;
            }

            if (confirm("Delete category?")) {
                put(
                    AKEY.cats,
                    cats().filter(x => x !== c)
                );

                renderAll();
            }
        }


        // Confirm Reservation

        if (t.dataset.status) {
            let r = get(AKEY.reservations).map(x =>
                x.id === Number(t.dataset.status)
                    ? { ...x, status: "Confirmed" }
                    : x
            );

            put(AKEY.reservations, r);

            renderAll();
        }


        // Delete Reservation

        if (t.dataset.deleteRes) {
            if (confirm("Delete this reservation?")) {
                put(
                    AKEY.reservations,
                    get(AKEY.reservations).filter(
                        x => x.id !== Number(t.dataset.deleteRes)
                    )
                );

                renderAll();
            }
        }


        // Delete Gallery Image

        if (t.dataset.deleteGallery) {
            if (confirm("Remove this gallery image?")) {
                put(
                    AKEY.gallery,
                    gallery().filter(
                        x => x.id !== Number(t.dataset.deleteGallery)
                    )
                );

                renderAll();
            }
        }

    });

});
