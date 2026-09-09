import risotto from "@/assets/recipe-risotto.jpg";
import harissaChicken from "@/assets/recipe-harissa-chicken.jpg";
import peaSoup from "@/assets/recipe-pea-soup.jpg";
import sourdough from "@/assets/recipe-sourdough.jpg";
import brownies from "@/assets/recipe-brownies.jpg";
import tomatoSalad from "@/assets/recipe-tomato-salad.jpg";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

export type Step = {
  title: string;
  description: string;
  duration: string;
};

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  image: string;
  author: { name: string; role: string; initials: string };
  category: string;
  tags: string[];
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  rating: number;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
};

export const categories = [
  { name: "Breakfast", slug: "breakfast", icon: "EggFried", count: 42, blurb: "Slow mornings, fast pans" },
  { name: "Pasta & Rice", slug: "pasta-rice", icon: "Wheat", count: 68, blurb: "Comfort by the bowlful" },
  { name: "Grill & Roast", slug: "grill-roast", icon: "Flame", count: 35, blurb: "Char, smoke and crust" },
  { name: "Soups", slug: "soups", icon: "Soup", count: 27, blurb: "Simmered and spoonable" },
  { name: "Salads", slug: "salads", icon: "Salad", count: 51, blurb: "Crunch with intention" },
  { name: "Baking", slug: "baking", icon: "Croissant", count: 39, blurb: "Flour, patience, steam" },
  { name: "Desserts", slug: "desserts", icon: "CakeSlice", count: 46, blurb: "The sweet finish" },
  { name: "Drinks", slug: "drinks", icon: "CupSoda", count: 23, blurb: "Shaken, steeped, poured" },
];

export const units = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "piece", "pinch", "clove"];

