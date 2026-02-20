const products = [

/* ===========================
   PATTU SAREES (12)
=========================== */
{
  id: 1,
  name: "Royal Pattu Saree - Red",
  price: 4999,
  oldPrice: 7999,
  image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03",
  category: "pattu-sarees",
  rating: 4.8,
  stock: 15,
  description: "Premium handcrafted silk pattu saree with golden zari border."
},
{
  id: 2,
  name: "Traditional Kanchipuram Pattu",
  price: 6999,
  oldPrice: 9999,
  image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  category: "pattu-sarees",
  rating: 4.7,
  stock: 10,
  description: "Authentic Kanchipuram silk saree with temple weaving."
},
{
  id: 3,
  name: "Bridal Silk Pattu Saree",
  price: 8999,
  oldPrice: 12999,
  image: "https://images.unsplash.com/photo-1612423284934-2850a4b4b3c3",
  category: "pattu-sarees",
  rating: 4.9,
  stock: 8,
  description: "Heavy bridal silk saree with intricate zari detailing."
},
{
  id: 4,
  name: "Golden Border Pattu",
  price: 5599,
  oldPrice: 8499,
  image: "https://images.unsplash.com/photo-1610030469668-4e7f6c2f2e4d",
  category: "pattu-sarees",
  rating: 4.6,
  stock: 12,
  description: "Classic pattu saree with royal gold woven border."
},
{
  id: 5,
  name: "Peacock Blue Silk Saree",
  price: 6299,
  oldPrice: 8999,
  image: "https://images.unsplash.com/photo-1625591339971-3a15c6b00c38",
  category: "pattu-sarees",
  rating: 4.5,
  stock: 11,
  description: "Vibrant peacock blue silk saree for festive occasions."
},
{
  id: 6,
  name: "Temple Design Pattu",
  price: 7499,
  oldPrice: 10999,
  image: "https://images.unsplash.com/photo-1624378515195-6bbdb7c1f9f6",
  category: "pattu-sarees",
  rating: 4.7,
  stock: 9,
  description: "Traditional temple motif silk saree."
},
{
  id: 7,
  name: "Soft Silk Pattu",
  price: 4299,
  oldPrice: 6999,
  image: "https://images.unsplash.com/photo-1607082349566-1873426c97b6",
  category: "pattu-sarees",
  rating: 4.4,
  stock: 14,
  description: "Soft lightweight silk saree perfect for functions."
},
{
  id: 8,
  name: "Green Wedding Pattu",
  price: 7999,
  oldPrice: 11999,
  image: "https://images.unsplash.com/photo-1612423284934-2850a4b4b3c3",
  category: "pattu-sarees",
  rating: 4.8,
  stock: 6,
  description: "Premium wedding collection silk saree."
},
{
  id: 9,
  name: "Pink Zari Silk Saree",
  price: 5199,
  oldPrice: 7999,
  image: "https://images.unsplash.com/photo-1610030469668-4e7f6c2f2e4d",
  category: "pattu-sarees",
  rating: 4.5,
  stock: 13,
  description: "Elegant pink silk saree with heavy zari border."
},
{
  id: 10,
  name: "Banarasi Pattu",
  price: 6899,
  oldPrice: 9999,
  image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  category: "pattu-sarees",
  rating: 4.7,
  stock: 7,
  description: "Banarasi inspired silk saree."
},
{
  id: 11,
  name: "Classic Maroon Silk",
  price: 5999,
  oldPrice: 8999,
  image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03",
  category: "pattu-sarees",
  rating: 4.6,
  stock: 10,
  description: "Traditional maroon silk saree."
},
{
  id: 12,
  name: "Lightweight Festival Pattu",
  price: 4599,
  oldPrice: 6999,
  image: "https://images.unsplash.com/photo-1625591339971-3a15c6b00c38",
  category: "pattu-sarees",
  rating: 4.4,
  stock: 18,
  description: "Festive lightweight silk saree."
},

/* ===========================
   DRESSES (12)
=========================== */
{
  id: 20,
  name: "Designer Party Dress",
  price: 1999,
  oldPrice: 2999,
  image: "https://images.unsplash.com/photo-1593032465171-8f5d7e9d3f00",
  category: "dresses",
  rating: 4.3,
  stock: 20,
  description: "Elegant party wear dress."
},
{
  id: 21,
  name: "Floral Maxi Dress",
  price: 2499,
  oldPrice: 3499,
  image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a2a",
  category: "dresses",
  rating: 4.5,
  stock: 16,
  description: "Comfortable floral maxi dress."
},
{
  id: 22,
  name: "Evening Gown Dress",
  price: 3999,
  oldPrice: 5999,
  image: "https://images.unsplash.com/photo-1520975928316-56f6a7aa7b78",
  category: "dresses",
  rating: 4.7,
  stock: 8,
  description: "Premium evening gown."
},

/* Add 9 more dresses similar pattern */
{
  id: 23,
  name: "Red Cocktail Dress",
  price: 2799,
  oldPrice: 3999,
  image: "https://images.unsplash.com/photo-1520975928316-56f6a7aa7b78",
  category: "dresses",
  rating: 4.6,
  stock: 12,
  description: "Stylish red cocktail dress."
},
{
  id: 24,
  name: "Summer Casual Dress",
  price: 1599,
  oldPrice: 2499,
  image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a2a",
  category: "dresses",
  rating: 4.2,
  stock: 25,
  description: "Lightweight summer wear."
},

/* ===========================
   KURTIS (12)
=========================== */
{
  id: 40,
  name: "Elegant Cotton Kurti",
  price: 1499,
  oldPrice: 2499,
  image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  category: "kurtis",
  rating: 4.4,
  stock: 30,
  description: "Comfortable cotton kurti."
},
{
  id: 41,
  name: "Printed Festive Kurti",
  price: 1799,
  oldPrice: 2799,
  image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03",
  category: "kurtis",
  rating: 4.6,
  stock: 18,
  description: "Festive printed kurti."
},
{
  id: 42,
  name: "Designer Anarkali Kurti",
  price: 2299,
  oldPrice: 3499,
  image: "https://images.unsplash.com/photo-1625591339971-3a15c6b00c38",
  category: "kurtis",
  rating: 4.7,
  stock: 10,
  description: "Anarkali style kurti."
},

/* Add more kurtis same pattern */

/* ===========================
   JEWELLERY (8)
=========================== */
{
  id: 60,
  name: "Handmade Temple Necklace",
  price: 1299,
  oldPrice: 1999,
  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
  category: "handmade-jewellery",
  rating: 4.8,
  stock: 40,
  description: "Traditional temple jewellery necklace."
},
{
  id: 61,
  name: "Bridal Gold Choker",
  price: 2999,
  oldPrice: 4999,
  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
  category: "handmade-jewellery",
  rating: 4.9,
  stock: 15,
  description: "Premium bridal choker."
}

];

export default products;