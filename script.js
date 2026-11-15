// Shob data products.js (SHOP, CATEGORIES) ar db.js (DB) theke ashe.

const $ = (id) => document.getElementById(id);
let selectedCat = null;
let selectedPkg = null;


// ---- Built-in icon (nijer aka, kono game er official logo na) ----
const ICONS = {
  ff: '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#ff7a1a"/><path d="M33 9c2 9 13 15 13 27a13 13 0 0 1-26 0c0-6 4-10 7-14 1 4 3 6 5 7 1-8-1-14 1-20z" fill="#fff"/><path d="M32 30c1 5 6 7 6 13a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3z" fill="#ff7a1a"/></svg>',
  pubg: '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#c9a24a"/><circle cx="32" cy="32" r="16" fill="none" stroke="#1d1a10" stroke-width="4"/><path d="M32 8v14M32 42v14M8 32h14M42 32h14" stroke="#1d1a10" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="32" r="3.5" fill="#1d1a10"/></svg>',
  diamond: '<svg viewBox="0 0 64 64"><path d="M17 9h30l13 15-28 33L4 24z" fill="#4cc3ff"/><path d="M17 9l-5 15h40l-5-15z" fill="#a8e6ff"/><path d="M12 24l20 33 20-33z" fill="#1f8ff0"/><path d="M12 24h40M25 24l7 33 7-33M17 9l8 15M47 9l-8 15" fill="none" stroke="#0b4f9a" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  uc: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#f2c14e"/><circle cx="32" cy="32" r="22" fill="none" stroke="#b9872a" stroke-width="3"/><text x="32" y="39" text-anchor="middle" font-size="20" font-weight="800" font-family="sans-serif" fill="#7a5410">UC</text></svg>',
  member: '<svg viewBox="0 0 64 64"><path d="M8 46l-2-26 14 12 12-20 12 20 14-12-2 26z" fill="#f2c14e"/><rect x="8" y="49" width="48" height="7" rx="3" fill="#b9872a"/></svg>',
  pass: '<svg viewBox="0 0 64 64"><path d="M6 18h52v10a5 5 0 0 0 0 8v10H6V36a5 5 0 0 0 0-8z" fill="#7a5cff"/><path d="M32 22l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L32 38.4l-6.5 3.5 1.3-7.2-5.3-5.1 7.3-1z" fill="#fff"/></svg>',
  like: '<svg viewBox="0 0 64 64"><path d="M32 56S6 40 6 22a13 13 0 0 1 26-4 13 13 0 0 1 26 4c0 18-26 34-26 34z" fill="#ff4d6d"/></svg>'
};

function makeIcon(imageUrl, kind, size) {
  const span = document.createElement("span");
  span.className = "icon " + (size || "icon-sm");
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "";
    img.loading = "lazy";
    span.appendChild(img);
  } else if (ICONS[kind]) {
    span.innerHTML = ICONS[kind];   // trusted, upore likha icon
  }
  return span;
}

// Hero te game icon
(function () {
  const box = $("heroGames");
  [["ff", "Free Fire"], ["pubg", "PUBG"], ["diamond", "Diamond"]].forEach(([k, label]) => {
    const item = document.createElement("span");
    item.className = "game-chip";
    item.append(makeIcon("", k, "icon-md"), document.createTextNode(label));
    box.appendChild(item);
  });
})();

// ---- Shop er naam, link ----
document.title = SHOP.name + " | Free Fire ও PUBG টপ-আপ";
$("brandName").textContent = SHOP.name;
$("footName").textContent = SHOP.name;
$("year").textContent = new Date().toLocaleDateString("bn-BD", { year: "numeric" });
$("waLink").href = "https://wa.me/" + SHOP.whatsapp;
$("tgLink").href = SHOP.telegram;
$("telegramLink").href = SHOP.telegram;
$("loginBtn").addEventListener("click", () => alert("লগইন সুবিধা পরে যোগ হবে।"));

// ---- Category ----
function renderCategories() {
  const box = $("categories");
  CATEGORIES.forEach(cat => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat";
    const label = document.createElement("span");
    label.textContent = cat.title;
    b.append(makeIcon(cat.image, cat.icon, "icon-lg"), label);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => selectCategory(cat, b));
    box.appendChild(b);
  });
}

