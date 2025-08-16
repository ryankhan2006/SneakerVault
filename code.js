// In-memory storage instead of localStorage
    let appState = {
      wishlist: [],
      theme: 'light',
      reviews: {} // Store reviews by shoe name
    };

    // Sneaker data with category, brand, audience, and price
    const shoeData = [
      {
        name: 'Nike Air Force 1',
        category: 'Casual',
        brand: 'Nike',
        audience: 'Men',
        price: 100,
        image: 'https://via.placeholder.com/200x150/667eea/white?text=Nike+Air+Force+1',
        description: 'Classic and clean casual sneaker perfect for everyday wear. Features premium leather upper and iconic Air-Sole unit for lightweight cushioning.'
      },
      {
        name: 'Adidas Harden Vol. 6',
        category: 'Basketball',
        brand: 'Adidas',
        audience: 'Men',
        price: 140,
        image: 'https://via.placeholder.com/200x150/ff6b6b/white?text=Adidas+Harden',
        description: 'Performance basketball shoe with responsive cushioning and grip. Designed for explosive movements and superior court control.'
      },
      {
        name: 'Reebok Club C 85',
        category: 'Casual',
        brand: 'Reebok',
        audience: 'Women',
        price: 75,
        image: 'https://via.placeholder.com/200x150/4ecdc4/white?text=Reebok+Club+C',
        description: 'Minimalist and retro sneaker suitable for casual outfits. Clean court-inspired design with premium leather construction.'
      },
      {
        name: 'New Balance 990v5',
        category: 'Casual',
        brand: 'New Balance',
        audience: 'Kids',
        price: 90,
        image: 'https://via.placeholder.com/200x150/45b7d1/white?text=New+Balance+990',
        description: 'Premium comfort and durability. Made in USA classic model with superior cushioning and breathable mesh upper.'
      },
      {
        name: 'Nike Mercurial Vapor',
        category: 'Soccer',
        brand: 'Nike',
        audience: 'Men',
        price: 120,
        image: 'https://via.placeholder.com/200x150/f39c12/white?text=Nike+Mercurial',
        description: 'Lightweight soccer cleats built for speed and control. Features innovative traction pattern for optimal performance on the field.'
      },
      {
        name: 'Adidas Stan Smith',
        category: 'Casual',
        brand: 'Adidas',
        audience: 'Women',
        price: 85,
        image: 'https://via.placeholder.com/200x150/27ae60/white?text=Stan+Smith',
        description: 'Iconic tennis shoe with timeless appeal. Clean white leather design with signature green accents.'
      },
      {
        name: 'Nike LeBron 20',
        category: 'Basketball',
        brand: 'Nike',
        audience: 'Men',
        price: 200,
        image: 'https://via.placeholder.com/200x150/e74c3c/white?text=LeBron+20',
        description: 'Elite basketball performance with responsive Zoom Air units. Built for power players who dominate the court.'
      },
      {
        name: 'Reebok Nano X2',
        category: 'Casual',
        brand: 'Reebok',
        audience: 'Women',
        price: 130,
        image: 'https://via.placeholder.com/200x150/9b59b6/white?text=Nano+X2',
        description: 'Versatile training shoe designed for cross-training and gym workouts. Superior stability and flexibility.'
      }
    ];

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

    function setupStarRating(containerId) {
      let selectedRating = 0;
      const stars = document.querySelectorAll(`#${containerId} .interactive-star`);
      
      stars.forEach(star => {
        star.addEventListener('mouseover', function() {
          const rating = parseInt(this.dataset.rating);
          highlightStars(containerId, rating);
        });
        
        star.addEventListener('click', function() {
          selectedRating = parseInt(this.dataset.rating);
          highlightStars(containerId, selectedRating);
        });
      });
      
      document.getElementById(containerId).addEventListener('mouseleave', function() {
        highlightStars(containerId, selectedRating);
      });
      
      return () => selectedRating;
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

    function setupStarRating(containerId) {
      let selectedRating = 0;
      const stars = document.querySelectorAll(`#${containerId} .interactive-star`);
      
      stars.forEach(star => {
        star.addEventListener('mouseover', function() {
          const rating = parseInt(this.dataset.rating);
          highlightStars(containerId, rating);
        });
        
        star.addEventListener('click', function() {
          selectedRating = parseInt(this.dataset.rating);
          highlightStars(containerId, selectedRating);
        });
      });
      
      document.getElementById(containerId).addEventListener('mouseleave', function() {
        highlightStars(containerId, selectedRating);
      });
      
      return () => selectedRating;
    }

    function highlightStars(containerId, rating) {
      const stars = document.querySelectorAll(`#${containerId} .interactive-star`);
      stars.forEach((star, index) => {
        star.style.color = (index + 1) <= rating ? '#ffd700' : '#ddd';
      });
    }

    function searchShoes() {
      const selectedCategories = getCheckedValues('category-options');
      const selectedBrands = getCheckedValues('brand-options');
      const selectedAudiences = getCheckedValues('audience-options');
      const sort = document.getElementById('sort').value;
      const results = document.getElementById('results');
      results.innerHTML = '';

      let filtered = shoeData.filter(shoe => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(shoe.category);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(shoe.brand);
      const audienceMatch = selectedAudiences.length === 0 || selectedAudiences.includes(shoe.audience);
      return categoryMatch && brandMatch && audienceMatch;
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

      filtered.forEach(shoe => {
        const avgRating = getAverageRating(shoe.name);
        const reviewCount = getShoeReviews(shoe.name).length;
        
        const card = document.createElement('div');
        card.className = 'shoe-card';
        card.innerHTML = `
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${shoe.name}')">
            ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
          </button>
          <img src="${shoe.image}" alt="${shoe.name}" onerror="this.innerHTML='${shoe.name}'" />
          <h3>${shoe.name}</h3>
          <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">${shoe.brand} • ${shoe.category}</p>
          <div style="display: flex; align-items: center; justify-content: center; margin: 0.5rem 0;">
            ${avgRating > 0 ? renderStars(avgRating, false, '1rem') : '<span style="color: #999; font-size: 0.9rem;">No reviews yet</span>'}
            ${avgRating > 0 ? `<span style="margin-left: 0.5rem; font-size: 0.9rem; color: #666;">${avgRating} (${reviewCount})</span>` : ''}
          </div>
          <p style="font-size: 1.2rem; font-weight: bold; color: #007aff;">$${shoe.price}</p>`;
        card.onclick = () => showDetails(shoe);
        results.appendChild(card);
  });
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
        
        <button onclick="toggleWishlist('${shoe.name}'); showDetails(${JSON.stringify(shoe).replace(/"/g, '&quot;')})" 
                style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: ${isInWishlist(shoe.name) ? '#e74c3c' : '#007aff'}; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ${isInWishlist(shoe.name) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
        </button>
      `;
      modal.style.display = 'flex';
      
      // Setup interactive star rating after modal is displayed
      setTimeout(() => setupStarRating('star-rating'), 100);
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

    function submitReview(shoeName) {
      const getRating = setupStarRating('star-rating');
      const rating = getRating();
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
      // Re-render current view
      const results = document.getElementById('results');
      if (results.innerHTML.includes('Your wishlist')) {
        showWishlist();
      } else {
        searchShoes();
      }
    }

    function showWishlist() {
      const wishlist = getWishlist();
      const results = document.getElementById('results');
      results.innerHTML = '';

      const favoritedShoes = shoeData.filter(shoe => wishlist.includes(shoe.name));

      if (favoritedShoes.length === 0) {
        results.innerHTML = '<div class="no-results">Your wishlist is empty. ❤️<br><button onclick="searchShoes()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007aff; color: white; border: none; border-radius: 6px; cursor: pointer;">Browse Sneakers</button></div>';
        return;
      }

      // Add wishlist header
      const header = document.createElement('div');
      header.style.width = '100%';
      header.style.textAlign = 'center';
      header.style.marginBottom = '1rem';
      header.innerHTML = `
        <h2 style="color: #007aff; margin-bottom: 0.5rem;">💖 Your Wishlist (${favoritedShoes.length})</h2>
        <button onclick="searchShoes()" style="padding: 0.5rem 1rem; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer;">← Back to Browse</button>
      `;
      results.appendChild(header);

      favoritedShoes.forEach(shoe => {
        const avgRating = getAverageRating(shoe.name);
        const reviewCount = getShoeReviews(shoe.name).length;
        
        const card = document.createElement('div');
        card.className = 'shoe-card';
        card.innerHTML = `
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${shoe.name}')">
            ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
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
      searchShoes(); // Load all shoes initially
    };

    ['category-options', 'brand-options', 'audience-options'].forEach(id => {
      document.querySelectorAll(`#${id} input[type="checkbox"]`).forEach(cb => {
        cb.addEventListener('change', searchShoes);
      });
    });

    document.getElementById('sort').addEventListener('change', searchShoes);
    

    // Click outside modal to close
    document.getElementById('modal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });