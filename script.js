// ======================
// المتغيرات العالمية
// ======================
let cart = [];
let gameState = {
    lives: 3,
    level: 1,
    gameStarted: false,
    gameOver: false,
    phonePosition: { x: 250, y: 350 },
    obstacles: [],
    shields: [],
    keys: {}
};

let sliderState = {
    currentSlide: 0,
    isPlaying: true,
    slides: [
        { title: "Comprehensive protection for your phone & laptop", subtitle: "Cuvero phone & Laptop", description: "Black lovers with the finest materials", image: "photo/5906912258297022318.jpg", color: "linear-gradient(45deg, #DAA520, #FFD700)" },
        { title: "Full transparency with protection", subtitle: "Cuvero wallet", description: "100% genuine leather material", image: "photo/5906912258297022322.jpg", color: "linear-gradient(45deg, #3498db, #74b9ff)" },
        { title: "Luxury and elegance", subtitle: "Cuvero iPhone", description: "Luxury", image: "photo/5906912258297022305.jpg", color: "linear-gradient(45deg, #e67e22, #f39c12)" },
        { title: "For an active lifestyle", subtitle: "Cuvero iPhone", description: "Show the beauty of your phone with maximum protection", image: "photo/5906912258297022302.jpg", color: "linear-gradient(45deg, #27ae60, #2ecc71)" }
    ]
};

// ======================
// مصفوفة المنتجات
// ======================
const products = [
    { id: 1, name: "iPhone Phone Case", price: 299, originalPrice: 399, image: "photo/5906912258297022307.jpg", rating: 4.0, reviews: 156, features: ["Water-resistant", "Genuine leather"] },
    { id: 2, name: "Laptop Bag", price: 199, originalPrice: 249, image: "photo/5906912258297022300.jpg", rating: 4.5, reviews: 189, features: ["Durable material", "Device protection"] },
    { id: 3, name: "Embroidery Case", price: 449, originalPrice: 549, image: "photo/5906912258297022312.jpg", rating: 4.9, reviews: 234, features: ["Durable material", "Elegant design"] },
    { id: 4, name: "Cuvero Sport Active", price: 179, originalPrice: 549, image: "photo/5906912258297022303.jpg", rating: 4.5, reviews: 67, features: ["Stunning look", "Lightweight"] },
]
window.products = products; // منتجات متاحة عالمياً

// ======================
// عند تحميل الصفحة
// ======================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    initializeCart();
});

// ======================
// تهيئة الموقع
// ======================
function initializeWebsite() {
    // اخفاء شاشة التحميل
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 2000);

    // initializeParticles();
    initializeNavigation();
    initializeProducts();
    initializeSlider();
    initializeGame();
    initializeSocialShare();
    initializeContactForm();
    initializeScrollAnimations();
}

// ======================
// Navigation
// ======================
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars'); icon.classList.toggle('fa-times');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars'); icon.classList.remove('fa-times');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    window.addEventListener('scroll', () => {
        header.style.background = window.scrollY > 100 ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.9)';
    });
}