function selectCategory(cat, btn) {
  selectedCat = cat;
  selectedPkg = null;
  document.querySelectorAll(".cat").forEach(c => c.setAttribute("aria-pressed", c === btn));
  $("panelTitle").textContent = cat.title;
  $("panelNote").textContent = cat.note || "";
  $("orderForm").hidden = true;

  const box = $("packages");
  box.textContent = "";
  cat.packages.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pkg";
    b.setAttribute("aria-pressed", "false");
    const n = document.createElement("strong");
    n.textContent = p.name;
    const pr = document.createElement("span");
    pr.textContent = "৳" + p.price;
    b.append(makeIcon(p.image, p.icon, "icon-md"), n, pr);
    b.addEventListener("click", () => selectPackage(p, b));
    box.appendChild(b);
  });
  $("packagePanel").hidden = false;
}

function selectPackage(pkg, btn) {
  selectedPkg = pkg;
  document.querySelectorAll(".pkg").forEach(c => c.setAttribute("aria-pressed", c === btn));
  $("summary").textContent = `${selectedCat.title}: ${pkg.name} — ৳${pkg.price}`;
  $("formMsg").textContent = "";
  $("orderForm").hidden = false;
  $("orderForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Payment ----
function renderPayments() {
  const sel = $("payMethod");
  Object.keys(SHOP.payNumbers).forEach(m => sel.add(new Option(m, m)));
  const hint = () => {
    const m = sel.value;
    $("payHint").textContent = `${m} (Send Money): ${SHOP.payNumbers[m]} নম্বরে টাকা পাঠিয়ে নিচে TrxID দিন।`;
  };
  sel.addEventListener("change", hint);
  hint();
}

// ---- Order submit ----
$("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("formMsg");
  const fields = [$("uid"), $("sender"), $("trx")];
  let ok = true;
  fields.forEach(f => {
    const good = f.value.trim() !== "";
    f.classList.toggle("invalid", !good);
    if (!good) ok = false;
  });
  if (!/^\d{6,15}$/.test($("uid").value.trim())) { $("uid").classList.add("invalid"); ok = false; }
  if (!/^01\d{9}$/.test($("sender").value.trim())) { $("sender").classList.add("invalid"); ok = false; }

  if (!selectedPkg) { msg.textContent = "আগে একটি প্যাকেজ বেছে নিন।"; msg.className = "form-msg error"; return; }
  if (!ok) { msg.textContent = "UID, নম্বর (01XXXXXXXXX) ও TrxID ঠিকভাবে দিন।"; msg.className = "form-msg error"; return; }

  try {
    const saved = await DB.saveOrder({
      category: selectedCat.title,
      package: selectedPkg.name,
      price: selectedPkg.price,
      uid: $("uid").value.trim(),
      payMethod: $("payMethod").value,
      sender: $("sender").value.trim(),
      trx: $("trx").value.trim()
    });
    msg.textContent = `অর্ডার জমা হয়েছে (${saved.id})। যাচাই শেষে ডেলিভারি দেওয়া হবে।`;
    msg.className = "form-msg ok";
    $("orderForm").reset();
    renderRecent();
  } catch (err) {
    msg.textContent = "অর্ডার জমা হয়নি। আবার চেষ্টা করুন।";
    msg.className = "form-msg error";
  }
});

// ---- Recent orders ----
async function renderRecent() {
  const list = $("recentList");
  list.textContent = "";
  const orders = await DB.getRecentOrders(8);
  if (!orders.length) {
    const li = document.createElement("li");
    li.textContent = "এখনো কোনো অর্ডার নেই।";
    list.appendChild(li);
    return;
  }
  orders.forEach(o => {
    const li = document.createElement("li");
    const left = document.createElement("span");
    // UID-r shesh 3 ghor dekhano hoy, pura UID na.
    left.textContent = `UID ****${String(o.uid).slice(-3)} · ${o.package} · ৳${o.price}`;
    const st = document.createElement("span");
    st.className = "status" + (o.status === "Done" ? " done" : "");
    st.textContent = o.status === "Done" ? "✓ সম্পন্ন" : "অপেক্ষমাণ";
    li.append(left, st);
    list.appendChild(li);
  });
}

renderCategories();
renderPayments();
renderRecent();
