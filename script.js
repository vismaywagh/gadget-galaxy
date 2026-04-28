document.addEventListener('DOMContentLoaded', () => {
  // Product catalog
  const products = [
    { id: 1, name: "AeroX Smartwatch", price: 199, icon: "fas fa-clock" },
    { id: 2, name: "Voltx Wireless Buds", price: 89, icon: "fas fa-headphones" },
    { id: 3, name: "Gravity Speaker", price: 149, icon: "fas fa-volume-up" },
    { id: 4, name: "Charging Dock Pro", price: 59, icon: "fas fa-charging-station" },
    { id: 5, name: "Gaming Mouse X1", price: 49, icon: "fas fa-mouse" },
    { id: 6, name: "UltraBand Fitness", price: 129, icon: "fas fa-heartbeat" }
  ];

  let cart = [];

  // DOM elements
  const productsGrid = document.getElementById('productsGrid');
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartTotalSpan = document.getElementById('cartTotal');
  const cartCountSpan = document.getElementById('cartCount');
  const checkoutForm = document.getElementById('checkoutForm');
  const orderMsg = document.getElementById('orderMessage');

  // Helper: update cart UI
  function updateCartUI() {
    if (cart.length === 0) {
      cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty. Add some gear!</div>';
      cartTotalSpan.innerText = "$0.00";
      cartCountSpan.innerText = "0";
      return;
    }
    let total = 0;
    let itemCount = 0;
    let html = '';
    cart.forEach((item, idx) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      itemCount += item.qty;
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <p>${item.name}</p>
            <small>$${item.price.toFixed(2)}</small>
          </div>
          <div class="cart-item-actions">
            <button class="qty-decr" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-incr" data-id="${item.id}">+</button>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    });
    cartContainer.innerHTML = html;
    cartTotalSpan.innerText = `$${total.toFixed(2)}`;
    cartCountSpan.innerText = itemCount;
    attachCartEvents();
  }

  function attachCartEvents() {
    document.querySelectorAll('.qty-incr').forEach(btn => {
      btn.removeEventListener('click', incrHandler);
      btn.addEventListener('click', incrHandler);
    });
    document.querySelectorAll('.qty-decr').forEach(btn => {
      btn.removeEventListener('click', decrHandler);
      btn.addEventListener('click', decrHandler);
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.removeEventListener('click', removeHandler);
      btn.addEventListener('click', removeHandler);
    });
  }

  function incrHandler(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    updateCartUI();
  }
  function decrHandler(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) {
      if (cart[index].qty > 1) cart[index].qty--;
      else cart.splice(index, 1);
      updateCartUI();
    }
  }
  function removeHandler(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.qty++;
    else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    updateCartUI();
    const btn = document.querySelector(`.add-to-cart[data-id='${productId}']`);
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      setTimeout(() => btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to cart', 1000);
    }
  }

  // Render product cards
  function renderProducts() {
    productsGrid.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="product-icon"><i class="${p.icon}"></i></div>
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
        <button class="add-to-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Add to cart</button>
      </div>
    `).join('');
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        addToCart(id);
      });
    });
  }

  // Form validation (advanced)
  function validateCheckout() {
    let valid = true;
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const terms = document.getElementById('termsCheckbox').checked;

    document.getElementById('nameError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('phoneError').innerText = '';
    document.getElementById('addressError').innerText = '';
    document.getElementById('termsError').innerText = '';

    if (name === '') {
      document.getElementById('nameError').innerText = 'Full name required.';
      valid = false;
    } else if (name.length < 2) {
      document.getElementById('nameError').innerText = 'Enter valid name.';
      valid = false;
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (email === '') {
      document.getElementById('emailError').innerText = 'Email required.';
      valid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById('emailError').innerText = 'Valid email required.';
      valid = false;
    }
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    if (phone === '') {
      document.getElementById('phoneError').innerText = 'Phone number required.';
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      document.getElementById('phoneError').innerText = 'Enter a valid phone number.';
      valid = false;
    }
    if (address === '') {
      document.getElementById('addressError').innerText = 'Shipping address required.';
      valid = false;
    }
    if (!terms) {
      document.getElementById('termsError').innerText = 'You must accept the terms.';
      valid = false;
    }
    return valid;
  }

  // Submit order
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty! Add products first.");
      return;
    }
    if (validateCheckout()) {
      const orderDetails = {
        customer: document.getElementById('fullName').value,
        items: cart,
        total: cart.reduce((sum, i) => sum + (i.price * i.qty), 0)
      };
      console.log("Order placed:", orderDetails);
      orderMsg.style.display = 'block';
      orderMsg.innerHTML = '<i class="fas fa-check-circle"></i> Order confirmed! We’ll ship within 24h.';
      // reset cart and form
      cart = [];
      updateCartUI();
      checkoutForm.reset();
      setTimeout(() => {
        orderMsg.style.display = 'none';
      }, 5000);
      orderMsg.scrollIntoView({ behavior: 'smooth' });
    } else {
      const firstError = document.querySelector('.error:not(:empty)');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Set footer year
  document.getElementById('year').innerText = new Date().getFullYear();

  renderProducts();
  updateCartUI();
});