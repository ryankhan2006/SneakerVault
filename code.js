// Array of sneaker objects with details for each shoe
const shoeData = [
  {
    name: 'Nike Air Force 1',
    category: 'casual',
    brand: 'nike',
    image: '',
    description: 'Classic and clean casual sneaker perfect for everyday wear.'
  },
  {
    name: 'Adidas Harden Vol. 6',
    category: 'basketball',
    brand: 'adidas',
    image: '',
    description: 'Performance basketball shoe with responsive cushioning and grip.'
  },
  {
    name: 'Reebok Club C 85',
    category: 'casual',
    brand: 'reebok',
    image: '',
    description: 'Minimalist and retro sneaker suitable for casual outfits.'
  },
  {
    name: 'New Balance 990v5',
    category: 'casual',
    brand: 'newbalance',
    image: '',
    description: 'Premium comfort and durability. Made in USA classic model.'
  },
  {
    name: 'Nike Mercurial Vapor',
    category: 'soccer',
    brand: 'nike',
    image: '',
    description: 'Lightweight soccer cleats built for speed and control.'
  }
];

// Function to filter and display sneakers based on selected category and brand
function searchShoes() {
  const category = document.getElementById('category').value;
  const brand = document.getElementById('brand').value;
  const results = document.getElementById('results');
  results.innerHTML = '';

  // Filter shoes by matching category and brand
  const filtered = shoeData.filter(shoe => {
    return (!category || shoe.category === category) && (!brand || shoe.brand === brand);
  });

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
    `;
    card.onclick = () => showDetails(shoe);
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
  `;
  modal.style.display = 'flex';
}

// Function to close the modal popup
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}