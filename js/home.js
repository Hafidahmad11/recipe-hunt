document.addEventListener("DOMContentLoaded", () => {
  const heroLeft = document.querySelector(".hero-left");
  const heroRight = document.querySelector(".hero-right");

  setTimeout(() => {
    heroLeft.classList.add("show");
    heroRight.classList.add("show");
  }, 300);

  const searchButton = document.querySelector(".btn-search");
  searchButton.addEventListener("click", searchRecipes);

  const ingredientButton = document.getElementById("search-ingredient");
  ingredientButton.addEventListener("click", searchByIngredients);

  async function searchRecipes() {
    const query = document.getElementById("recipe-search").value;
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; 

    if (!query) {
      showAlert("Silakan masukkan kata kunci pencarian.", "error");
      return;
    }

    resultsContainer.innerHTML = "<div class='loader'></div>";

    const appId = "400c6f53";
    const appKey = "b93ff95fb16c4f1c1da6b49dbc3f38e0";
    const apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&to=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits.length > 0) {
        resultsContainer.innerHTML = "";
        data.hits.forEach((hit) => {
          const recipe = hit.recipe;
          const card = document.createElement("div");
          card.className = "result-card";
          card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <p>${recipe.source}</p>
            <a class="btn-add-favorite" data-recipe="${escape(JSON.stringify(recipe))}">Tambahkan ke Favorit</a>
            <a href="${recipe.url}" target="_blank">Lihat Resep</a>
          `;
          resultsContainer.appendChild(card);
        });
      } else {
        resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
      }

      const addFavoriteButtons = document.querySelectorAll(".btn-add-favorite");
      addFavoriteButtons.forEach((button) => {
        button.addEventListener("click", addToFavorites);
      });
    } catch (error) {
      console.error("Error fetching the API:", error);
      resultsContainer.innerHTML = "<p>Terjadi kesalahan saat mengambil data.</p>";
    }
  }

  async function searchByIngredients() {
    const ingredients = document.getElementById("ingredient-input").value;
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; 

    if (!ingredients) {
      showAlert("Silakan masukkan bahan.", "error");
      return;
    }

    resultsContainer.innerHTML = "<div class='loader'></div>";

    const appId = "400c6f53";
    const appKey = "b93ff95fb16c4f1c1da6b49dbc3f38e0";
    const apiUrl = `https://api.edamam.com/search?q=${ingredients}&app_id=${appId}&app_key=${appKey}&to=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits.length > 0) {
        resultsContainer.innerHTML = ""; 
        data.hits.forEach((hit) => {
          const recipe = hit.recipe;
          const card = document.createElement("div");
          card.className = "result-card";
          card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <p>${recipe.source}</p>
            <a class="btn-add-favorite" data-recipe="${escape(JSON.stringify(recipe))}">Tambahkan ke Favorit</a>
            <a href="${recipe.url}" target="_blank">Lihat Resep</a>
          `;
          resultsContainer.appendChild(card);
        });
      } else {
        resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
      }

      const addFavoriteButtons = document.querySelectorAll(".btn-add-favorite");
      addFavoriteButtons.forEach((button) => {
        button.addEventListener("click", addToFavorites);
      });
    } catch (error) {
      console.error("Error fetching the API:", error);
      resultsContainer.innerHTML = "<p>Terjadi kesalahan saat mengambil data.</p>";
    }
  }

  function addToFavorites(event) {
    const recipeData = JSON.parse(unescape(event.target.dataset.recipe));
    const favorites = getFavoriteRecipes();

    const existingRecipeIndex = favorites.findIndex(
      (recipe) => recipe.label === recipeData.label
    );
    if (existingRecipeIndex === -1) {
      favorites.push(recipeData);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      showAlert("Resep berhasil di tambahkan.", "success");
    } else {
      showAlert("Resep sudah ada di Favorit.", "error");
    }
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-${type}`;
    alertDiv.appendChild(document.createTextNode(message));

    const mainContainer = document.querySelector(".main-container");
    mainContainer.appendChild(alertDiv);

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.backgroundColor = type === "success" ? "green" : "red";
    alertDiv.style.color = "white";
    alertDiv.style.zIndex = "9999";

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  function getFavoriteRecipes() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }
});
