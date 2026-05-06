const imagePool = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
];

const baseListings = [
  {
    id: "np-1",
    title: "Ikea Study Table",
    category: "Furniture",
    condition: "Good",
    price: 2800,
    tower: "Tower B",
    seller: "Meera K.",
    posted: "Today",
    description: "Sturdy white study table with cable slot. Perfect for homework or work from home.",
    image: imagePool[0]
  },
  {
    id: "np-2",
    title: "Sony Wireless Headphones",
    category: "Electronics",
    condition: "Like new",
    price: 3200,
    tower: "Tower F",
    seller: "Rohan M.",
    posted: "Today",
    description: "Noise-cancelling headphones, barely used, includes original case and charging cable.",
    image: imagePool[1]
  },
  {
    id: "np-3",
    title: "Class 10 Reference Books",
    category: "Books",
    condition: "Good",
    price: 900,
    tower: "Tower C",
    seller: "Ananya S.",
    posted: "Yesterday",
    description: "Maths, science, and English guides with clean pages and useful notes.",
    image: imagePool[2]
  },
  {
    id: "np-4",
    title: "Kids Cycle 20 Inch",
    category: "Kids",
    condition: "Fair",
    price: 1800,
    tower: "Tower A",
    seller: "Dev P.",
    posted: "2 days ago",
    description: "Blue cycle for ages 7 to 10. Serviced recently, minor scratches on frame.",
    image: imagePool[3]
  },
  {
    id: "np-5",
    title: "Basketball Hoop Stand",
    category: "Sports",
    condition: "Good",
    price: 4200,
    tower: "Tower H",
    seller: "Kabir R.",
    posted: "3 days ago",
    description: "Adjustable height hoop, stable base, great for evening play near the court.",
    image: imagePool[4]
  },
  {
    id: "np-6",
    title: "Three-Seater Sofa",
    category: "Home",
    condition: "Good",
    price: 9500,
    tower: "Tower D",
    seller: "Priya N.",
    posted: "4 days ago",
    description: "Comfortable grey sofa, deep seats, buyer arranges pickup from lobby.",
    image: imagePool[5]
  },
  {
    id: "np-7",
    title: "MacBook Air M1",
    category: "Electronics",
    condition: "Like new",
    price: 48000,
    tower: "Tower G",
    seller: "Vikram A.",
    posted: "5 days ago",
    description: "8 GB RAM, 256 GB SSD, battery health 91 percent, with sleeve and charger.",
    image: imagePool[6]
  },
  {
    id: "np-8",
    title: "Weekend Guitar Lessons",
    category: "Services",
    condition: "Like new",
    price: 1500,
    tower: "Clubhouse",
    seller: "Nikhil J.",
    posted: "This week",
    description: "Beginner-friendly acoustic guitar lessons for kids, four sessions per month.",
    image: imagePool[7]
  }
];

const savedKey = "nandan-prospera-saved";
const customKey = "nandan-prospera-custom-listings";
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

let saved = new Set(JSON.parse(localStorage.getItem(savedKey) || "[]"));
let customListings = JSON.parse(localStorage.getItem(customKey) || "[]");

const listingGrid = document.querySelector("#listingGrid");
const resultsMeta = document.querySelector("#resultsMeta");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const conditionFilter = document.querySelector("#conditionFilter");
const sortFilter = document.querySelector("#sortFilter");
const listingForm = document.querySelector("#listingForm");
const formMessage = document.querySelector("#formMessage");
const contactDialog = document.querySelector("#contactDialog");
const dialogBody = document.querySelector("#dialogBody");

function allListings() {
  return [...customListings, ...baseListings];
}

function populateCategories() {
  const categories = [...new Set(baseListings.map((listing) => listing.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function formatPrice(price) {
  if (Number(price) === 0) return "Free";
  return rupees.format(price).replace("₹", "Rs ");
}

function listingMatches(listing) {
  const query = searchInput.value.trim().toLowerCase();
  const text = `${listing.title} ${listing.category} ${listing.description} ${listing.tower}`.toLowerCase();
  const categoryOk = categoryFilter.value === "All" || listing.category === categoryFilter.value;
  const conditionOk = conditionFilter.value === "All" || listing.condition === conditionFilter.value;
  return text.includes(query) && categoryOk && conditionOk;
}

function sortedListings(listings) {
  return [...listings].sort((a, b) => {
    if (sortFilter.value === "low") return a.price - b.price;
    if (sortFilter.value === "high") return b.price - a.price;
    return allListings().indexOf(a) - allListings().indexOf(b);
  });
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function renderListings() {
  const matches = sortedListings(allListings().filter(listingMatches));
  resultsMeta.textContent = `${matches.length} listing${matches.length === 1 ? "" : "s"} available`;
  listingGrid.innerHTML = "";

  if (!matches.length) {
    listingGrid.innerHTML = `
      <div class="empty-state">
        <strong>No listings match this search.</strong>
        <p>Try another category or list the item your neighbours may be looking for.</p>
      </div>
    `;
    return;
  }

  matches.forEach((listing) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.innerHTML = `
      <div class="listing-image">
        <img src="${listing.image}" alt="${listing.title}" loading="lazy">
        <button class="icon-button save-button ${saved.has(listing.id) ? "active" : ""}" data-save="${listing.id}" aria-label="Save ${listing.title}">
          ${icon("heart")}
        </button>
      </div>
      <div class="listing-body">
        <div class="listing-topline">
          <span class="category-pill">${listing.category}</span>
          <span class="price">${formatPrice(listing.price)}</span>
        </div>
        <h3>${listing.title}</h3>
        <p>${listing.description}</p>
        <div class="listing-meta">
          <span>${icon("map-pin")} ${listing.tower}</span>
          <span>${icon("badge-check")} ${listing.condition}</span>
          <span>${icon("clock")} ${listing.posted}</span>
        </div>
        <div class="card-actions">
          <button class="contact-button" data-contact="${listing.id}">Contact seller</button>
          <button class="icon-button" data-share="${listing.id}" aria-label="Copy listing details">${icon("share-2")}</button>
        </div>
      </div>
    `;
    listingGrid.append(card);
  });

  if (window.lucide) lucide.createIcons();
}

function saveSavedState() {
  localStorage.setItem(savedKey, JSON.stringify([...saved]));
}

function openContact(listing) {
  dialogBody.innerHTML = `
    <div class="dialog-card">
      <img src="${listing.image}" alt="${listing.title}">
      <h2>${listing.title}</h2>
      <p>${listing.description}</p>
      <p><strong>${formatPrice(listing.price)}</strong> by ${listing.seller}, ${listing.tower}</p>
      <div class="dialog-actions">
        <a class="primary-action" href="tel:+919876543210">${icon("phone")} Call seller</a>
        <a class="secondary-action" href="https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I saw your ${listing.title} on Nandan Prospera Buy & Sell.`)}">${icon("message-circle")} WhatsApp</a>
      </div>
    </div>
  `;
  contactDialog.showModal();
  if (window.lucide) lucide.createIcons();
}

async function copyListing(listing) {
  const text = `${listing.title} - ${formatPrice(listing.price)} at ${listing.tower}. Seller: ${listing.seller}.`;
  await navigator.clipboard.writeText(text);
  resultsMeta.textContent = "Listing details copied. Share it with a neighbour.";
}

listingGrid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  const contactButton = event.target.closest("[data-contact]");
  const shareButton = event.target.closest("[data-share]");
  const listings = allListings();

  if (saveButton) {
    const id = saveButton.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    saveSavedState();
    renderListings();
  }

  if (contactButton) {
    const listing = listings.find((item) => item.id === contactButton.dataset.contact);
    openContact(listing);
  }

  if (shareButton) {
    const listing = listings.find((item) => item.id === shareButton.dataset.share);
    copyListing(listing).catch(() => {
      resultsMeta.textContent = "Copy is unavailable in this browser.";
    });
  }
});

document.querySelector(".close-dialog").addEventListener("click", () => contactDialog.close());

[searchInput, categoryFilter, conditionFilter, sortFilter].forEach((control) => {
  control.addEventListener("input", renderListings);
});

listingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(listingForm);
  const listing = {
    id: `custom-${Date.now()}`,
    title: formData.get("title").trim(),
    category: formData.get("category"),
    condition: formData.get("condition"),
    price: Number(formData.get("price")),
    tower: formData.get("tower").trim(),
    seller: formData.get("seller").trim(),
    posted: "Just now",
    description: formData.get("description").trim(),
    image: imagePool[customListings.length % imagePool.length]
  };

  customListings = [listing, ...customListings];
  localStorage.setItem(customKey, JSON.stringify(customListings));
  listingForm.reset();
  formMessage.textContent = "Your demo listing is live at the top of the marketplace.";
  searchInput.value = "";
  categoryFilter.value = "All";
  conditionFilter.value = "All";
  sortFilter.value = "newest";
  renderListings();
  document.querySelector("#market").scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  renderListings();
  if (window.lucide) lucide.createIcons();
});