export const recipes: Recipe[] = [
  {
    slug: "saffron-parmesan-risotto",
    title: "Saffron & Parmesan Risotto",
    description:
      "A slow-stirred Milanese risotto with bone-marrow depth, bloomed saffron and a glossy parmesan finish.",
    image: risotto,
    author: { name: "Marta Bellini", role: "Head Chef, Osteria Nove", initials: "MB" },
    category: "Pasta & Rice",
    tags: ["Italian", "Vegetarian", "Comfort"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    rating: 4.8,
    ingredients: [
      { name: "Carnaroli rice", quantity: "320", unit: "g" },
      { name: "Warm chicken stock", quantity: "1.2", unit: "l" },
      { name: "Saffron threads", quantity: "1", unit: "pinch" },
      { name: "Shallot, finely diced", quantity: "1", unit: "piece" },
      { name: "Dry white wine", quantity: "120", unit: "ml" },
      { name: "Parmigiano Reggiano, grated", quantity: "80", unit: "g" },
      { name: "Cold butter, cubed", quantity: "60", unit: "g" },
    ],
    steps: [
      {
        title: "Bloom the saffron",
        description: "Steep the saffron threads in a ladle of warm stock until the liquid turns deep amber.",
        duration: "5 min",
      },
      {
        title: "Sweat the shallot",
        description: "Cook the shallot in butter over low heat until translucent, never coloured.",
        duration: "6 min",
      },
      {
        title: "Toast the rice",
        description: "Add the rice and stir until the grains are hot and the edges look glassy, then deglaze with wine.",
        duration: "4 min",
      },
      {
        title: "Ladle and stir",
        description: "Add stock one ladle at a time, stirring constantly and waiting for each addition to absorb.",
        duration: "18 min",
      },
      {
        title: "Mantecare",
        description: "Off the heat, beat in cold butter and parmesan until the risotto ripples like lava on the plate.",
        duration: "2 min",
      },
    ],
    nutrition: { calories: 540, protein: 16, carbs: 72, fat: 19 },
  },
  {
    slug: "harissa-roast-chicken",
    title: "Charred Harissa Chicken",
    description:
      "Yoghurt-marinated thighs lacquered in rose harissa, blistered under high heat and finished with lemon.",
    image: harissaChicken,
    author: { name: "Youssef Amrani", role: "Recipe Developer", initials: "YA" },
    category: "Grill & Roast",
    tags: ["North African", "High Protein", "Weeknight"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    rating: 4.9,
    ingredients: [
      { name: "Chicken thighs, bone-in", quantity: "8", unit: "piece" },
      { name: "Rose harissa", quantity: "3", unit: "tbsp" },
      { name: "Greek yoghurt", quantity: "150", unit: "g" },
      { name: "Garlic, crushed", quantity: "4", unit: "clove" },
      { name: "Ground cumin", quantity: "1", unit: "tsp" },
      { name: "Lemon", quantity: "1", unit: "piece" },
      { name: "Coriander leaves", quantity: "1", unit: "cup" },
    ],
    steps: [
      {
        title: "Build the marinade",
        description: "Whisk harissa, yoghurt, garlic, cumin and lemon zest into a thick rust-coloured paste.",
        duration: "5 min",
      },
      {
        title: "Marinate",
        description: "Coat the thighs, working the paste under the skin. Rest in the fridge, uncovered.",
        duration: "2 hrs",
      },
      {
        title: "Roast hot",
        description: "Roast at 220°C on a wire rack so the fat renders and the skin crisps evenly.",
        duration: "30 min",
      },
      {
        title: "Char and rest",
        description: "Flash under the grill for colour, then rest and shower with lemon juice and coriander.",
        duration: "8 min",
      },
    ],
    nutrition: { calories: 610, protein: 48, carbs: 9, fat: 41 },
  },
  {
    slug: "pea-and-mint-soup",
    title: "Sweet Pea & Mint Soup",
    description: "A fifteen-minute spring soup, blitzed silky and lifted with crème fraîche and torn mint.",
    image: peaSoup,
    author: { name: "Hannah Fields", role: "Food Writer", initials: "HF" },
    category: "Soups",
    tags: ["Vegetarian", "Spring", "30 Minutes"],
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 12,
    servings: 4,
    rating: 4.6,
    ingredients: [
      { name: "Frozen peas", quantity: "600", unit: "g" },
      { name: "Vegetable stock", quantity: "800", unit: "ml" },
      { name: "Leek, sliced", quantity: "1", unit: "piece" },
      { name: "Mint leaves", quantity: "1", unit: "cup" },
      { name: "Crème fraîche", quantity: "4", unit: "tbsp" },
      { name: "Olive oil", quantity: "2", unit: "tbsp" },
    ],
    steps: [
      { title: "Soften the leek", description: "Cook the leek in olive oil with a pinch of salt until sweet.", duration: "6 min" },
      { title: "Simmer the peas", description: "Add stock and peas, bring to a boil and cook only until bright green.", duration: "4 min" },
      { title: "Blend", description: "Blitz with mint until completely smooth, then pass through a sieve.", duration: "3 min" },
      { title: "Finish", description: "Swirl in crème fraîche, crack over black pepper and serve immediately.", duration: "1 min" },
    ],
    nutrition: { calories: 240, protein: 12, carbs: 26, fat: 10 },
  },
  {
    slug: "country-sourdough",
    title: "Everyday Country Sourdough",
    description: "An open-crumb country loaf built on a lively starter, a long cold proof and a screaming hot pot.",
    image: sourdough,
    author: { name: "Peter Lund", role: "Baker, Mill & Stone", initials: "PL" },
    category: "Baking",
    tags: ["Bread", "Slow", "Vegan"],
    difficulty: "Hard",
    prepTime: 40,
    cookTime: 45,
    servings: 8,
    rating: 4.7,
    ingredients: [
      { name: "Strong white flour", quantity: "450", unit: "g" },
      { name: "Wholemeal flour", quantity: "50", unit: "g" },
      { name: "Water at 28°C", quantity: "360", unit: "ml" },
      { name: "Active starter", quantity: "100", unit: "g" },
      { name: "Fine sea salt", quantity: "10", unit: "g" },
    ],
    steps: [
      { title: "Autolyse", description: "Mix flours and water, rest so the flour hydrates fully before salt goes in.", duration: "45 min" },
      { title: "Bulk ferment", description: "Add starter and salt, then perform four sets of stretch and folds.", duration: "4 hrs" },
      { title: "Shape and chill", description: "Pre-shape, bench rest, then shape tight and cold proof overnight.", duration: "12 hrs" },
      { title: "Bake", description: "Bake covered in a preheated dutch oven, then uncovered until deeply blistered.", duration: "45 min" },
    ],
    nutrition: { calories: 210, protein: 7, carbs: 43, fat: 1 },
  },
  {
    slug: "tahini-dark-chocolate-brownies",
    title: "Tahini Dark Chocolate Brownies",
    description: "Fudgy 70% brownies rippled with tahini and finished with flaky salt for a bitter-sweet edge.",
    image: brownies,
    author: { name: "Noor Haddad", role: "Pastry Chef", initials: "NH" },
    category: "Desserts",
    tags: ["Chocolate", "Bakes", "Crowd Pleaser"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 25,
    servings: 12,
    rating: 4.9,
    ingredients: [
      { name: "Dark chocolate 70%", quantity: "200", unit: "g" },
      { name: "Butter", quantity: "180", unit: "g" },
      { name: "Caster sugar", quantity: "220", unit: "g" },
      { name: "Eggs", quantity: "3", unit: "piece" },
      { name: "Plain flour", quantity: "90", unit: "g" },
      { name: "Tahini", quantity: "4", unit: "tbsp" },
      { name: "Flaky sea salt", quantity: "1", unit: "pinch" },
    ],
    steps: [
      { title: "Melt", description: "Melt chocolate and butter together over a low bain-marie until glossy.", duration: "6 min" },
      { title: "Whip the eggs", description: "Beat eggs and sugar to a pale, thick ribbon — this makes the shiny crust.", duration: "5 min" },
      { title: "Fold", description: "Fold in the chocolate, then the flour, stopping the moment it disappears.", duration: "3 min" },
      { title: "Ripple and bake", description: "Spoon tahini over the batter, swirl once, salt and bake until just set.", duration: "25 min" },
    ],
    nutrition: { calories: 320, protein: 5, carbs: 33, fat: 20 },
  },
  {
    slug: "heirloom-tomato-burrata-salad",
    title: "Heirloom Tomato & Burrata",
    description: "Peak-season tomatoes, salted early, with torn burrata, basil oil and a crack of pepper.",
    image: tomatoSalad,
    author: { name: "Hannah Fields", role: "Food Writer", initials: "HF" },
    category: "Salads",
    tags: ["Summer", "No Cook", "Vegetarian"],
    difficulty: "Easy",
    prepTime: 12,
    cookTime: 0,
    servings: 2,
    rating: 4.5,
    ingredients: [
      { name: "Heirloom tomatoes", quantity: "600", unit: "g" },
      { name: "Burrata", quantity: "1", unit: "piece" },
      { name: "Basil leaves", quantity: "1", unit: "cup" },
      { name: "Extra virgin olive oil", quantity: "3", unit: "tbsp" },
      { name: "Red wine vinegar", quantity: "1", unit: "tsp" },
      { name: "Flaky sea salt", quantity: "1", unit: "pinch" },
    ],
    steps: [
      { title: "Salt the tomatoes", description: "Slice thickly, salt and leave to weep so the flavour concentrates.", duration: "10 min" },
      { title: "Blitz basil oil", description: "Blend basil with olive oil, then strain into a bright green oil.", duration: "4 min" },
      { title: "Assemble", description: "Layer tomatoes, tear burrata over the top, spoon on basil oil and vinegar.", duration: "3 min" },
    ],
    nutrition: { calories: 380, protein: 14, carbs: 14, fat: 30 },
  },
];

export const getRecipe = (slug: string) => recipes.find((r) => r.slug === slug);

export const totalTime = (r: Recipe) => r.prepTime + r.cookTime;
