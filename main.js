

// ----------------------------
// PRODUCTS DATA (English only)
// ----------------------------
const products = {
  'phone-cases': [
    { id: 1, name: 'Luxury iPhone 14 Golden Case', price: 299, image: 'منتجات/cuover/5906912258297022302-removebg-preview.png',images: ["منتجات/cuover/5906912258297022303-removebg-preview.png", "منتجات/cuover/5906912258297022312-removebg-preview.png", "منتجات/cuover/5908005799920253826-removebg-preview.png"], description: 'High-quality case with elegant golden design and advanced protection' },
    { id: 2, name: 'Gold Plated Case', price: 249, image: 'منتجات/cuover/5906912258297022303-removebg-preview.png', description: 'Gold-plated case with full 360° protection' },
    { id: 3, name: 'Xiaomi Golden Case', price: 199, image: 'منتجات/cuover/5906912258297022307-removebg-preview.png', description: 'Classic golden design made from premium materials' },
    { id: 4, name: 'Golden Silicone Case', price: 179, image: 'منتجات/cuover/5906912258297022308-removebg-preview.png', description: 'Flexible, comfortable and elegant finish' },
    { id: 5, name: 'Clear Case with Golden Edges', price: 189, image: 'منتجات/cuover/5906912258297022309-removebg-preview.png', description: 'Keeps phone design visible with polished golden edges' }
  ],

  'wallets': [
    { id: 30, name: 'Golden Natural Leather Wallet', price: 599, image: 'منتجات/wallet/5906912258297022294-removebg-preview.png', description: 'Natural leather wallet with luxury golden accents' },
    { id: 31, name: 'Classic Men\'s Wallet', price: 449, image: 'منتجات/wallet/5906912258297022295-removebg-preview.png', description: 'Elegant classic design with multiple pockets and high quality' },
    { id: 32, name: 'Small Golden Women\'s Wallet', price: 349, image: 'منتجات/wallet/5906912258297022296-removebg-preview.png', description: 'Compact elegant wallet with beautiful golden details' },
    { id: 33, name: 'Premium Golden Card Holder', price: 259, image: 'منتجات/wallet/5906912258297022301-removebg-preview.png', description: 'Practical and stylish card holder with golden touches' }
  ],

  'laptop-bags': [
    { id: 50, name: 'Golden Leather Laptop Bag 15-inch', price: 899, image: 'منتجات/labtop/5906912258297022300-removebg-preview.png', description: 'Practical and elegant laptop bag with golden details' },
    { id: 51, name: 'Luxury Business Bag', price: 1299, image: 'منتجات/labtop/5906912258297022301-removebg-preview.png', description: 'Premium business bag with organizational compartments and golden design' },
    { id: 52, name: 'Water-Resistant Laptop Bag', price: 799, image: 'منتجات/labtop/5906912258297022302-removebg-preview.png', description: 'Waterproof protection with practical and stylish design' }
  ]
};

// ----------------------------
// APP STATE
// ----------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';

// Pagination state per category
const PAGE_SIZE = 4; // عدد المنتجات اللي تظهر في كل تحميل (تقدر تغيّرها لو حبيت)
const categoryPageIndex = {}; // eg: { 'all': 0, 'phone-cases': 0 }

// ----------------------------
// DOM HELPERS
// ----------------------------
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const productsGridEl = () => document.getElementById('products-grid');
const categoryTitleEl = () => document.getElementById('category-title');
const backBtnEl = () => document.getElementById('back-btn');
const cartSidebarEl = () => document.getElementById('cart-sidebar');
const cartOverlayEl = () => document.getElementById('cart-overlay');
const cartItemsEl = () => document.getElementById('cart-items');
const cartTotalEl = () => document.getElementById('cart-total');
const cartCountEls = () => document.querySelectorAll('.cart-count');
const navButtons = () => document.querySelectorAll('.nav-btn');
const mobileToggle = () => document.querySelector('.mobile-menu-toggle');
const navLinksContainer = () => document.querySelector('.nav-links');

