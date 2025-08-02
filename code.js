const shoeData = [
  {
    name: 'Nike Air Force 1',
    category: 'Casual',
    brand: 'Nike',
    audience: 'Men',
    price: 100,
    image: '', // Add actual image URLs
    description: 'Classic and clean casual sneaker perfect for everyday wear.'
  },
  {
    name: 'Adidas Harden Vol. 6',
    category: 'Basketball',
    brand: 'Adidas',
    audience: 'Men',
    price: 140,
    image: '',
    description: 'Performance basketball shoe with responsive cushioning and grip.'
  },
  {
    name: 'Reebok Club C 85',
    category: 'Casual',
    brand: 'Reebok',
    audience: 'Women',
    price: 75,
    image: '',
    description: 'Minimalist and retro sneaker suitable for casual outfits.'
  },
  {
    name: 'New Balance 990v5',
    category: 'Casual',
    brand: 'New Balance',
    audience: 'Kids',
    price: 90,
    image: '',
    description: 'Premium comfort and durability. Made in USA classic model.'
  },
  {
    name: 'Nike Mercurial Vapor',
    category: 'Soccer',
    brand: 'Nike',
    audience: 'Men',
    price: 120,
    image: '',
    description: 'Lightweight soccer cleats built for speed and control.'
  }
];

function searchShoes() {
  const category = document.getElementById('category').value;
  const brand = document.getElementById('brand').value;
  const audience = document.getElementById('audience').value;
  const sort = document.getElementById('sort').value;
  const results = document.getElementById('results');
  results.innerHTML = '';

  let filtered = shoeData.filter(shoe => {
    return (!category || shoe.category === category) &&
           (!brand || shoe.brand === brand) &&
           (!audience || shoe.audience === audience);
  });

  if (sort === 'Low-High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'High-Low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    results.innerHTML = '<p>No sneakers found for selected filters.</p>';
    return;
  }

  filtered.forEach(shoe => {
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.innerHTML = `
      <img src="${shoe.image}" alt="${shoe.name}" />
      <h3>${shoe.name}</h3>
      <p>$${shoe.price}</p>
      <button class="wishlist-btn" onclick="toggleWishlist('${shoe.name}')">
        ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
      </button>
    `;
    card.onclick = () => showDetails(shoe);
    results.appendChild(card);
  });
}

function showDetails(shoe) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <h2>${shoe.name}</h2>
    <img src="${shoe.image}" alt="${shoe.name}" style="width: 100%; border-radius: 10px;" />
    <p style="margin-top: 1rem;">${shoe.description}</p>
    <p style="font-weight: bold; margin-top: 0.5rem;">Price: $${shoe.price}</p>
  `;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Wishlist functions
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function isInWishlist(name) {
  const wishlist = getWishlist();
  return wishlist.includes(name);
}

function toggleWishlist(name) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(name);
  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(name);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  searchShoes();
}

function showWishlist() {
  const wishlist = getWishlist();
  const results = document.getElementById('results');
  results.innerHTML = '';

  const favoritedShoes = shoeData.filter(shoe => wishlist.includes(shoe.name));

  if (favoritedShoes.length === 0) {
    results.innerHTML = '<p>Your wishlist is empty.</p>';
    return;
  }

  favoritedShoes.forEach(shoe => {
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.innerHTML = `
      <img src="${shoe.image}" alt="${shoe.name}" />
      <h3>${shoe.name}</h3>
      <p>$${shoe.price}</p>
      <button class="wishlist-btn" onclick="toggleWishlist('${shoe.name}')">
        ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
      </button>
    `;
    card.onclick = () => showDetails(shoe);
    results.appendChild(card);
  });
}

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  body.classList.toggle('dark-mode');

  icon.classList.add('rotate');
  setTimeout(() => icon.classList.remove('rotate'), 300);

  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    icon.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    icon.textContent = '🌙';
  }
}

window.onload = () => {
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.id = 'theme-icon';
  toggleBtn.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
  toggleBtn.onclick = toggleTheme;

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '10px';
  wrapper.style.right = '10px';
  wrapper.appendChild(toggleBtn);

  document.body.appendChild(wrapper);
};
