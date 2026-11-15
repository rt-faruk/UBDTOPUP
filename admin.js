// Admin panel: login, order list, "Done"/"Cancel" kora. Database er kaj db.js e.

const $ = (id) => document.getElementById(id);
const LABEL = { Pending: "অপেক্ষমাণ", Done: "সম্পন্ন", Cancelled: "বাতিল" };
let all = [];
let filter = "Pending";

function show(el, on) { el.hidden = !on; }

if (DB.mode !== "firebase") {
  $("notice").textContent = "Firebase সেটআপ নেই (firebase-config.js ফাঁকা), তাই অ্যাডমিন প্যানেল চলবে না।";
  show($("notice"), true);
} else {
  DB.onAuthChange((user) => {
    show($("loginForm"), !user);
    show($("dashboard"), !!user);
    show($("logoutBtn"), !!user);
    if (user) loadOrders();
  });
}

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("loginMsg");
  msg.className = "form-msg";
  msg.textContent = "";
  try {
    await DB.login($("email").value.trim(), $("password").value);
    $("password").value = "";
  } catch (err) {
    msg.textContent = "ইমেইল বা পাসওয়ার্ড ভুল।";
    msg.className = "form-msg error";
  }
});

$("logoutBtn").addEventListener("click", () => DB.logout());
$("reloadBtn").addEventListener("click", loadOrders);

$("tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-f]");
  if (!b) return;
  filter = b.dataset.f;
  document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});

async function loadOrders() {
  const msg = $("listMsg");
  msg.className = "form-msg";
  msg.textContent = "লোড হচ্ছে...";
  try {
    all = await DB.getAllOrders(200);
    msg.textContent = "";
    render();
  } catch (err) {
    msg.textContent = "অর্ডার লোড হয়নি। এই অ্যাকাউন্টের UID firestore.rules এ বসানো আছে কি না দেখুন।";
    msg.className = "form-msg error";
  }
}

function render() {
  ["Pending", "Done", "Cancelled"].forEach(s => { $("c" + s).textContent = all.filter(o => o.status === s).length; });
  $("cAll").textContent = all.length;

  const list = $("orders");
  list.textContent = "";
  const rows = filter === "All" ? all : all.filter(o => o.status === filter);
  if (!rows.length) {
    const li = document.createElement("li");
    li.className = "order";
    li.textContent = "কোনো অর্ডার নেই।";
    list.appendChild(li);
    return;
  }
  rows.forEach(o => list.appendChild(card(o)));
}

function field(label, value, copyable) {
  const d = document.createElement("div");
  d.className = "field";
  const s = document.createElement("small");
  s.textContent = label;
  const c = document.createElement("code");
  c.textContent = value;
  d.append(s, c);
  if (copyable) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "copy";
    b.textContent = "কপি";
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(value); b.textContent = "✓"; }
      catch { b.textContent = "✗"; }
      setTimeout(() => (b.textContent = "কপি"), 1200);
    });
    d.appendChild(b);
  }
  return d;
}

function card(o) {
  const li = document.createElement("li");
  li.className = "order";

  const top = document.createElement("div");
  top.className = "order-top";
  const title = document.createElement("strong");
  title.textContent = `${o.package} — ৳${o.price}`;
  const badge = document.createElement("span");
  badge.className = "badge " + o.status;
  badge.textContent = LABEL[o.status] || o.status;
  top.append(title, badge);

  const f = document.createElement("div");
  f.className = "fields";
  f.append(
    field("গেম", o.category),
    field("UID", o.uid, true),
    field("পেমেন্ট", `${o.payMethod}`),
    field("প্রেরকের নম্বর", o.sender, true),
    field("TrxID", o.trx, true),
    field("সময়", o.createdAt ? o.createdAt.toLocaleString("bn-BD") : "-"),
    field("অর্ডার আইডি", o.id.slice(0, 8).toUpperCase())
  );

  const act = document.createElement("div");
  act.className = "actions";
  const make = (text, cls, status) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn small " + cls;
    b.textContent = text;
    b.addEventListener("click", () => setStatus(o, status, act));
    return b;
  };
  if (o.status !== "Done") act.appendChild(make("সম্পন্ন করুন", "ok", "Done"));
  if (o.status !== "Cancelled") act.appendChild(make("বাতিল", "bad", "Cancelled"));
  if (o.status !== "Pending") act.appendChild(make("অপেক্ষমাণে ফেরান", "ghost", "Pending"));

  li.append(top, f, act);
  return li;
}

async function setStatus(order, status, box) {
  box.querySelectorAll("button").forEach(b => (b.disabled = true));
  try {
    await DB.updateOrderStatus(order.id, status);
    order.status = status;
    render();
  } catch (err) {
    $("listMsg").textContent = "স্ট্যাটাস বদলানো যায়নি। আবার চেষ্টা করুন।";
    $("listMsg").className = "form-msg error";
    box.querySelectorAll("button").forEach(b => (b.disabled = false));
  }
}