// ----------------------------
// TRANSLATIONS (English only)
// ----------------------------
const translations = {
  home: 'Home',
  allProducts: 'All Products',
  phoneCases: 'Phone Cases',
  wallets: 'Wallets',
  laptopBags: 'Laptop Bags',
  cart: 'Shopping Cart',
  checkout: 'Checkout',
  emptyCart: 'Your cart is empty',
  logo: 'Cuvero',
  back: 'Back to Home',
  total: 'Total: ',
  addToCart: 'Buy',
  remove: 'Remove',
  qty: 'Qty',
  currency: 'EGP',
  added: 'Added to cart!',
  loadMoreArabic: 'View other products' // نص زر تحميل المزيد
};

// ----------------------------
// UTILITIES
// ----------------------------
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function showNotification(msg, timeout = 2000) {
  const n = document.createElement('div');
  n.className = 'cu-notification';
  n.style.cssText =  `position:fixed; top:90px; right:18px; z-index:9999; 
    background:linear-gradient(90deg,#28a745,#218838); 
    color:#fff; padding:10px 14px; border-radius:10px; font-weight:800; 
    box-shadow:0 10px 30px rgba(0,0,0,0.08); font-family:'Cairo',sans-serif;`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => { n.style.opacity = '0'; n.style.transition = 'opacity .35s'; setTimeout(() => n.remove(), 350); }, timeout);
}

// ----------------------------
// PRODUCT CARD + LISTING
// ----------------------------
function createProductCard(p) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image" data-id="${p.id}" style="cursor:pointer;">
      <img src="${p.image}" alt="${escapeHtml(p.name)}">
    </div>
    <div class="product-info" style="display:flex; flex-direction:column; flex:1;">
      <h3 class="product-name">${escapeHtml(p.name)}</h3>
      <div class="product-footer" style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
        <span class="product-price">${p.price.toLocaleString()} ${translations.currency}</span>
        <button class="add-to-cart-btn" data-id="${p.id}">
          <i class="fas fa-plus"></i> ${translations.addToCart}
        </button>
      </div>
    </div>
  `;
  // add to cart button
  const btn = card.querySelector('.add-to-cart-btn');
  btn?.addEventListener('click', () => addToCart(p.id));

  // image click opens product modal (details)
  const imgWrapper = card.querySelector('.product-image');
  imgWrapper?.addEventListener('click', () => openProductModal(p.id));

  return card;
}

// Show category with pagination support
function showCategory(cat) {
  currentCategory = cat || 'all';
  const grid = productsGridEl();
  const title = categoryTitleEl();
  const back = backBtnEl();
  if (!grid || !title) return;

  // reset page index for this category if not set
  if (typeof categoryPageIndex[currentCategory] === 'undefined') categoryPageIndex[currentCategory] = 0;

  let list = [];
  if (cat === 'all') {
    list = [].concat(...Object.values(products));
    title.textContent = translations.allProducts;
    back.style.display = 'none';
  } else {
    list = products[cat] || [];
    title.textContent = cat === 'phone-cases' ? translations.phoneCases : (cat === 'wallets' ? translations.wallets : translations.laptopBags);
    back.style.display = 'flex';
  }

  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `<div style="padding:30px;text-align:center;color:#777">No products in this category</div>`;
    removeLoadMoreButton(); // ensure no load-more button
    return;
  }

  // calculate pagination slice
  const pageIndex = categoryPageIndex[currentCategory] || 0;
  const start = 0; // always show from first up to (pageIndex+1)*PAGE_SIZE
  const end = (pageIndex + 1) * PAGE_SIZE;
  const visibleList = list.slice(start, end);

  visibleList.forEach(p => grid.appendChild(createProductCard(p)));
  updateCartUI();

  // if there are more products — show load more button
  if (end < list.length) {
    renderLoadMoreButton();
  } else {
    removeLoadMoreButton();
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function (c) { return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[c]; });
}

// ----------------------------
// FIND PRODUCT
// ----------------------------
function findProductById(id) {
  id = Number(id);
  for (const key in products) {
    const f = products[key].find(p => p.id === id);
    if (f) return f;
  }
  return null;
}

// ----------------------------
// PRODUCT MODAL (image click -> details + multiple images slider)
// ----------------------------
function openProductModal(id) {
  const product = findProductById(id);
  if (!product) { showNotification('Product not found'); return; }

  // create modal wrapper
  const overlay = document.createElement('div');
  overlay.className = 'product-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:2000;padding:20px;';
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProductModal(overlay); });

  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.style.cssText = 'width:100%;max-width:820px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.2);display:flex;flex-direction:column;';

  // ✅ لو عنده صور كتير نعمل سلايدر
  let imagesHtml = '';
  if (product.images && product.images.length > 0) {
    imagesHtml = `
      <div class="modal-slider" style="position:relative;overflow:hidden;width:100%;">
        <div class="modal-slides" style="display:flex;transition:transform 0.4s ease;">
          ${product.images.map(src => `
            <div style="min-width:100%;display:flex;justify-content:center;align-items:center;">
              <img src="${src}" alt="${escapeHtml(product.name)}" style="max-width:100%;max-height:420px;object-fit:contain;border-radius:8px;">
            </div>
          `).join('')}
        </div>
        ${product.images.length > 1 ? `
          <button class="modal-prev" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);background:#fff;border:none;font-size:22px;cursor:pointer;border-radius:50%;padding:4px 8px;">❮</button>
          <button class="modal-next" style="position:absolute;top:50%;right:10px;transform:translateY(-50%);background:#fff;border:none;font-size:22px;cursor:pointer;border-radius:50%;padding:4px 8px;">❯</button>
        ` : ''}
      </div>
    `;
  } else {
    imagesHtml = `
      <img src="${product.image}" alt="${escapeHtml(product.name)}" 
           style="max-width:100%;max-height:420px;object-fit:contain;border-radius:8px;">
    `;
  }

  modal.innerHTML = `
    <div style="display:flex;gap:18px;padding:18px;flex-direction:row;align-items:flex-start;">
      <div style="flex:0 0 48%;display:flex;align-items:center;justify-content:center;">
        ${imagesHtml}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:12px;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <h2 style="margin:0;font-size:20px;">${escapeHtml(product.name)}</h2>
          <button class="close-product-modal" aria-label="close" style="background:none;border:none;font-size:20px;cursor:pointer;">&times;</button>
        </div>
        <p style="color:#555;margin:0 0 6px 0;line-height:1.4;">${escapeHtml(product.description)}</p>
        <div style="font-weight:800;font-size:18px;margin-top:6px;">${product.price.toLocaleString()} ${translations.currency}</div>

        <div style="display:flex;align-items:center;gap:8px;margin-top:12px;">
          <button class="qty-decrease" style="width:36px;height:36px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer;">-</button>
          <span class="qty-value" style="min-width:34px;text-align:center;font-weight:700;">1</span>
          <button class="qty-increase" style="width:36px;height:36px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer;">+</button>
          <button class="modal-add-to-cart" style="margin-left:auto;background:#fff;color:#B8860B;border:2px solid #B8860B;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:700;">${translations.addToCart}</button>
        </div>

        <div style="margin-top:auto;color:#999;font-size:13px;">Click outside modal or press × to close.</div>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // prevent background scroll while modal open

  // event listeners
  modal.querySelector('.close-product-modal')?.addEventListener('click', () => closeProductModal(overlay));
  modal.querySelector('.qty-decrease')?.addEventListener('click', () => {
    const qEl = modal.querySelector('.qty-value');
    let q = Number(qEl.textContent || '1');
    if (q > 1) q--;
    qEl.textContent = String(q);
  });
  modal.querySelector('.qty-increase')?.addEventListener('click', () => {
    const qEl = modal.querySelector('.qty-value');
    let q = Number(qEl.textContent || '1');
    q++;
    qEl.textContent = String(q);
  });
  modal.querySelector('.modal-add-to-cart')?.addEventListener('click', () => {
    const q = Number(modal.querySelector('.qty-value').textContent || '1');
    addToCartWithQuantity(product.id, q);
    closeProductModal(overlay);
  });

  // ✅ سلايدر الصور (لو فيه أكتر من صورة)
  if (product.images && product.images.length > 1) {
    let currentSlide = 0;
    const slidesContainer = modal.querySelector('.modal-slides');
    const totalSlides = product.images.length;

    modal.querySelector('.modal-prev')?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    modal.querySelector('.modal-next')?.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    });
  }

  // close on ESC
  function escHandler(e) {
    if (e.key === 'Escape') closeProductModal(overlay);
  }
  window.addEventListener('keydown', escHandler);

  // store reference to cleanup
  overlay._escHandler = escHandler;
}

function closeProductModal(overlay) {
  if (!overlay) return;
  // remove esc listener
  if (overlay._escHandler) window.removeEventListener('keydown', overlay._escHandler);
  overlay.remove();
  document.body.style.overflow = '';
}

function addToCartWithQuantity(id, qty) {
  const product = findProductById(id);
  if (!product) { showNotification('Product not found'); return; }
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty });

  saveCart();
  updateCartUI();
  showNotification(translations.added);
}

// ----------------------------
// CART FUNCTIONS
// ----------------------------
function addToCart(id) {
  const product = findProductById(id);
  if (!product) { showNotification('Product not found'); return; }

  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });

  saveCart();
  updateCartUI();
  showNotification(translations.added);
}

function changeQuantity(id, delta) {
  const itm = cart.find(i => i.id === id);
  if (!itm) return;
  itm.quantity += delta;
  if (itm.quantity <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function clearCart() { cart = []; saveCart(); updateCartUI(); }

function updateCartUI() {
  const count = cart.reduce((s, item) => s + item.quantity, 0);
  cartCountEls().forEach(el => el.textContent = count);

  const itemsContainer = cartItemsEl();
  const totalEl = cartTotalEl();
  if (!itemsContainer || !totalEl) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div class="empty-cart" style="padding:30px;text-align:center;color:#777"><i class="fas fa-shopping-cart" style="font-size:28px;margin-bottom:10px;display:block"></i><div style="font-weight:700">${translations.emptyCart}</div></div>`;
    totalEl.textContent = '0';
    return;
  }

  itemsContainer.innerHTML = '';
  cart.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'cart-item';
    wrap.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;';
    wrap.innerHTML = `
      <img src="${item.image}" style="width:64px;height:64px;object-fit:cover;border-radius:8px">
      <div style="flex:1;min-width:0">
        <div style="font-weight:700">${escapeHtml(item.name)}</div>
        <div style="color:#666;margin-top:6px">${item.price.toLocaleString()} ${translations.currency}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
          <button class="quantity-btn decrease" data-id="${item.id}"><i class="fas fa-minus"></i></button>
          <span class="quantity" style="min-width:24px;text-align:center;font-weight:700">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}"><i class="fas fa-plus"></i></button>
          <button class="remove-item-btn" data-id="${item.id}" style="margin-left:8px">${translations.remove}</button>
        </div>
      </div>
    `;
    wrap.querySelector('.increase')?.addEventListener('click', e => changeQuantity(Number(e.currentTarget.dataset.id), 1));
    wrap.querySelector('.decrease')?.addEventListener('click', e => changeQuantity(Number(e.currentTarget.dataset.id), -1));
    wrap.querySelector('.remove-item-btn')?.addEventListener('click', e => removeFromCart(Number(e.currentTarget.dataset.id)));
    itemsContainer.appendChild(wrap);
  });

  const totalSum = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  totalEl.textContent = totalSum.toLocaleString();
}

// ----------------------------
// CART SIDEBAR TOGGLE + CHECKOUT
// ----------------------------
function openCart() { cartSidebarEl()?.classList.add('open'); cartOverlayEl()?.classList.add('active'); document.body.style.overflow = 'hidden'; updateCartUI(); }
function closeCart() { cartSidebarEl()?.classList.remove('open'); cartOverlayEl()?.classList.remove('active'); document.body.style.overflow = ''; }
function toggleCart() { cartSidebarEl()?.classList.contains('open') ? closeCart() : openCart(); }

function checkout() {
  if (!cart.length) { showNotification(translations.emptyCart); return; }
  let msg = 'New order:%0A';
  let total = 0;
  cart.forEach(i => { msg += `- ${i.name} x${i.quantity} = ${i.price*i.quantity} ${translations.currency}%0A`; total += i.price*i.quantity; });
  msg += `Total: ${total} ${translations.currency}`;
  const phone = '201015767465';
  window.open(`https://wa.me/${phone}?text=${msg}`);
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

// ----------------------------
// NAVIGATION + MOBILE MENU
// ----------------------------
function initNav() {
  const btns = navButtons();
  const cats = [null, 'all','phone-cases','wallets','laptop-bags'];

  btns.forEach((b, i) => {
    b.addEventListener('click', e => {
      const href = b.getAttribute('href');
      if (href === 'index.html') return;
      e.preventDefault();
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const cat = cats[i] || 'all';
      // reset pagination for this category when user explicitly switches
      categoryPageIndex[cat] = 0;
      showCategory(cat);
      navLinksContainer()?.classList.remove('active');
      mobileToggle()?.classList.remove('active');
    });
  });

  mobileToggle()?.addEventListener('click', () => {
    navLinksContainer()?.classList.toggle('active');
    mobileToggle().classList.toggle('active');
  });
}

function backToHome() { 
  // reset pagination for all
  for (const k in categoryPageIndex) categoryPageIndex[k] = 0;
  showCategory('all'); 
}

// ----------------------------
// LOAD MORE BUTTON (renders at bottom of products grid)
// ----------------------------
function renderLoadMoreButton() {
  removeLoadMoreButton();
  const grid = productsGridEl();
  if (!grid) return;
  const btnWrap = document.createElement('div');
  btnWrap.id = 'load-more-wrap';
  btnWrap.style.cssText = 'width:100%;display:flex;justify-content:center;padding:18px;';
  btnWrap.innerHTML = `<button id="load-more-btn" style="background:#fff;border:2px solid #B8860B;color:#000000;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">${translations.loadMoreArabic}</button>`;
  grid.parentNode.insertBefore(btnWrap, grid.nextSibling);

  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    categoryPageIndex[currentCategory] = (categoryPageIndex[currentCategory] || 0) + 1;
    showCategory(currentCategory);
    // smooth scroll to newly loaded items
    setTimeout(() => {
      const gridEl = productsGridEl();
      if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 120);
  });
}

function removeLoadMoreButton() {
  const existing = document.getElementById('load-more-wrap');
  if (existing) existing.remove();
}

// ----------------------------
// GLOBAL INIT
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  showCategory('all');
  updateCartUI();

  document.querySelector('.checkout-btn')?.addEventListener('click', checkout);
  document.querySelector('.cart-icon')?.addEventListener('click', toggleCart);
  document.querySelector('.close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  backBtnEl()?.addEventListener('click', backToHome);

  window.toggleMobileMenu = () => { navLinksContainer()?.classList.toggle('active'); mobileToggle().classList.toggle('active'); };
  window.showCategory = showCategory;
  window.addToCart = addToCart;
  window.backToHome = backToHome;
  window.toggleCart = toggleCart;
  window.checkout = checkout;
});

// ====== Slider Data ======
const customSliderData = [
  { img: 'photo/5906912258297022299.jpg', text: 'Welcome' },
  { img: 'photo/5906912258297022317.jpg', text: 'Best Wallets' },
  { img: 'photo/5906912258297022324.jpg', text: 'Elegant Laptop Bags' }
];

let customIndex = 0;
const customWrapper = document.querySelector('.custom-slider-wrapper');

function renderCustomSlider() {
  if (!customWrapper) return;
  customWrapper.innerHTML = '';
  customSliderData.forEach((item, idx) => {
    const slide = document.createElement('div');
    slide.classList.add('custom-slide');
    if(idx === customIndex) slide.classList.add('active');
    slide.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="custom-slide-text">${item.text}</div>
    `;
    customWrapper.appendChild(slide);
  });
}

function showCustomSlide(index) {
  const slides = document.querySelectorAll('.custom-slide');
  if(!slides.length) return;
  if(index < 0) index = slides.length - 1;
  if(index >= slides.length) index = 0;
  slides.forEach((s, i)=> s.classList.remove('active'));
  slides[index].classList.add('active');
  customWrapper.style.transform = `translateX(-${index * 100}%)`;
  customIndex = index;
}

document.querySelector('.custom-prev')?.addEventListener('click', ()=> showCustomSlide(customIndex - 1));
document.querySelector('.custom-next')?.addEventListener('click', ()=> showCustomSlide(customIndex + 1));
setInterval(()=> showCustomSlide(customIndex + 1), 3000);

document.addEventListener('DOMContentLoaded', renderCustomSlider);
