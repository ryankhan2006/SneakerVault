# SneakerVault

**SneakerVault** is a clean, responsive web app that helps users find sneakers based on brand, category, color, audience, and price. It also features a built-in **SneakerBot** that helps you find the right pair conversationally.

## 🔥 Features


- **Responsive UI** with dark mode toggle
- **Live filters**: Category, Brand, Color (auto-generated), Audience, and Price sort
- **SneakerBot (vanilla JS)** parses brand/color/budget/category queries  
  _Try:_ `nike under $150`, `black adidas`, `men's running`, `lifestyle jordans`
- **Wishlist** (💖) and dedicated wishlist view
- **Reviews & star ratings** with live averages
- **Pagination** for large catalogs
- **CSV data loading** via PapaParse (no framework required)
- **Accessible modals & controls**, keyboard-friendly dropdowns


## 🧰 Tech Stack

- HTML
- CSS (custom styling)
- JavaScript (Vanilla JS logic)
- [PapaParse](https://www.papaparse.com/) fir CSV -> JSON

## 📁 Project Structure

```
SneakerVault/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── code.js             # JavaScript functionality
├── newshoedata.csv     # Sneaker dataset
└── README.md           # Project overview
```

## 🧪 Data Schema (`newshoedata.csv`)

| Column         | Req | Example                     | Notes                                   |
|----------------|:---:|-----------------------------|-----------------------------------------|
| Name           | ✅  | Nike Air Force 1            | Display name                            |
| Category       | ✅  | Basketball / Lifestyle …    | Used by filters                         |
| Brand          | ✅  | Nike / adidas / Jordan …    | Used by filters                         |
| Audience       | ✅  | Men's / Women's / Boys' …   | Used by filters                         |
| Price USD      | ✅  | 129.99                      | Parsed as float                         |
| Image Link     | ✅  | https://…/shoe.jpg          | Card & modal images                     |
| Description    | ✅  | Classic leather upper…      | Modal details                           |
| Color          | —   | Black/White/Varsity Red     | Raw string (informational)              |
| Generic Colors | —   | Black/White                 | **Populates Color dropdown**            |

> Use slash-separated values for `Generic Colors`, e.g. `Black/White/Red`.

## 🚀 Getting Started

1. Clone or download the repo:
   ```bash
   git clone https://github.com/ryankhan2006/SneakerVault.git
   cd SneakerVault
   ```

2. Open `index.html` in your browser to run locally.

No build tools or dependencies required.

## 🖼️ Sample Sneakers Included
- Nike Air Force 1
- Adidas Harden Vol. 6
- Reebok Club C 85
- New Balance 990v5
- Nike Mercurial Vapor

## 📌 To-Do / Future Ideas
- Connect to a real sneaker API
- Add mobile responsiveness

## 📄 License
MIT License — open to use, modify, and share.

---

Made with 💯 for sneaker lovers.
