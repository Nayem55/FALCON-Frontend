/* CartDb.js — array-based storage */
const LS_KEY = "shopping_cart";

const makeKey = (pid, vid = null) => (vid ? `${pid}-${vid}` : `${pid}`);

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};

/* ---------------------------------------------------------------- */
const addToDb = (keyOrPid, quantity = 1, fullItemOpt = null, variationId) => {
  const key =
    typeof keyOrPid === "string" && keyOrPid.includes("-")
      ? keyOrPid
      : makeKey(keyOrPid, variationId);

  if (!key) return getStoredCart();

  const cart = getStoredCart();
  const delta = Number(quantity) || 1;

  const idx = cart.findIndex((it) => it.key === key);

  if (idx > -1) {
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
      cart.splice(idx, 1); // remove completely
    } else {
      cart[idx].qty = newQty;
    }
  } else if (delta > 0) {
    cart.push(
      fullItemOpt || {
        key,
        product: null,
        variation: null,
        qty: delta,
        price: 0,
        img: "",
      }
    );
  }

  localStorage.setItem(LS_KEY, JSON.stringify(cart));
  return cart; // always return fresh array
};

/* ---------------------------------------------------------------- */
const removeFromDb = (keyOrPid, variationId = null) => {
  const key =
    typeof keyOrPid === "string" && keyOrPid.includes("-")
      ? keyOrPid
      : makeKey(keyOrPid, variationId);

  const cart = getStoredCart().filter((it) => it.key !== key);
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
  return cart;
};

/* NEW: Function to update quantity in db */
const updateQtyInDb = (key, delta) => {
  const cart = getStoredCart();
  const idx = cart.findIndex((it) => it.key === key);
  
  if (idx > -1) {
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = newQty;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }
  return cart;
};

export { addToDb, removeFromDb, getStoredCart, updateQtyInDb };