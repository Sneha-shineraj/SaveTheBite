// Store ingredients temporarily (in a real app, this would be in a database)
let ingredients = [];

// Handle ingredient form submission
document.getElementById('ingredientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ingredient = {
        name: document.getElementById('name').value,
        expire_date: document.getElementById('expire_date').value,
        quantity: document.getElementById('quantity').value
    };

    try {
        const response = await fetch('/save_ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredient)
        });

        const data = await response.json();
        if (data.success) {
            ingredients.push(ingredient);
            updateIngredientsList();
            document.getElementById('responseMessage').textContent = 'Ingredient added successfully!';
            document.getElementById('ingredientForm').reset();
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error adding ingredient: ' + error.message;
    }
});

// Update the displayed list of ingredients
function updateIngredientsList() {
    const list = document.createElement('ul');
    ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = `${ing.name} - Expires: ${ing.expire_date} - Quantity: ${ing.quantity}`;
        list.appendChild(li);
    });

    // Add the list before the form
    const form = document.getElementById('ingredientForm');
    const existingList = document.querySelector('#Expire ul');
    if (existingList) {
        existingList.remove();
    }
    form.parentNode.insertBefore(list, form);
}

// Generate recipe button
const generateRecipeButton = document.createElement('button');
generateRecipeButton.textContent = 'Generate Recipe';
generateRecipeButton.onclick = async () => {
    if (ingredients.length === 0) {
        alert('Please add some ingredients first!');
        return;
    }

    try {
        const response = await fetch('/generate_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients })
        });

        const data = await response.json();
        if (data.success) {
            // Create a formatted display of the recipe
            const recipeSection = document.getElementById('Recipe');
            const recipeDisplay = document.createElement('div');
            recipeDisplay.innerHTML = `
                <div class="recipe-result">
                    <pre>${data.recipe}</pre>
                </div>
            `;
            
            // Remove any existing recipe
            const existingRecipe = recipeSection.querySelector('.recipe-result');
            if (existingRecipe) {
                existingRecipe.remove();
            }
            
            recipeSection.appendChild(recipeDisplay);
        }
    } catch (error) {
        alert('Error generating recipe: ' + error.message);
    }
};

// Add the generate recipe button to the page
document.getElementById('Expire').appendChild(generateRecipeButton);