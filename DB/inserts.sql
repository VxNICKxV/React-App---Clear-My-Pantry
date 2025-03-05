-- insert a new record into the users table in the pantryschema schema.
INSERT INTO pantryschema.users
  (clerk_user_id, email)
VALUES
  ('SOME', 'jc2941211@gmail.com');

INSERT INTO pantryschema.users
  (clerk_user_id, email)
VALUES
  ('1', 'jc2941211@gmail.com');
SELECT *
FROM pantryschema.recipes;
INSERT INTO pantryschema.recipes
  (
  user_id,
  recipe_name,
  img,
  description,
  steps
  )
VALUES
  (
    2,
    'Spinach Salad with Warm Bacon Dressing',
    '/assets/recipeImages/Hassleback-Tomato-Clubs_EXPS227476_SND163615B04_08_4b_RMS.webp',
    'A nice spinach salad for eating',
    '{"Step 1: In a skillet, cook bacon over medium heat until scrisp, stirring occasionally. Using a slotted spoon, remove bacon to paper towels. Disard all but 1 tablespoon drippings",
                "Step 2: Add vinegar, garlic, brown sugar, mustard and seasonings to drippings; heat through, stirring to blend. Transfer to a small bowl; gradually whisk in oil. Stir in half of the bacon.", 
                "Step 3: Place spinach, onion and eggs in a large bowl; toss with warm dressing. Sprinkle with remaining bacon; serve immediately.}'
);
SELECT *
FROM pantryschema.ingredients;
INSERT INTO pantryschema.ingredients
  ( recipe_id,
  ingredients_name,
  category,
  quantity_n_units
  )
VALUES
  (50 , 'Red Wine Vinegar', 'Condiment', '2 tbsp'),
  (50 , 'Garlic', 'Seasoning', '1 clove'),
  (50 , 'Brown Sugar', 'Sweetener', '1/2 tsp'),
  (50 , 'Mustard', 'Condiment', '1/2 tsp'),
  (50 , 'Salt', 'Seasoning', '1/4 tsp'),
  (50 , 'Nutmeg', 'Spice', 'dash'),
  (50 , 'Red Pepper', 'Spice', 'dash'),
  (50 , 'Baby Spinach', 'Leafy Green', '6 ounces'),
  (50 , 'Red Onion', 'Vegetable', 'sliced 1/3 cup'),
  (50 , 'Hard Boiled Egg', 'Protein', '4'),
  (50 , 'Bacon Strips', 'Protein', '3'),
  (50 , 'Olive Oil', 'Oil', '1/4 cup'),
  (50 , 'Pepper', 'Seasoning', 'dash');


SELECT
  r.recipe_id, recipe_name, img, steps, ingredients_id, ingredients_name
FROM
  pantryschema.recipes r
  JOIN
  pantryschema.ingredients i
  on r.recipe_id = i.recipe_id
WHERE 
        r.recipe_id = 118;

INSERT INTO pantryschema.INGREDIENTS
  (Ingredients_Name, Category, RECIPE_ID, Quantity_n_Units)
VALUES
  ('All-Purpose Flour', 'Baking & Grains', 118, '2 cups'),
  ('Fresh Basil Leaves', 'Herbs & Spices', 118, '1/4 cup'),
  ('Unsalted Butter', 'Dairy', 118, '1 stick'),
  ('Red Bell Pepper', 'Vegetables', 118, '2 medium'),
  ('Ground Cinnamon', 'Herbs & Spices', 118, '1 teaspoon'),
  ('Chicken Broth', 'Broths & Stocks', 118, '4 cups'),
  ('Raw Honey', 'Sweeteners', 118, '2 tablespoons'),
  ('Extra Virgin Olive Oil', 'Oils', 118, '3 tablespoons'),
  ('Garlic Cloves', 'Aromatics', 118, '4 cloves'),
  ('Sea Salt', 'Seasonings', 118, '1/2 teaspoon');

select recipe_id
from pantryschema.recipes;

DELETE FROM pantryschema.INGREDIENTS 
WHERE recipe_id IN (116);

DELETE FROM pantryschema.RECIPES 
WHERE RECIPE_ID IN (117);  

