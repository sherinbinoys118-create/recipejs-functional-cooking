// ------------------ RecipeJS App (IIFE) ------------------
const RecipeApp = (() => {

  const recipes = [
    {
      id: 1,
      title: "Classic Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "A creamy Italian pasta dish.",
      ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black pepper"],
      steps: [
        "Boil pasta",
        "Cook pancetta",
        {
          text: "Prepare sauce",
          substeps: ["Beat eggs with parmesan", "Mix with pancetta"]
        },
        "Combine pasta with sauce",
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      time: 45,
      difficulty: "medium",
      description: "Tender chicken in spiced sauce.",
      ingredients: ["Chicken", "Yogurt", "Garam masala", "Tomato puree", "Cream"],
      steps: [
        "Marinate chicken",
        "Cook chicken",
        {
          text: "Prepare sauce",
          substeps: ["Sauté onions", "Add tomato puree", "Add cream and spices"]
        },
        "Combine chicken with sauce",
        "Serve"
      ]
    },
    {
      id: 3,
      title: "Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh vegetables and feta.",
      ingredients: ["Tomatoes", "Cucumber", "Feta cheese", "Olives", "Olive oil"],
      steps: [
        "Chop vegetables",
        "Mix everything",
        "Drizzle olive oil",
        "Serve fresh"
      ]
    }
  ];

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filters button");
  const sortButtons = document.querySelectorAll(".sorts button");

  let currentFilter = "all";
  let currentSort = "none";

  // Recursive steps renderer
  const renderSteps = (steps) => {
    let html = "<ol>";
    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
      }
    });
    html += "</ol>";
    return html;
  };

  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <p>${recipe.time} min | ${recipe.difficulty}</p>
      <p>${recipe.description}</p>

      <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">Show Steps</button>
      <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">Show Ingredients</button>

      <div class="steps-container" data-id="${recipe.id}" style="display:none;">
        ${renderSteps(recipe.steps)}
      </div>

      <div class="ingredients-container" data-id="${recipe.id}" style="display:none;">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  const filterRecipes = (list, filter) => {
    if (filter === "all") return list;
    if (filter === "quick") return list.filter(r => r.time <= 30);
    return list.filter(r => r.difficulty === filter);
  };

  const sortRecipes = (list, type) => {
    if (type === "name") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (type === "time") return [...list].sort((a, b) => a.time - b.time);
    return list;
  };

  const renderRecipes = (list) => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join("");
  };

  const updateDisplay = () => {
    let result = filterRecipes(recipes, currentFilter);
    result = sortRecipes(result, currentSort);
    renderRecipes(result);
  };

  recipeContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("toggle-btn")) return;

    const id = e.target.dataset.id;
    const type = e.target.dataset.type;

    const container = document.querySelector(`.${type}-container[data-id="${id}"]`);
    const visible = container.style.display === "block";

    container.style.display = visible ? "none" : "block";
    e.target.textContent = visible ? `Show ${type}` : `Hide ${type}`;
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  sortButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sortButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      updateDisplay();
    });
  });

  const init = () => updateDisplay();

  return { init };

})();

RecipeApp.init();
