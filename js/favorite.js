document.addEventListener("DOMContentLoaded", () => {
  displayFavoriteRecipes();

  function displayFavoriteRecipes() {
    const favorites = getFavoriteRecipes();
    const favoritesContainer = document.getElementById("favorites-container");

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
      favoritesContainer.innerHTML = "<p>Tidak ada resep favorit saat ini.</p>";
      return;
    }

    favorites.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "favorite-card";

      card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.label}">
          <h3>${recipe.label}</h3>
          <p>${recipe.source}</p>
          <button class="btn-remove-favorite" data-recipe-id="${recipe.uri}">Hapus dari Favorit</button>
          <button class="btn-view-recipe" data-recipe-url="${recipe.url}">Lihat Resep</button>
        `;

      favoritesContainer.appendChild(card);
    });

    const removeFavoriteButtons = document.querySelectorAll(
      ".btn-remove-favorite"
    );
    removeFavoriteButtons.forEach((button) => {
      button.addEventListener("click", removeFromFavorites);
    });

    const viewRecipeButtons = document.querySelectorAll(".btn-view-recipe");
    viewRecipeButtons.forEach((button) => {
      button.addEventListener("click", viewRecipe);
    });
  }

  function removeFromFavorites(event) {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus resep dari favorit?");
    
    if (confirmDelete) {
      const recipeId = event.target.dataset.recipeId;
      let favorites = getFavoriteRecipes();
      favorites = favorites.filter((recipe) => recipe.uri !== recipeId);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displayFavoriteRecipes();
      showAlert("Resep telah dihapus dari Favorit.", "success");
    }
  }
  
  function getFavoriteRecipes() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function viewRecipe(event) {
    const recipeUrl = event.target.dataset.recipeUrl;
    window.open(recipeUrl, "_blank");
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-${type}`;
    alertDiv.appendChild(document.createTextNode(message));
  
    document.body.appendChild(alertDiv);
  
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.backgroundColor = type === "success" ? "green" : "red";
    alertDiv.style.color = "white";
  
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
  
});
