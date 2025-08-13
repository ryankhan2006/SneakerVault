    // In-memory storage instead of localStorage
    let appState = {
      wishlist: [],
      theme: 'light'
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
        category: 'Training',
        brand: 'Reebok',
        audience: 'Women',
        price: 130,
        image: 'https://via.placeholder.com/200x150/9b59b6/white?text=Nano+X2',
        description: 'Versatile training shoe designed for cross-training and gym workouts. Superior stability and flexibility.'
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
        results.innerHTML = '<div class="no-results">No sneakers found for selected filters. Try adjusting your search criteria.</div>';
        return;
      }

      filtered.forEach(shoe => {
        const card = document.createElement('div');
        card.className = 'shoe-card';
        card.innerHTML = `
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${shoe.name}')">
            ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
          </button>
          <img src="${shoe.image}" alt="${shoe.name}" onerror="this.innerHTML='${shoe.name}'" />
          <h3>${shoe.name}</h3>
          <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">${shoe.brand} • ${shoe.category}</p>
          <p style="font-size: 1.2rem; font-weight: bold; color: #007aff;">$${shoe.price}</p>
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
        <button onclick="toggleWishlist('${shoe.name}'); showDetails(${JSON.stringify(shoe).replace(/"/g, '&quot;')})" 
                style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: ${isInWishlist(shoe.name) ? '#e74c3c' : '#007aff'}; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ${isInWishlist(shoe.name) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
        </button>
      `;
      modal.style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('modal').style.display = 'none';
    }

    function clearFilters() {
      document.getElementById('category').value = '';
      document.getElementById('brand').value = '';
      document.getElementById('audience').value = '';
      document.getElementById('sort').value = '';
      searchShoes();
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
        const card = document.createElement('div');
        card.className = 'shoe-card';
        card.innerHTML = `
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${shoe.name}')">
            ${isInWishlist(shoe.name) ? '❤️' : '🤍'}
          </button>
          <img src="${shoe.image}" alt="${shoe.name}" onerror="this.innerHTML='${shoe.name}'" />
          <h3>${shoe.name}</h3>
          <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">${shoe.brand} • ${shoe.category}</p>
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

    // Add event listeners to filters for auto-search
    document.getElementById('category').addEventListener('change', searchShoes);
    document.getElementById('brand').addEventListener('change', searchShoes);
    document.getElementById('audience').addEventListener('change', searchShoes);
    document.getElementById('sort').addEventListener('change', searchShoes);

    // Click outside modal to close
    document.getElementById('modal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });