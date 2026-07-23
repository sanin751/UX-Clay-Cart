const fs = require('fs');
const path = require('path');
require('../config/env');
const { connectDB, disconnectDB } = require('../config/db');
const logger = require('./logger');
const { User, Category, Product } = require('../models');

// Category -> pool of real product photos (sourced from Unsplash, tracked in
// src/seed-assets/products/). Products in the same category cycle through
// their pool so the catalog has visual variety without needing a unique
// photo per product.
const CATEGORY_IMAGES = {
  Vases: ['vase-1.jpg', 'vase-2.jpg', 'vase-3.jpg'],
  Bowls: ['bowl-1.jpg', 'bowl-2.jpg', 'bowl-3.jpg'],
  Mugs: ['mug-1.jpg', 'mug-2.jpg', 'mug-3.jpg'],
  Plates: ['plate-1.jpg', 'plate-2.jpg', 'plate-3.jpg', 'plate-4.jpg'],
  Pots: ['pot-1.jpg', 'pot-2.jpg', 'pot-3.jpg'],
  Decor: ['decor-1.jpg', 'decor-2.jpg'],
  'Tea Sets': ['teaset-1.jpg', 'teaset-2.jpg'],
};

const SEED_ASSETS_DIR = path.join(__dirname, '../seed-assets/products');
const UPLOADS_DIR = path.join(__dirname, '../../uploads/products');

function copySeedImages() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const files = new Set(Object.values(CATEGORY_IMAGES).flat());
  for (const file of files) {
    fs.copyFileSync(path.join(SEED_ASSETS_DIR, file), path.join(UPLOADS_DIR, file));
  }
}

const categories = [
  { name: 'Vases', description: 'Decorative hand-thrown clay vases' },
  { name: 'Bowls', description: 'Handmade clay bowls' },
  { name: 'Mugs', description: 'Clay mugs and cups' },
  { name: 'Plates', description: 'Ceramic plates and dinnerware' },
  { name: 'Pots', description: 'Clay pots and planters' },
  { name: 'Decor', description: 'Ceramic home decor pieces' },
  { name: 'Tea Sets', description: 'Handmade ceramic tea and coffee sets' },
];

