let currentPage = 1;
const itemsPerPage = 20;
let filteredShoes = [];


// In-memory storage instead of localStorage
let appState = {
  wishlist: [],
  theme: 'light',
  reviews: {} // Store reviews by shoe name
};

// Global variable to track selected rating - THIS IS THE KEY FIX
let currentSelectedRating = 0;

// Creates safe and unique ids when loading data from CSV
function makeSafeId(row, idx) {
  const raw = `${(row['Image Link']||'').trim()}|${(row['Name']||'').trim()}|${(row['Color']||'').trim()}|${idx}`;
  return 'sh_' + encodeURIComponent(raw);
}

// Sneaker data with category, brand, audience, and price from csv file
function loadCSVDData() {
  Papa.parse("newshoedata.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      shoeData = results.data.map((row, idx) => {
        const fixed = {};
        for (const key in row) {
          const cleanKey = key.trim().replace(/[\uFEFF\r\n]+/g, "");
          fixed[cleanKey] = (row[key] || "").trim();
        }

        return {
          id: makeSafeId(fixed, idx),
          name: fixed["Name"],
          category: fixed["Category"],
          brand: fixed["Brand"],
          audience: fixed["Audience"],
          price: parseFloat(fixed["Price USD"]),
          image: fixed["Image Link"],
          description: fixed["Description"],
          color: (fixed["Color"] || "")
            .split("/")
            .map((c) => c.trim())
            .filter((c) => c),
          genericColors: (fixed["Generic Colors"] || "")
            .split("/")
            .map((c) => c.trim())
            .filter((c) => c),
        };
      });

      populateColorDropdown(shoeData);
      searchShoes();
    },
  });
}


function populateColorDropdown(data) {
  const colorSet = new Set();

  data.forEach((shoe) => {
    (shoe.genericColors || []).forEach((color) => {
      if (color) colorSet.add(color);
    });
  });

  const container = document.getElementById("color-options");
  container.innerHTML = "";

  Array.from(colorSet)
    .sort((a, b) => a.localeCompare(b))
    .forEach((color) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = color;
      input.addEventListener("change", searchShoes);
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + color));
      container.appendChild(label);
    });

}

function getCheckedValues(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} input:checked`)).map(input => input.value);
}

function toggleDropdown(id) {
  const allDropdowns = document.querySelectorAll('.dropdown-content');
  allDropdowns.forEach(dropdown => {
    if (dropdown.id !== id) {
      dropdown.style.display = 'none';
    }
  });

  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
  const isDropdown = event.target.closest('.dropdown');
  if (!isDropdown) {
    document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
  }
});

document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', searchShoes);
});

// Review system functions
function getShoeReviews(shoeName) {
  return appState.reviews[shoeName] || [];
}

function addReview(shoeName, rating, comment, username) {
  if (!appState.reviews[shoeName]) {
    appState.reviews[shoeName] = [];
  }
  
  const review = {
    id: Date.now(),
    rating: parseInt(rating),
    comment: comment.trim(),
    username: username.trim() || 'Anonymous',
    date: new Date().toLocaleDateString()
  };
  
  appState.reviews[shoeName].push(review);
}

function getAverageRating(shoeName) {
  const reviews = getShoeReviews(shoeName);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

function renderStars(rating, interactive = false, size = '1.2rem') {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating;
    const starClass = interactive ? 'interactive-star' : 'display-star';
    const starColor = filled ? '#ffd700' : '#ddd';
    starsHtml += `<span class="${starClass}" data-rating="${i}" style="color: ${starColor}; font-size: ${size}; cursor: ${interactive ? 'pointer' : 'default'};">★</span>`;
  }
  return starsHtml;
}

// FIXED STAR RATING FUNCTION - This was the main bug
function setupStarRating(containerId) {
  currentSelectedRating = 0; // Reset the global rating
  const stars = document.querySelectorAll(`#${containerId} .interactive-star`);
  
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const rating = parseInt(this.dataset.rating);
      highlightStars(containerId, rating);
    });
    
    star.addEventListener('click', function() {
      currentSelectedRating = parseInt(this.dataset.rating); // Update global variable
      highlightStars(containerId, currentSelectedRating);
    });
  });
  
  document.getElementById(containerId).addEventListener('mouseleave', function() {
    highlightStars(containerId, currentSelectedRating); // Use global variable
  });
}

function highlightStars(containerId, rating) {
  const stars = document.querySelectorAll(`#${containerId} .interactive-star`);
  stars.forEach((star, index) => {
    star.style.color = (index + 1) <= rating ? '#ffd700' : '#ddd';
  });
}

function clearFilters() {
  document.querySelectorAll('.dropdown-content input:checked').forEach(cb => cb.checked = false);
  document.getElementById('sort').value = '';
  searchShoes();
}

function searchShoes() {
  currentPage = 1; // Reset to first page on new search
  const selectedCategories = getCheckedValues('category-options');
  const selectedBrands = getCheckedValues('brand-options');
  const selectedColors = getCheckedValues('color-options');
  const selectedAudiences = getCheckedValues('audience-options');
  const sort = document.getElementById('sort').value;
  const results = document.getElementById('results');
  results.innerHTML = '';

  let filtered = shoeData.filter(shoe => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(shoe.category);
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(shoe.brand);
    const colorMatch =
  selectedColors.length === 0 ||
  (Array.isArray(shoe.genericColors) &&
    shoe.genericColors.some((c) => selectedColors.includes(c)));

    const audienceMatch = selectedAudiences.length === 0 || selectedAudiences.includes(shoe.audience);
    return categoryMatch && brandMatch && colorMatch && audienceMatch;
  });

  if (sort === 'Low-High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'High-Low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    results.innerHTML = '<div class="no-results">No sneakers found for selected filters. Try adjusting your search criteria.</div>';
    return;
  }

  filteredShoes = filtered; // Store for pagination
  renderPaginatedShoes();
}

function renderPaginatedShoes() {
  const results = document.getElementById("results");
  results.dataset.view = 'browse';
  results.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedShoes = filteredShoes.slice(start, end);

  if (paginatedShoes.length === 0) {
    results.innerHTML = "<div class='no-results'>No shoes found.</div>";
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  paginatedShoes.forEach(shoe => {
    const card = document.createElement("div");
    card.className = "shoe-card";
    card.innerHTML = `
      <img src="${shoe.image}" alt="${shoe.name}" onerror="this.src='fallback.jpg'" />
      <h3>${shoe.name}</h3>
      <p><strong>Brand:</strong> ${shoe.brand}</p>
      <p><strong>Category:</strong> ${shoe.category}</p>
      <p><strong>Price:</strong> $${shoe.price.toFixed(2)}</p>
    `;

    card.onclick = () => showDetails(shoe);

    results.appendChild(card);
  });

  renderPaginationControls();
}

function renderPaginationControls() {
  const pagination = document.getElementById("pagination-controls");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredShoes.length / itemsPerPage);
  if (totalPages <= 1) return;

  const createPageButton = (pageNum) => {
    const btn = document.createElement("button");
    btn.textContent = pageNum;
    if (pageNum === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = pageNum;
      renderPaginatedShoes();
    };
    return btn;
  };

  const addEllipsis = () => {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    pagination.appendChild(span);
  };

  const prev = document.createElement("button");
  prev.textContent = "« Prev";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    renderPaginatedShoes();
  };
  pagination.appendChild(prev);

  pagination.appendChild(createPageButton(1));

  if (currentPage > 4) addEllipsis();

  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pagination.appendChild(createPageButton(i));
  }

  if (currentPage < totalPages - 3) addEllipsis();

  if (totalPages > 1) {
    pagination.appendChild(createPageButton(totalPages));
  }

  const next = document.createElement("button");
  next.textContent = "Next »";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    renderPaginatedShoes();
  };
  pagination.appendChild(next);
}

function showDetails(shoe) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');
  const avgRating = getAverageRating(shoe.name);
  const reviews = getShoeReviews(shoe.name);
  
  content.innerHTML = `
    <h2>${shoe.name}</h2>
    <img src="${shoe.image}" alt="${shoe.name}" style="width: 100%; max-width: 300px; border-radius: 10px;" onerror="this.innerHTML='${shoe.name}'" />
    <p style="margin-top: 1rem; line-height: 1.6;">${shoe.description}</p>
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee;">
      <div>
        <p style="margin: 0; color: #666;"><strong>Brand:</strong> ${shoe.brand}</p>
        <p style="margin: 0; color: #666;"><strong>Category:</strong> ${shoe.category}</p>
        <p style="margin: 0; color: #666;"><strong>Target:</strong> ${shoe.audience}</p>
      </div>
      <p style="font-size: 1.5rem; font-weight: bold; color: #007aff; margin: 0;">$${shoe.price}</p>
    </div>
    
    <!-- Rating Display -->
    <div style="text-align: center; margin: 1.5rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
        ${avgRating > 0 ? renderStars(avgRating, false, '1.5rem') : '<span style="color: #999;">No reviews yet</span>'}
      </div>
      ${avgRating > 0 ? `<p style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #333;">${avgRating} out of 5 stars (${reviews.length} reviews)</p>` : '<p style="margin: 0; color: #666;">Be the first to review!</p>'}
    </div>
    
    <!-- Add Review Section -->
    <div style="margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #eee; border-radius: 8px; background: #fafafa;">
      <h3 style="margin-top: 0; color: #333;">Write a Review</h3>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #555;">Your Rating:</label>
        <div id="star-rating">${renderStars(0, true, '1.5rem')}</div>
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #555;">Your Name (optional):</label>
        <input type="text" id="reviewer-name" placeholder="Enter your name" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #555;">Your Review:</label>
        <textarea id="review-text" placeholder="Share your thoughts about this sneaker..." style="width: 100%; height: 80px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-size: 1rem; font-family: inherit;"></textarea>
      </div>
      <button onclick="submitReview('${shoe.name}')" style="padding: 0.75rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">Submit Review</button>
    </div>
    
    <!-- Display Reviews -->
    <div id="reviews-section" style="margin-top: 2rem;">
      <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">Customer Reviews</h3>
      <div id="reviews-list">${renderReviews(reviews)}</div>
    </div>

    <button id="wishlist-btn" type="button"
            style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: ${isInWishlist(shoe.id) ? '#e74c3c' : '#007aff'}; color: white; border: none; border-radius: 6px; cursor: pointer;">
      ${isInWishlist(shoe.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
    </button>
  `;
  modal.style.display = 'flex';

  const wishBtn = content.querySelector('#wishlist-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Ensure id exists check (Even though it should with makeSafeId function)
      if (!shoe.id) {
        shoe.id = 'sh_fallback_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); 
      }
      toggleWishlist(shoe.id);

      showDetails(shoe); // Refresh modal to update button state
  
  // Setup interactive star rating after modal is displayed
  setTimeout(() => setupStarRating('star-rating'), 100);
});
  }
}

function renderReviews(reviews) {
  if (reviews.length === 0) {
    return '<p style="text-align: center; color: #666; padding: 2rem;">No reviews yet. Be the first to share your experience!</p>';
  }
  
  return reviews.map(review => `
    <div style="padding: 1rem; margin-bottom: 1rem; border: 1px solid #eee; border-radius: 8px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div>
          <strong style="color: #333;">${review.username}</strong>
          <span style="margin-left: 1rem; color: #666; font-size: 0.9rem;">${review.date}</span>
        </div>
        <div>${renderStars(review.rating, false, '1rem')}</div>
      </div>
      <p style="margin: 0; line-height: 1.5; color: #555;">${review.comment}</p>
    </div>
  `).join('');
}

// FIXED SUBMIT REVIEW FUNCTION - This was the main bug
function submitReview(shoeName) {
  const rating = currentSelectedRating; // Use the global variable directly
  const comment = document.getElementById('review-text').value;
  const username = document.getElementById('reviewer-name').value;
  
  if (rating === 0) {
    alert('Please select a star rating before submitting your review.');
    return;
  }
  
  if (comment.trim() === '') {
    alert('Please write a review comment before submitting.');
    return;
  }
  
  addReview(shoeName, rating, comment, username);
  
  // Refresh the modal to show the new review
  const shoe = shoeData.find(s => s.name === shoeName);
  showDetails(shoe);
  
  // Show success message
  setTimeout(() => {
    alert('Thank you for your review! It has been added successfully.');
  }, 100);
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Wishlist functions using in-memory storage
function getWishlist() {
  return appState.wishlist;
}

function isInWishlist(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(id);
  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(id);
  }
  // Re-render current view
  const results = document.getElementById('results');
  const view = results.dataset.view || 'browse';
  if (view === 'wishlist') {
    showWishlist();
  } else {
    searchShoes();
  }
}

function showWishlist() {
  const wishlist = getWishlist();
  const results = document.getElementById('results');
  results.innerHTML = '';
  results.dataset.view = 'wishlist';

  let favoritedShoes = shoeData.filter(shoe => wishlist.includes(shoe.id));

  const sort = document.getElementById('sort').value;
  if (sort === 'Low-High') {
    favoritedShoes.sort((a, b) => a.price - b.price);
  } else if (sort === 'High-Low') {
    favoritedShoes.sort((a, b) => b.price - a.price);
  }

  if (favoritedShoes.length === 0) {
    results.innerHTML = '<div class="no-results">Your wishlist is empty. ❤️<br><button onclick="clearFilters()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007aff; color: white; border: none; border-radius: 6px; cursor: pointer;">Browse Sneakers</button></div>';
    return;
  }

  // Add wishlist header
  const header = document.createElement('div');
  header.style.width = '100%';
  header.style.textAlign = 'center';
  header.style.marginBottom = '1rem';
  header.innerHTML = `
    <h2 style="color: #007aff; margin-bottom: 0.5rem;">💖 Your Wishlist (${favoritedShoes.length})</h2>
    <button onclick="clearFilters()" style="padding: 0.5rem 1rem; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer;">← Back to Browse</button>
  `;
  results.appendChild(header);

  favoritedShoes.forEach(shoe => {
    const avgRating = getAverageRating(shoe.name);
    const reviewCount = getShoeReviews(shoe.name).length;
    
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.innerHTML = `
      <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${shoe.id}')">
        ${isInWishlist(shoe.id) ? '❤️' : '🤍'}
      </button>
      <img src="${shoe.image}" alt="${shoe.name}" onerror="this.innerHTML='${shoe.name}'" />
      <h3>${shoe.name}</h3>
      <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">${shoe.brand} • ${shoe.category}</p>
      <div style="display: flex; align-items: center; justify-content: center; margin: 0.5rem 0;">
        ${avgRating > 0 ? renderStars(avgRating, false, '1rem') : '<span style="color: #999; font-size: 0.9rem;">No reviews yet</span>'}
        ${avgRating > 0 ? `<span style="margin-left: 0.5rem; font-size: 0.9rem; color: #666;">${avgRating} (${reviewCount})</span>` : ''}
      </div>
      <p style="font-size: 1.2rem; font-weight: bold; color: #007aff;">$${shoe.price}</p>
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
    appState.theme = 'dark';
    icon.textContent = '☀️';
  } else {
    appState.theme = 'light';
    icon.textContent = '🌙';
  }
}

