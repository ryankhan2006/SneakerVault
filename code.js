// Array of sneaker objects with details for each shoe
const shoeData = [
  {
    name: 'Nike Air Force 1',
    category: 'Casual',
    brand: 'Nike',
    audience: 'Men',
    price: 100,
    image: '',
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

// Function to filter and sort sneakers based on selected category, brand, audience, and price
function searchShoes() {
  const category = document.getElementById('category').value;
  const brand = document.getElementById('brand').value;
  const audience = document.getElementById('audience')?.value;
  const sort = document.getElementById('sort')?.value;
  const results = document.getElementById('results');
  results.innerHTML = ''; // Clear previous results

  // Filter shoes by matching category, brand, and audience
  let filtered = shoeData.filter(shoe => {
    return (!category || shoe.category === category) &&
           (!brand || shoe.brand === brand) &&
           (!audience || shoe.audience === audience);
  });

  // Sort based on price if selected
  if (sort === 'Low-High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'High-Low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // If no shoes match the filters, display message
  if (filtered.length === 0) {
    results.innerHTML = '<p>No sneakers found for selected filters.</p>';
    return;
  }

  // Create and display a card for each matching shoe
  filtered.forEach(shoe => {
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.innerHTML = `
      <img src="${shoe.image}" alt="${shoe.name}" />
      <h3>${shoe.name}</h3>
      <p>$${shoe.price}</p>
    `;
    card.onclick = () => showDetails(shoe); // Show modal on click
    results.appendChild(card);
  });
}

// Function to show detailed info of a selected shoe in a modal popup
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

// Function to close the modal popup
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Toggle light/dark mode
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

// Load saved theme preference and insert toggle button with icon
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

  // Create wrapper for positioning toggle theme button in top right
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '10px';
  wrapper.style.right = '10px';
  wrapper.appendChild(toggleBtn);

  document.body.appendChild(wrapper);
};