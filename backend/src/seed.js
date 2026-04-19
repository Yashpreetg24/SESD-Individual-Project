const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diet_planner');
    console.log('DB Connected for seeding');

    await Food.deleteMany();

    const foods = [
      { name: 'Oatmeal', calories: 150, protein: 5 },
      { name: 'Chicken Breast (100g)', calories: 165, protein: 31 },
      { name: 'Brown Rice (1 cup)', calories: 216, protein: 5 },
      { name: 'Broccoli (1 cup)', calories: 55, protein: 4 },
      { name: 'Eggs (2 large)', calories: 140, protein: 12 },
      { name: 'Greek Yogurt', calories: 100, protein: 17 },
      { name: 'Almonds (1 oz)', calories: 164, protein: 6 },
      { name: 'Protein Shake', calories: 120, protein: 24 },
      { name: 'Salmon (100g)', calories: 206, protein: 22 },
      { name: 'Banana', calories: 105, protein: 1 },
      { name: 'Sweet Potato (1 medium)', calories: 103, protein: 2 },
      { name: 'Quinoa (1 cup)', calories: 222, protein: 8 },
      { name: 'Lentils (1 cup)', calories: 230, protein: 18 },
      { name: 'Tuna in Water (1 can)', calories: 130, protein: 29 },
      { name: 'Cottage Cheese (1 cup)', calories: 220, protein: 28 },
      { name: 'Spinach (1 cup)', calories: 7, protein: 1 },
      { name: 'Apple (1 medium)', calories: 95, protein: 0 },
      { name: 'Black Beans (1 cup)', calories: 227, protein: 15 },
      { name: 'Whole Wheat Bread (1 slice)', calories: 70, protein: 4 },
      { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8 },
      { name: 'Avocado (1 medium)', calories: 234, protein: 3 },
      { name: 'Tofu (100g)', calories: 76, protein: 8 },
      { name: 'Edamame (1 cup)', calories: 188, protein: 18 },
      { name: 'Chia Seeds (2 tbsp)', calories: 138, protein: 5 },
      { name: 'Walnuts (1 oz)', calories: 185, protein: 4 },
      { name: 'Whole Milk (1 cup)', calories: 149, protein: 8 },
      { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0 },
      { name: 'Blueberries (1 cup)', calories: 84, protein: 1 },
      { name: 'Lean Beef (100g)', calories: 250, protein: 26 },
      { name: 'Turkey Breast (100g)', calories: 114, protein: 24 },
      { name: 'Premium Ribeye Steak (250g)', calories: 730, protein: 60 },
      { name: 'Double Cheeseburger', calories: 850, protein: 42 },
      { name: 'Large Pepperoni Pizza Slice', calories: 350, protein: 14 },
      { name: 'Mass Gainer Shake', calories: 1250, protein: 55 },
      { name: 'Fried Chicken Breast', calories: 400, protein: 32 },
      { name: 'Pasta Carbonara (Large Bowl)', calories: 800, protein: 28 },
      { name: 'Loaded Nachos', calories: 650, protein: 18 },
      { name: 'Macaroni and Cheese (Large)', calories: 500, protein: 20 },
      { name: 'Chocolate Milkshake (Large)', calories: 650, protein: 15 },
      { name: 'Peanut Butter (1/2 cup)', calories: 750, protein: 30 }
    ];

    await Food.insertMany(foods);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedFoods();