// Initialize app
window.onload = () => {
  loadCSVDData(); // Load all shoes initially
};


document.getElementById('sort').addEventListener('change', () => {
  const view = document.getElementById('results').dataset.view || 'browse';
  if (view === 'wishlist') {
    showWishlist();
  } else {
    searchShoes();
  }
});

// Click outside modal to close
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// ===== CHATBOT FUNCTIONALITY =====

// Toggle chatbot widget
function toggleChatbot() {
  const widget = document.getElementById('chatbot-widget');
  widget.classList.toggle('active');

  // Focus input when opening
  if (widget.classList.contains('active')) {
    document.getElementById('chatbot-input').focus();
  }
}

// Add message to chatbot
function addChatMessage(text, isUser = false, products = null) {
  const messagesContainer = document.getElementById('chatbot-messages');

  // Remove welcome message on first user message
  if (isUser && messagesContainer.querySelector('.chatbot-welcome')) {
    messagesContainer.querySelector('.chatbot-welcome').remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'chatbot-bubble';
  bubbleDiv.textContent = text;

  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);

  // If there are products to display, add product cards
  if (products && products.length > 0) {
    const productCardsDiv = document.createElement('div');
    productCardsDiv.className = 'chatbot-product-cards';

    products.slice(0, 5).forEach(product => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'chatbot-product-card';
      cardDiv.onclick = () => showDetails(product);

      cardDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="chatbot-product-image" onerror="this.style.display='none'">
        <div class="chatbot-product-info">
          <div class="chatbot-product-name">${product.name}</div>
          <div class="chatbot-product-brand">${product.brand}</div>
          <div class="chatbot-product-price">$${product.price.toFixed(2)}</div>
        </div>
      `;

      productCardsDiv.appendChild(cardDiv);
    });

    messagesContainer.appendChild(productCardsDiv);
  }

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Parse user message to extract filters
function parseChatMessage(message) {
  const lowerMessage = message.toLowerCase();

  let filters = {
    brand: null,
    color: null,
    maxPrice: null,
    category: null
  };

  // Detect brand
  const brands = ['jordan', 'nike', 'adidas', 'puma', 'new balance', 'reebok', 'asics', 'vans', 'converse', 'under armour'];
  for (const brand of brands) {
    if (lowerMessage.includes(brand)) {
      // Capitalize properly
      if (brand === 'new balance') {
        filters.brand = 'New Balance';
      } else if (brand === 'under armour') {
        filters.brand = 'Under Armour';
      } else {
        filters.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      }
      break;
    }
  }

  // Detect color
  const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'brown', 'grey', 'gray'];
  for (const color of colors) {
    if (lowerMessage.includes(color)) {
      filters.color = color === 'gray' ? 'grey' : color;
      break;
    }
  }

  // Detect price filter
  const priceMatch = lowerMessage.match(/(?:under|less than|below|cheaper than)\s*\$?(\d+)/i);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1]);
  }

  // Detect category
  const categories = ['basketball', 'running', 'lifestyle', 'training', 'soccer', 'tennis', 'skateboarding'];
  for (const category of categories) {
    if (lowerMessage.includes(category)) {
      filters.category = category.charAt(0).toUpperCase() + category.slice(1);
      break;
    }
  }

  return filters;
}

// Filter sneakers based on chatbot criteria
function filterChatSneakers(filters) {
  let results = shoeData || [];

  if (filters.brand) {
    results = results.filter(s => s.brand.toLowerCase() === filters.brand.toLowerCase());
  }

  if (filters.color) {
    results = results.filter(s => {
      if (Array.isArray(s.genericColors)) {
        return s.genericColors.some(c => c.toLowerCase() === filters.color.toLowerCase());
      }
      return false;
    });
  }

  if (filters.maxPrice) {
    results = results.filter(s => s.price <= filters.maxPrice);
  }

  if (filters.category) {
    results = results.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
  }

  return results;
}

// Placeholder LLM response generator
function generateChatbotResponse(message) {
  const responses = [
    "I can help you find sneakers! Try asking about specific brands like Nike, Jordan, or Adidas.",
    "Looking for something specific? Mention a brand, color, or price range and I'll find it!",
    "Try asking things like 'Show me Nike under $150' or 'Find black Adidas shoes'.",
    "I specialize in sneaker searches. Tell me your brand preference, favorite color, or budget!",
    "Let me help you find the perfect sneakers! Mention a brand, color, or price and I'll search.",
    "Great question! I can search by brand, color, price, or category. What are you looking for?"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Send chat message
function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();

  if (!message) return;

  // Add user message
  addChatMessage(message, true);

  // Clear input
  input.value = '';

  // Parse message
  const filters = parseChatMessage(message);

  // Check if any filters were detected
  const hasFilters = filters.brand || filters.color || filters.maxPrice || filters.category;

  setTimeout(() => {
    if (hasFilters) {
      // Filter sneakers
      const results = filterChatSneakers(filters);

      if (results.length > 0) {
        let responseText = `I found ${results.length} sneaker${results.length > 1 ? 's' : ''} matching your criteria`;

        let filterDesc = [];
        if (filters.brand) filterDesc.push(filters.brand);
        if (filters.category) filterDesc.push(filters.category);
        if (filters.color) filterDesc.push(filters.color);
        if (filters.maxPrice) filterDesc.push(`under $${filters.maxPrice}`);

        if (filterDesc.length > 0) {
          responseText += ` (${filterDesc.join(', ')})`;
        }

        if (results.length > 5) {
          responseText += `. Showing top 5 results:`;
        } else {
          responseText += `:`;
        }

        addChatMessage(responseText, false, results);
      } else {
        addChatMessage("Sorry, I couldn't find any sneakers matching those criteria. Try different filters!", false);
      }
    } else {
      // No filters detected, use generic response
      const llmResponse = generateChatbotResponse(message);
      addChatMessage(llmResponse, false);
    }
  }, 300);
}

// Enter key to send
document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
});