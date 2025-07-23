// Sample product data for demonstration
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const sampleProducts: Product[] = [
  {
    _id: "1",
    name: "Traditional Mango Pickle",
    description: "Authentic homemade mango pickle made with fresh mangoes, traditional spices, and mustard oil. A perfect blend of tangy and spicy flavors.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop",
    category: "Pickles",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "2",
    name: "Spicy Lemon Pickle",
    description: "Zesty lemon pickle with a perfect balance of sourness and spice. Made with fresh lemons and aromatic spices.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    category: "Pickles",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "3",
    name: "Mixed Vegetable Pickle",
    description: "A delightful mix of seasonal vegetables pickled in traditional style with mustard seeds and fenugreek.",
    price: 279,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
    category: "Pickles",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "4",
    name: "Homemade Samosas",
    description: "Crispy golden samosas filled with spiced potatoes and peas. Perfect tea-time snack made fresh daily.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    category: "Snacks",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "5",
    name: "Masala Mathri",
    description: "Crunchy and flaky mathri seasoned with aromatic spices. A traditional Indian snack perfect with tea.",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
    category: "Snacks",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "6",
    name: "Besan Laddu",
    description: "Traditional gram flour laddus made with pure ghee, cardamom, and love. Melt-in-mouth sweetness.",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    category: "Sweets",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "7",
    name: "Gulab Jamun",
    description: "Soft and spongy gulab jamuns soaked in aromatic sugar syrup. A classic Indian dessert.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop",
    category: "Sweets",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "8",
    name: "Masala Chai Blend",
    description: "Aromatic tea blend with cardamom, cinnamon, ginger, and cloves. Perfect for a refreshing cup of chai.",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    category: "Beverages",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "9",
    name: "Homemade Rajma",
    description: "Rich and creamy kidney bean curry cooked in traditional style with aromatic spices. Comfort food at its best.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
    category: "Main Course",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "10",
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked with butter and cream. A rich and indulgent North Indian delicacy.",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop",
    category: "Main Course",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