// ======================
// Products
// ======================
function initializeProducts() {
    const productsGrid = document.getElementById('products-grid');
    products.forEach((product, index) => {
        const card = createProductCard(product);
        card.style.animationDelay = `${index * 0.1}s`;
        productsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image" style="position: relative;">
            <img src="${product.image}" alt="${product.name}" loading="lazy" style="object-fit: contain; width: 100%; height: 250px;">
            <div class="discount-label" style="position:absolute;top:10px;left:10px;background:red;color:white;padding:5px 8px;border-radius:5px;font-size:14px;z-index:10">Discount</div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating"><div class="stars">${generateStars(product.rating)}</div><span class="rating-text">(${product.reviews} Review)</span></div>
            <div class="product-price"><span class="current-price">${product.price} EGP</span>${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}</div>
            <div class="product-features">${product.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i>Add to Cart </button>
        </div>
    `;
    return card;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars += '<i class="fas fa-star star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt star"></i>';
        else stars += '<i class="far fa-star star empty"></i>';
    }
    return stars;
}


// === Image Slider Section ===
// إنشاء وعرض السلايدر في الصفحة مع التحكم بالانتقال التلقائي واليدوي
function initializeSlider() {
    const slider = document.getElementById('image-slider');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');

    // إنشاء كل شريحة وإضافتها للسلايدر مع النقاط (dots) للتحكم
    sliderState.slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
        slideElement.style.backgroundImage = `url(${slide.image})`;
        
        slideElement.innerHTML = `
            <div class="slide-overlay"></div>
            <div class="slide-content">
                <div class="slide-subtitle" style="background: ${slide.color}">${slide.subtitle}</div>
                <h3 class="slide-title">${slide.title}</h3>
                <p class="slide-description">${slide.description}</p>
                <div class="slide-buttons">
                    <button class="btn btn-primary">Shop</button>
                    <button class="btn btn-secondary">See More</button>
                </div>
            </div>
        `;
        
        slider.appendChild(slideElement);

        // إضافة أحداث الأزرار لفتح صفحات HTML منفصلة
        slideElement.querySelector('.btn-primary').addEventListener('click', () => {
            window.location.href = 'cuvero.html'; // صفحة "تسوق الآن"
        });

        slideElement.querySelector('.btn-secondary').addEventListener('click', () => {
            window.location.href = 'cuvero.html'; // صفحة "المزيد من التفاصيل"
        });

        // إنشاء نقطة للتحكم في الانتقال إلى هذه الشريحة
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // إضافة أحداث الأزرار للتنقل بين الشرائح
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    playPauseBtn.addEventListener('click', toggleAutoPlay);

    // تفعيل التشغيل التلقائي للسلايدر كل 4 ثواني
    let autoPlayInterval = setInterval(nextSlide, 4000);

    // الانتقال للشريحة التالية
    function nextSlide() {
        goToSlide((sliderState.currentSlide + 1) % sliderState.slides.length);
    }

    // الانتقال للشريحة السابقة
    function prevSlide() {
        goToSlide((sliderState.currentSlide - 1 + sliderState.slides.length) % sliderState.slides.length);
    }

    // الانتقال إلى شريحة معينة وتحديث النقاط
    function goToSlide(index) {
        slider.children[sliderState.currentSlide].classList.remove('active');
        dotsContainer.children[sliderState.currentSlide].classList.remove('active');

        sliderState.currentSlide = index;
        slider.children[sliderState.currentSlide].classList.add('active');
        dotsContainer.children[sliderState.currentSlide].classList.add('active');
    }

    // تشغيل أو إيقاف التشغيل التلقائي للسلايدر
    function toggleAutoPlay() {
        if (sliderState.isPlaying) {
            clearInterval(autoPlayInterval);
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            sliderState.isPlaying = false;
        } else {
            autoPlayInterval = setInterval(nextSlide, 4000);
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            sliderState.isPlaying = true;
        }
    }
}



// === Initialize Social Share ===
// تهيئة أزرار المشاركة الاجتماعية وإعداد نسخ الرابط
function initializeSocialShare() {
    const shareMainBtn = document.getElementById('share-main-btn');
    const shareOptions = document.getElementById('share-options');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    // فتح/إغلاق خيارات المشاركة عند الضغط على الزر الرئيسي
    shareMainBtn.addEventListener('click', () => {
        shareMainBtn.classList.toggle('active');
        shareOptions.classList.toggle('active');
    });

    // نسخ الرابط عند الضغط على زر النسخ
    copyLinkBtn.addEventListener('click', copyToClipboard);
}

// ======================
// Social Share
// ======================
document.addEventListener("DOMContentLoaded", function() {
    initializeSocialShare();
});

function initializeSocialShare() {
    const shareMainBtn = document.getElementById('share-main-btn');
    const shareOptions = document.getElementById('share-options');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    if (!shareMainBtn || !shareOptions || !copyLinkBtn) {
        console.warn("Social share elements not found!");
        return;
    }

    shareMainBtn.addEventListener('click', () => { 
        shareMainBtn.classList.toggle('active'); 
        shareOptions.classList.toggle('active'); 
    });

    copyLinkBtn.addEventListener('click', copyToClipboard);
}

function shareOnFacebook() {
    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent('تفقد مجموعة Cuvero الحصرية من أكفة الهواتف عالية الجودة!')}`,
        '_blank',
        'width=600,height=400'
    );
}

function shareOnWhatsApp() {
    window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent('تفقد مجموعة Cuvero الحصرية من أكفة الهواتف عالية الجودة! ' + window.location.href)}`,
        '_blank'
    );
}

function shareOnTelegram() {
    window.open(
        `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('تفقد مجموعة Cuvero الحصرية من أكفة الهواتف عالية الجودة! ')}`,
        '_blank'
    );
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href)
    .then(showCopyNotification)
    .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = window.location.href;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyNotification();
    });
}

function showCopyNotification() {
    const n = document.getElementById('copy-notification');
    if (n) {
        n.classList.add('show');
        setTimeout(() => n.classList.remove('show'), 2000);
    }
}

// ======================
// Contact Form
// ======================
(function() {
  // رقم واتساب المستلم — بدون + أو مسافات
  const WHATSAPP_NUMBER = "201015767465";

  function buildWhatsAppMessage(name, email, phone, message) {
    return encodeURIComponent(
      `رسالة جديدة من نموذج التواصل:\n\nالاسم: ${name}\nالبريد الإلكتروني: ${email}\nرقم الهاتف: ${phone}\nالرسالة: ${message}`
    );
  }

  function openUrlSafely(url) {
    // أفضل محاولة: عمل anchor.click() لتجنب popup-blocker
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      // fallback تقليدي
      window.open(url, '_blank');
    }
  }

  function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
      console.warn('initializeContactForm: #contact-form not found. Retrying after DOMContentLoaded.');
      document.addEventListener('DOMContentLoaded', initializeContactForm, { once: true });
      return;
    }

    // تأكد إن ما فيش listener متكررة
    contactForm.removeEventListener && contactForm.removeEventListener('submit', handleSubmit);

    contactForm.addEventListener('submit', handleSubmit);

    function handleSubmit(e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
      }

      const name = (contactForm.name && contactForm.name.value) || '';
      const email = (contactForm.email && contactForm.email.value) || '';
      const phone = (contactForm.phone && contactForm.phone.value) || '';
      const message = (contactForm.message && contactForm.message.value) || '';

      // بناء الرسالة بدون المصدر
      const msg = buildWhatsAppMessage(name, email, phone, message);

      // كشف نوع الجهاز
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      // روابط واتساب صحيحة
      const waMobileURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
      const waDesktopURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

      const finalURL = isMobile ? waMobileURL : waDesktopURL;

      console.log('WhatsApp URL:', finalURL);

      // افتح الرابط فورًا (بدون await أو تأخير)
      openUrlSafely(finalURL);

      // تنظيف الفورم واستعادة الزر
      contactForm.reset();
      if (submitBtn && originalText !== null) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }

      showNotification('تم إرسال رسالتك بنجاح! سيتم توجيهها إلى واتساب.', 'success');
    }
  }

  // تهيئة فورية إذا DOM جاهز أو بعد DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactForm, { once: true });
  } else {
    initializeContactForm();
  }
})();



// ======================
// Scroll Animations
// ======================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('fade-in'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.product-card, .contact-item, .feature-item').forEach(el => observer.observe(el));
}


// ======================
// Notifications
// ======================
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.style.cssText = `position: fixed; top: 90px; right: 20px; background: ${type === 'success' ? '#27ae60' : '#3498db'}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index:10000; transform: translateX(100%); transition: transform 0.3s ease; max-width:300px; font-weight:600;`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(100%)'; setTimeout(() => document.body.removeChild(n), 300); }, 3000);
}

// ======================
// Smooth Scroll Polyfill
// ======================
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// ======================
// Cart Functionality
// ======================
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const paymentSelect = document.getElementById('payment-select');
    let cartItems = [];

    
    // فتح السلة
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    }
    // غلق السلة
    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    }
    // تحديث عداد السلة
    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }
    // إضافة منتج للسلة
    window.addToCart = function(id) {
        const existing = cartItems.find(item => item.id === id);
        if (existing) existing.quantity++;
        else cartItems.push({ id, quantity: 1 });
        updateCartCount();
        renderCartItems();
        openCart();
    }

    // إزالة منتج
    window.removeItem = function(id) {
        cartItems = cartItems.filter(i => i.id !== id);
        updateCartCount();
        renderCartItems();
    }

    // تعديل الكمية
    window.changeQuantity = function(id, delta) {
        const item = cartItems.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity < 1) item.quantity = 1;
            renderCartItems();
        }
    }

  function renderCartItems() {
    const container = document.querySelector('.cart-items');
    container.innerHTML = '';

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>cart is empty</p>
            </div>
        `;
        // تحديث المجموع الكلي للصفر
        document.querySelector('.total-price').textContent = '0';
        return;
    }

    let totalPrice = 0; // لحساب المجموع الكلي

    cartItems.forEach(item => {
        const product = window.products.find(p => p.id === item.id);
        if (!product) return;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${product.image}" class="cart-item-image" alt="${product.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">${product.price} EGP</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeItem(${product.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(div);

        totalPrice += product.price * item.quantity;
    });

    // تحديث الـ span الموجود في footer بالمجموع الكلي
    document.querySelector('.total-price').textContent = totalPrice;
}


    // أحداث فتح وغلق السلة
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('cart is empty!');
                return;
            }

            let message = "طلب جديد:\n\n";
            let total = 0;
            cartItems.forEach(item => {
                const product = window.products.find(p => p.id === item.id);
                if (product) {
                    message += `${product.name} - ${item.quantity} × ${product.price} جنيه = ${item.quantity * product.price}\n`;
                    total += product.price * item.quantity;
                }
            });
            message += `المجموع الكلي: ${total} جنيه\n`;
            const method = paymentSelect ? paymentSelect.value : 'غير محدد';
            message += `طريقة الدفع: ${method}`;

            const whatsappNumber = '+201015767465';
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

            cartItems = [];
            updateCartCount();
            renderCartItems();
            closeCart();
        });
    }
});

