/*
  DATABASE FILE
  -------------
  Firebase config (firebase-config.js) bhora thakle Firebase Firestore use hoy.
  Khali thakle shamoyik bhabe browser er localStorage use hoy.
  index.html, style.css, script.js e kichu bodlate hoy na.

  Firestore e duto collection:
   - orders         : pura order (UID, TrxID shoho). Shudhu admin dekhte pare.
   - public_orders  : "Done" hoye jawa order er masked list (home page e dekhay).
*/

const FB_VERSION = "10.12.2";

// ------------------------- Local mode -------------------------
const LocalDB = (() => {
  const KEY = "shop_orders";
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };

  return {
    mode: "local",
    async saveOrder(order) {
      const saved = { ...order, id: "ORD" + Date.now().toString().slice(-8), status: "Pending", createdAt: new Date().toISOString() };
      write([saved, ...read()].slice(0, 200));
      return saved;
    },
    async getRecentOrders(limit = 8) { return read().slice(0, limit); },
    async updateOrderStatus(id, status) { write(read().map(o => (o.id === id ? { ...o, status } : o))); }
  };
})();

// ------------------------ Firebase mode ------------------------
const FirebaseDB = (() => {
  let ctx = null;

  async function init() {
    if (ctx) return ctx;
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [{ initializeApp }, fs] = await Promise.all([
      import(base + "firebase-app.js"),
      import(base + "firebase-firestore.js")
    ]);
    ctx = { fs, db: fs.getFirestore(initializeApp(FIREBASE_CONFIG)) };
    return ctx;
  }

  return {
    mode: "firebase",

    async saveOrder(order) {
      const { fs, db } = await init();
      const data = {
        category: order.category, package: order.package, price: order.price,
        uid: order.uid, payMethod: order.payMethod, sender: order.sender, trx: order.trx,
        status: "Pending", createdAt: fs.serverTimestamp()
      };
      const ref = await fs.addDoc(fs.collection(db, "orders"), data);
      return { ...order, id: ref.id.slice(0, 8).toUpperCase(), status: "Pending" };
    },

    // Shudhu "Done" order dekhay (masked)
    async getRecentOrders(limit = 8) {
      try {
        const { fs, db } = await init();
        const q = fs.query(fs.collection(db, "public_orders"), fs.orderBy("createdAt", "desc"), fs.limit(limit));
        const snap = await fs.getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        return [];
      }
    },

    // Admin login lagbe (admin panel pore baniye dibo). "Done" korle public list e masked kore jog hoy.
    async updateOrderStatus(id, status) {
      const { fs, db } = await init();
      const ref = fs.doc(db, "orders", id);
      await fs.updateDoc(ref, { status });
      if (status === "Done") {
        const o = (await fs.getDoc(ref)).data();
        await fs.setDoc(fs.doc(db, "public_orders", id), {
          uid: String(o.uid).slice(-3), package: o.package, price: o.price,
          status: "Done", createdAt: fs.serverTimestamp()
        });
      }
    }
  };
})();

const DB = (typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG.projectId) ? FirebaseDB : LocalDB;
