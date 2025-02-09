document.addEventListener('DOMContentLoaded', () => {
    const ingredientForm = document.getElementById('ingredientForm');
    const recipeResult = document.getElementById('recipeResult');

    // Handle ingredient form submission
    ingredientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const expireDate = document.getElementById('expire_date').value;
        const quantity = document.getElementById('quantity').value;

        if (!name || !expireDate || !quantity) {
            updateResponseMessage('All fields are required!', 'red');
            return;
        }

        try {
            // Save ingredient data to the backend
            const saveResponse = await fetch('http://127.0.0.1:5000/save_ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, expire_date: expireDate, quantity })
            });

            const saveData = await saveResponse.json();

            if (!saveData.success) {
                updateResponseMessage('Error saving ingredient!', 'red');
                return;
            }

            updateResponseMessage(`Ingredient "${name}" added successfully!`, 'green');

            // Fetch a generated recipe using saved ingredients
            const recipeResponse = await fetch('http://127.0.0.1:5000/generate_recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredients: [{ name, expire_date: expireDate, quantity }]
                })
            });

            const recipeData = await recipeResponse.json();

            if (recipeData.success) {
                recipeResult.innerHTML = `<pre>${recipeData.recipe}</pre>`;
            } else {
                recipeResult.innerHTML = `<p style="color: red;">Error generating recipe: ${recipeData.error}</p>`;
            }

            ingredientForm.reset();
        } catch (error) {
            updateResponseMessage('Server error. Please try again!', 'red');
        }
    });

    // Function to update response messages
    function updateResponseMessage(message, color) {
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.innerText = message;
        responseMessage.style.color = color;
    }
});
