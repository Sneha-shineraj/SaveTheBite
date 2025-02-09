from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})

# Configure Gemini API
genai.configure(api_key='AIzaSyCluLykCgMUbh8BiEdiX52vXZuwBX5vvPA')  # Replace with your Gemini API key

try:
    model=genai.GenerativeModel("gemini-pro")
    response=model.generate_content("Hello!")
    print("Api works", response.text)
except Exception as e:
    print("Error")
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    try:
        data = request.get_json()
        ingredients = data.get('ingredients', [])

        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        # Format ingredients for the prompt
        ingredients_text = '\n'.join([
            f"- {ing['name']} (Expires: {ing['expire_date']}, Quantity: {ing['quantity']})"
            for ing in ingredients
        ])

        # Create prompt for Gemini API
        prompt = f"""
        Generate a creative and detailed recipe using some or all of these ingredients:
        {ingredients_text}

        Please provide the recipe in the following format:
        
        Recipe Name:
        Servings:
        Preparation Time:
        Cooking Time:
        Difficulty Level:

        Ingredients Used:
        (List with quantities)

        Instructions:
        (Detailed step-by-step instructions)

        Tips:
        (Any helpful cooking tips or substitutions)

        Focus on using ingredients that expire soonest first. Make the recipe practical and easy to follow.
        """

        # Generate recipe using Gemini API
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        print("response is:", response.text)
        return jsonify({
            'success': True,
            'recipe': response.text
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/save_ingredients', methods=['POST'])
def save_ingredients():
    try:
        data = request.get_json()
        name = data.get('name')
        expire_date = data.get('expire_date')
        quantity = data.get('quantity')

        # Simulating saving to a database (not implemented)
        return jsonify({
            'success': True,
            'ingredient': {
                'name': name,
                'expire_date': expire_date,
                'quantity': quantity
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if _name_ == '_main_':
    app.run(host='0.0.0.0', port=10000)