function productsFor(categoryMap) {
  const imageCounters = {};
  function nextImage(categoryName) {
    const pool = CATEGORY_IMAGES[categoryName];
    const i = imageCounters[categoryName] || 0;
    imageCounters[categoryName] = i + 1;
    return `/uploads/products/${pool[i % pool.length]}`;
  }

  return [
    {
      name: 'Earthen Tall Vase',
      description:
        'A striking tall vase thrown from stoneware clay and finished in a matte charcoal glaze. A quiet, sculptural statement for any room.',
      price: 1200,
      stock: 12,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Stoneware',
      dimensions: '12" H x 5" W',
      weight: '2.4 lbs',
      glazeType: 'Matte Charcoal',
      colors: ['Charcoal'],
      tags: ['Handmade'],
    },
    {
      name: 'Terracotta Orb',
      description:
        'An unglazed terracotta vessel that celebrates the natural warmth of raw clay. Left unglazed to highlight the iron-rich texture of the earth.',
      price: 850,
      stock: 18,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Terracotta',
      dimensions: '8" H x 9" W',
      weight: '3.1 lbs',
      glazeType: 'Unglazed Natural',
      colors: ['Terracotta'],
      tags: ['Sustainable'],
    },
    {
      name: 'Alpine Vessel',
      description:
        'A sculptural stoneware vessel with a satin eggshell finish, hand-thrown in small batches as part of a limited seasonal run.',
      price: 1450,
      stock: 6,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Stoneware',
      dimensions: '10" H x 6" W',
      weight: '2.8 lbs',
      glazeType: 'Satin Eggshell',
      colors: ['Off White'],
      tags: ['Limited Edition'],
    },
    {
      name: 'Dune Sculptural Vase',
      description: 'A softly rounded, sand-toned vase with a speckled matte finish inspired by desert dunes.',
      price: 1000,
      stock: 14,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Stoneware',
      dimensions: '9" H x 6" W',
      weight: '2.2 lbs',
      glazeType: 'Speckled Matte',
      colors: ['Sand', 'Off White'],
      tags: ['Sustainable'],
    },
    {
      name: 'Minimalist Tall Vase',
      description: 'A slender terracotta vase with clean, minimal lines, perfect for a single stem or dried grasses.',
      price: 820,
      stock: 16,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Terracotta',
      dimensions: '11" H x 4" W',
      weight: '1.9 lbs',
      glazeType: 'Unglazed Natural',
      colors: ['Terracotta'],
      tags: [],
    },
    {
      name: 'Iridescent Porcelain Vase',
      description: 'A luminous porcelain vase finished with a subtle iridescent glaze that shifts in the light.',
      price: 2500,
      stock: 5,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Porcelain',
      dimensions: '13" H x 5" W',
      weight: '2.6 lbs',
      glazeType: 'Iridescent',
      colors: ['Pearl'],
      tags: ['New Arrival'],
    },
    {
      name: 'Olive Glazed Vase',
      description: 'A gently tapered vase finished in a rich olive-green glaze that pools softly at the base.',
      price: 640,
      stock: 20,
      category: categoryMap.Vases,
      images: [nextImage('Vases')],
      material: 'Stoneware',
      dimensions: '9" H x 4" W',
      weight: '2.0 lbs',
      glazeType: 'Olive Gloss',
      colors: ['Olive Green'],
      tags: ['Sustainable'],
    },
    {
      name: 'Artisanal Terra Bowl',
      description: 'A generously sized terracotta bowl with a soft matte finish, ideal as a centerpiece or fruit bowl.',
      price: 640,
      stock: 15,
      category: categoryMap.Bowls,
      images: [nextImage('Bowls')],
      material: 'Terracotta',
      dimensions: '4" H x 10" W',
      weight: '1.8 lbs',
      glazeType: 'Matte Finish',
      colors: ['Terracotta'],
      tags: ['Handmade'],
    },
    {
      name: 'Minimalist Stoneware Bowls',
      description: 'A set of two nesting stoneware bowls with a smooth, understated glaze, perfect for everyday use.',
      price: 1200,
      stock: 22,
      category: categoryMap.Bowls,
      images: [nextImage('Bowls')],
      material: 'Stoneware',
      dimensions: '3" H x 7" W',
      weight: '1.2 lbs',
      glazeType: 'Satin Grey',
      colors: ['Charcoal', 'Off White'],
      tags: [],
    },
    {
      name: 'Sage Moss Pasta Plate',
      description: 'A shallow pasta plate glazed in a mottled sage-moss finish, rimmed for easy serving.',
      price: 420,
      stock: 25,
      category: categoryMap.Plates,
      images: [nextImage('Plates')],
      material: 'Stoneware',
      dimensions: '1.5" H x 9" W',
      weight: '1.1 lbs',
      glazeType: 'Mottled Sage',
      colors: ['Sage'],
      tags: [],
    },
    {
      name: 'Clay Mixing Bowl',
      description: 'A sturdy speckled mixing bowl for the kitchen counter, equally at home serving salads at the table.',
      price: 420,
      stock: 20,
      category: categoryMap.Bowls,
      images: [nextImage('Bowls')],
      material: 'Stoneware',
      dimensions: '4" H x 8" W',
      weight: '1.6 lbs',
      glazeType: 'Speckled Cream',
      colors: ['Cream'],
      tags: [],
    },
    {
      name: 'Earthbound Pasta Bowl',
      description: 'A deep, earth-toned pasta bowl with a hand-thrown rim and warm terracotta glaze.',
      price: 2400,
      stock: 10,
      category: categoryMap.Bowls,
      images: [nextImage('Bowls')],
      material: 'Terracotta',
      dimensions: '2" H x 8" W',
      weight: '1.4 lbs',
      glazeType: 'Terracotta Gloss',
      colors: ['Terracotta'],
      tags: ['Handmade'],
    },
    {
      name: 'Muted Gold Accent Plate',
      description: 'A decorative accent plate finished in a warm, muted gold glaze with hand-etched ring detailing.',
      price: 380,
      stock: 18,
      category: categoryMap.Plates,
      images: [nextImage('Plates')],
      material: 'Stoneware',
      dimensions: '1" H x 10" W',
      weight: '1.3 lbs',
      glazeType: 'Muted Gold',
      colors: ['Gold'],
      tags: [],
    },
    {
      name: 'Earthbound Mug Set',
      description: 'A set of four mugs in varying warm earth tones, each thrown and glazed individually.',
      price: 1100,
      stock: 14,
      category: categoryMap.Mugs,
      images: [nextImage('Mugs')],
      material: 'Stoneware',
      dimensions: '4" H x 3" W',
      weight: '0.9 lbs',
      glazeType: 'Mixed Earth Tones',
      colors: ['Terracotta', 'Cream', 'Olive Green'],
      tags: [],
    },
    {
      name: 'Oatmeal Speckle Mug',
      description: 'A cozy speckled mug in a soft oatmeal glaze, sized generously for your morning ritual.',
      price: 1850,
      stock: 20,
      category: categoryMap.Mugs,
      images: [nextImage('Mugs')],
      material: 'Stoneware',
      dimensions: '4" H x 3.5" W',
      weight: '0.8 lbs',
      glazeType: 'Speckled Oatmeal',
      colors: ['Oatmeal'],
      tags: ['Sustainable'],
    },
    {
      name: 'Minimalist Mug Set',
      description: 'A pared-back set of two mugs with a smooth satin glaze, designed for daily use.',
      price: 4125,
      stock: 16,
      category: categoryMap.Mugs,
      images: [nextImage('Mugs')],
      material: 'Stoneware',
      dimensions: '3.5" H x 3" W',
      weight: '0.8 lbs',
      glazeType: 'Satin Grey',
      colors: ['Charcoal'],
      tags: [],
    },
    {
      name: 'Artisan Terracotta Coffee Set',
      description:
        'Crafted from the rich, iron-heavy clay of the high plateau, each piece in this coffee set is thrown by hand and fired in a traditional wood-kiln. The result is a tactile, breathing vessel that holds heat perfectly.',
      price: 2500,
      stock: 8,
      category: categoryMap['Tea Sets'],
      images: [nextImage('Tea Sets')],
      material: 'Ceramic',
      dimensions: '20cm H',
      weight: '3.4 lbs',
      glazeType: 'Reactive Glaze',
      colors: ['Terracotta', 'Olive Green', 'Off White'],
      tags: ['Handmade Collection'],
    },
    {
      name: 'Terracotta Tea Set',
      description: 'A classic terracotta tea set with a golden handle, comprising a teapot and two matching cups.',
      price: 850,
      stock: 10,
      category: categoryMap['Tea Sets'],
      images: [nextImage('Tea Sets')],
      material: 'Terracotta',
      dimensions: '6" H x 8" W',
      weight: '2.5 lbs',
      glazeType: 'Gloss Terracotta',
      colors: ['Terracotta'],
      tags: ['Handmade'],
    },
    {
      name: 'Midnight Tea Ritual Set',
      description: 'A striated charcoal tea set with a warm brass handle, designed for a slow, intentional tea ritual.',
      price: 860,
      stock: 9,
      category: categoryMap['Tea Sets'],
      images: [nextImage('Tea Sets')],
      material: 'Stoneware',
      dimensions: '7" H x 6" W',
      weight: '2.7 lbs',
      glazeType: 'Striated Charcoal',
      colors: ['Charcoal'],
      tags: [],
    },
    {
      name: 'Hand-thrown Clay Pitcher',
      description: 'A rustic terracotta pitcher, hand-thrown with a generous pouring spout and sturdy handle.',
      price: 2000,
      stock: 11,
      category: categoryMap.Pots,
      images: [nextImage('Pots')],
      material: 'Terracotta',
      dimensions: '10" H x 6" W',
      weight: '2.9 lbs',
      glazeType: 'Unglazed Natural',
      colors: ['Terracotta'],
      tags: ['Sustainable'],
    },
    {
      name: 'Pebble Incense Holder',
      description: 'A small, pebble-shaped incense holder in a soft matte finish, designed to catch falling ash.',
      price: 280,
      stock: 30,
      category: categoryMap.Decor,
      images: [nextImage('Decor')],
      material: 'Stoneware',
      dimensions: '2" H x 4" W',
      weight: '0.5 lbs',
      glazeType: 'Matte Sand',
      colors: ['Sand'],
      tags: [],
    },
    {
      name: 'Terra Harvest Bowl',
      description: 'A wide, shallow harvest bowl in warm terracotta, perfect for fruit or as a table centerpiece.',
      price: 740,
      stock: 12,
      category: categoryMap.Decor,
      images: [nextImage('Decor')],
      material: 'Terracotta',
      dimensions: '3" H x 12" W',
      weight: '2.1 lbs',
      glazeType: 'Gloss Terracotta',
      colors: ['Terracotta'],
      tags: [],
    },
  ];
}

async function seed() {
  await connectDB();
  logger.info('Seeding database...');

  copySeedImages();

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@claycart.com',
    password: 'Admin@12345',
    role: 'admin',
  });

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.name, c._id]));

  const products = productsFor(categoryMap).map((product) => ({ ...product, createdBy: admin._id }));
  await Product.insertMany(products);

  logger.info(`Seed complete: 1 admin, ${createdCategories.length} categories, ${products.length} products`);
  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});
