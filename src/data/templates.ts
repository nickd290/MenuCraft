export interface MenuItem {
  name: string
  description: string
  price: string
  subitems?: string[] // Optional subitems for additional details
}

export interface MenuSection {
  title: string
  items: MenuItem[]
  column?: 'left' | 'right' | 'full' | 'none'
  hasBox?: boolean
  boxColor?: string
}

export interface MenuTemplate {
  id: number
  name: string
  category: string
  description: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fontFamily: string
  sections: MenuSection[]
}

export const templates: MenuTemplate[] = [
  {
    id: 1,
    name: 'Elegant Fine Dining',
    category: 'Fine Dining',
    description: 'Sophisticated and refined for upscale restaurants',
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#d4af37',
      accent: '#8b7355',
      background: '#faf9f6',
      text: '#2c2c2c'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Appetizers',
        items: [
          { name: 'Seared Scallops', description: 'Cauliflower purée, truffle oil, microgreens', price: '24' },
          { name: 'Beef Carpaccio', description: 'Arugula, parmesan, capers, lemon aioli', price: '22' },
          { name: 'Foie Gras Terrine', description: 'Brioche, fig compote, aged balsamic', price: '28' }
        ]
      },
      {
        title: 'Entrées',
        items: [
          { name: 'Pan-Seared Duck Breast', description: 'Cherry gastrique, roasted vegetables, potato gratin', price: '48' },
          { name: 'Wagyu Beef Tenderloin', description: 'Red wine reduction, truffle mashed potatoes, asparagus', price: '68' },
          { name: 'Wild Salmon', description: 'Lemon beurre blanc, quinoa, seasonal vegetables', price: '42' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Rustic Bistro',
    category: 'Casual Bistro',
    description: 'Warm and inviting for neighborhood eateries',
    colorScheme: {
      primary: '#3d2817',
      secondary: '#c85a3f',
      accent: '#8fbc8f',
      background: '#f5ebe0',
      text: '#3d2817'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Starters',
        items: [
          { name: 'French Onion Soup', description: 'Caramelized onions, gruyère cheese, crouton', price: '12' },
          { name: 'Charcuterie Board', description: 'Cured meats, artisan cheeses, pickles, mustard', price: '18' },
          { name: 'Burrata', description: 'Heirloom tomatoes, basil, olive oil, balsamic', price: '14' }
        ]
      },
      {
        title: 'Mains',
        items: [
          { name: 'Steak Frites', description: 'Grilled hanger steak, garlic butter, hand-cut fries', price: '28' },
          { name: 'Roasted Chicken', description: 'Herb-roasted half chicken, mashed potatoes, green beans', price: '24' },
          { name: 'Ratatouille', description: 'Seasonal vegetables, tomato sauce, fresh herbs', price: '19' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Premium Steakhouse',
    category: 'Steakhouse',
    description: 'Bold and masculine for traditional steakhouses',
    colorScheme: {
      primary: '#2c1810',
      secondary: '#8b0000',
      accent: '#d4af37',
      background: '#1a1a1a',
      text: '#f5f5f5'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Prime Cuts',
        items: [
          { name: 'Ribeye 16oz', description: 'USDA Prime, aged 28 days, charbroiled', price: '58' },
          { name: 'New York Strip 14oz', description: 'Center-cut, perfectly marbled', price: '52' },
          { name: 'Porterhouse 24oz', description: 'For two, served with béarnaise', price: '89' }
        ]
      },
      {
        title: 'Sides',
        items: [
          { name: 'Lobster Mac & Cheese', description: 'Maine lobster, three cheese blend', price: '18' },
          { name: 'Truffle Fries', description: 'Hand-cut, parmesan, truffle oil', price: '12' },
          { name: 'Creamed Spinach', description: 'Classic preparation, garlic, cream', price: '10' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Italian Trattoria',
    category: 'Italian',
    description: 'Classic Italian styling with traditional touches',
    colorScheme: {
      primary: '#008c45',
      secondary: '#cd212a',
      accent: '#f4c430',
      background: '#fffef7',
      text: '#2c2416'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Antipasti',
        items: [
          { name: 'Bruschetta', description: 'Grilled bread, tomatoes, basil, garlic, olive oil', price: '11' },
          { name: 'Arancini', description: 'Fried risotto balls, marinara, parmesan', price: '13' },
          { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, basil, balsamic', price: '14' }
        ]
      },
      {
        title: 'Pasta',
        items: [
          { name: 'Spaghetti Carbonara', description: 'Guanciale, egg, pecorino romano, black pepper', price: '22' },
          { name: 'Lasagna Bolognese', description: 'Traditional meat sauce, béchamel, parmesan', price: '24' },
          { name: 'Lobster Ravioli', description: 'Fresh lobster, champagne cream sauce', price: '32' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Mexican Cantina',
    category: 'Mexican',
    description: 'Vibrant and festive for authentic Mexican cuisine',
    colorScheme: {
      primary: '#d2691e',
      secondary: '#ff6347',
      accent: '#32cd32',
      background: '#fff8dc',
      text: '#4a2c2a'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Antojitos',
        items: [
          { name: 'Guacamole', description: 'Fresh avocados, lime, cilantro, jalapeño, served tableside', price: '12' },
          { name: 'Queso Fundido', description: 'Melted cheese, chorizo, peppers, warm tortillas', price: '13' },
          { name: 'Street Tacos (3)', description: 'Choice of carnitas, asada, or chicken, onion, cilantro', price: '14' }
        ]
      },
      {
        title: 'Platos Principales',
        items: [
          { name: 'Carne Asada', description: 'Grilled skirt steak, rice, beans, pico de gallo', price: '26' },
          { name: 'Enchiladas Verdes', description: 'Chicken, tomatillo sauce, crema, queso fresco', price: '18' },
          { name: 'Chile Relleno', description: 'Poblano pepper, cheese, ranchero sauce, rice, beans', price: '19' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Asian Fusion',
    category: 'Asian Fusion',
    description: 'Modern and minimalist for contemporary Asian cuisine',
    colorScheme: {
      primary: '#c41e3a',
      secondary: '#1c1c1c',
      accent: '#ffd700',
      background: '#f8f8f8',
      text: '#2c2c2c'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Small Plates',
        items: [
          { name: 'Edamame', description: 'Sea salt, togarashi spice', price: '8' },
          { name: 'Pork Gyoza', description: 'Pan-fried dumplings, ponzu sauce', price: '12' },
          { name: 'Crispy Brussels Sprouts', description: 'Chili glaze, sesame, scallions', price: '11' }
        ]
      },
      {
        title: 'Mains',
        items: [
          { name: 'Korean BBQ Short Rib', description: 'Gochujang glaze, kimchi fried rice, pickled vegetables', price: '32' },
          { name: 'Miso Black Cod', description: 'Sweet miso glaze, bok choy, jasmine rice', price: '36' },
          { name: 'Pad Thai', description: 'Rice noodles, shrimp, peanuts, bean sprouts, lime', price: '22' }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Cozy Cafe',
    category: 'Cafe',
    description: 'Friendly and approachable for cafes and coffee shops',
    colorScheme: {
      primary: '#6f4e37',
      secondary: '#f4a460',
      accent: '#dda15e',
      background: '#fefae0',
      text: '#3c2f2f'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Breakfast',
        items: [
          { name: 'Avocado Toast', description: 'Sourdough, mashed avocado, cherry tomatoes, feta, poached egg', price: '14' },
          { name: 'Blueberry Pancakes', description: 'Buttermilk pancakes, fresh blueberries, maple syrup', price: '12' },
          { name: 'Breakfast Burrito', description: 'Eggs, bacon, cheese, potatoes, salsa, sour cream', price: '13' }
        ]
      },
      {
        title: 'Sandwiches',
        items: [
          { name: 'Turkey Club', description: 'Roasted turkey, bacon, lettuce, tomato, mayo, sourdough', price: '13' },
          { name: 'Caprese Panini', description: 'Fresh mozzarella, tomato, basil, balsamic, ciabatta', price: '12' },
          { name: 'Tuna Melt', description: 'Albacore tuna salad, cheddar, tomato, grilled rye', price: '11' }
        ]
      }
    ]
  },
  {
    id: 8,
    name: 'Modern Bar & Pub',
    category: 'Bar/Pub',
    description: 'Fun and energetic for bars and gastropubs',
    colorScheme: {
      primary: '#1e3a5f',
      secondary: '#ff8c42',
      accent: '#b8860b',
      background: '#2c2416',
      text: '#f5f5dc'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Appetizers',
        items: [
          { name: 'Wings', description: 'Buffalo, BBQ, or dry rub, celery, blue cheese', price: '14' },
          { name: 'Loaded Nachos', description: 'Cheese, jalapeños, sour cream, guacamole, salsa', price: '15' },
          { name: 'Soft Pretzels', description: 'Beer cheese, honey mustard', price: '10' }
        ]
      },
      {
        title: 'Burgers & More',
        items: [
          { name: 'Classic Burger', description: 'Angus beef, lettuce, tomato, onion, pickle, fries', price: '16' },
          { name: 'Fish & Chips', description: 'Beer-battered cod, tartar sauce, coleslaw', price: '18' },
          { name: 'Pulled Pork Sandwich', description: 'Slow-cooked pork, BBQ sauce, coleslaw, brioche bun', price: '15' }
        ]
      }
    ]
  },
  {
    id: 9,
    name: 'Breakfast Spot',
    category: 'Breakfast',
    description: 'Bright and cheerful for breakfast restaurants',
    colorScheme: {
      primary: '#ff9500',
      secondary: '#ffd60a',
      accent: '#e63946',
      background: '#fffaeb',
      text: '#2b2d42'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Morning Favorites',
        items: [
          { name: 'The Big Breakfast', description: 'Two eggs any style, bacon, sausage, hash browns, toast', price: '15' },
          { name: 'Belgian Waffle', description: 'Fresh berries, whipped cream, maple syrup', price: '13' },
          { name: 'Eggs Benedict', description: 'Poached eggs, canadian bacon, hollandaise, english muffin', price: '16' }
        ]
      },
      {
        title: 'Omelettes',
        items: [
          { name: 'Western Omelette', description: 'Ham, peppers, onions, cheese, hash browns', price: '14' },
          { name: 'Veggie Omelette', description: 'Spinach, mushrooms, tomatoes, feta, hash browns', price: '13' },
          { name: 'Meat Lovers', description: 'Bacon, sausage, ham, cheese, hash browns', price: '15' }
        ]
      }
    ]
  },
  {
    id: 10,
    name: 'Sweet Desserts',
    category: 'Dessert Menu',
    description: 'Elegant and sweet for dessert-focused establishments',
    colorScheme: {
      primary: '#d4a5a5',
      secondary: '#9b59b6',
      accent: '#f8b400',
      background: '#fff5f7',
      text: '#4a0e4e'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Signature Desserts',
        items: [
          { name: 'Chocolate Lava Cake', description: 'Warm molten center, vanilla ice cream, raspberry coulis', price: '12' },
          { name: 'Tiramisu', description: 'Espresso-soaked ladyfingers, mascarpone, cocoa', price: '10' },
          { name: 'Crème Brûlée', description: 'Vanilla custard, caramelized sugar, fresh berries', price: '11' }
        ]
      },
      {
        title: 'Cakes & Tarts',
        items: [
          { name: 'New York Cheesecake', description: 'Classic style, graham cracker crust, berry compote', price: '9' },
          { name: 'Lemon Tart', description: 'Tangy lemon curd, buttery crust, meringue', price: '10' },
          { name: 'Flourless Chocolate Cake', description: 'Rich chocolate, whipped cream, gold leaf', price: '12' }
        ]
      }
    ]
  },
  {
    id: 11,
    name: 'Elegant Cocktail Bar',
    category: 'Country Club',
    description: 'Upscale cocktail bar with feminine elegance and beach club vibes',
    colorScheme: {
      primary: '#2d4f6d',
      secondary: '#b565d8',
      accent: '#4a9b9e',
      background: '#f5f1e8',
      text: '#5a5a5a'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Frozen Cocktails',
        items: [
          { name: 'Frozen Margarita', description: 'Premium tequila, fresh lime, triple sec, salt rim', price: '14' },
          { name: 'Piña Colada', description: 'Coconut cream, pineapple, aged rum', price: '13' },
          { name: 'Strawberry Daiquiri', description: 'Fresh strawberries, white rum, lime juice', price: '13' }
        ]
      },
      {
        title: 'Signature Cocktails',
        items: [
          { name: 'Club Martini', description: 'Premium vodka, dry vermouth, olive or twist', price: '16' },
          { name: 'Old Fashioned', description: 'Bourbon, bitters, sugar, orange twist', price: '15' },
          { name: 'Aperol Spritz', description: 'Aperol, prosecco, soda, orange slice', price: '14' }
        ]
      }
    ]
  },
  {
    id: 12,
    name: 'Country Club Classic',
    category: 'Country Club',
    description: 'Traditional golf club with structured, masculine styling',
    colorScheme: {
      primary: '#2d4f6d',
      secondary: '#d4b896',
      accent: '#f5f1e8',
      background: '#d4b896',
      text: '#5a4a3a'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Appetizers',
        items: [
          { name: 'Shrimp Cocktail', description: 'Jumbo shrimp, cocktail sauce, lemon', price: '18' },
          { name: 'Crab Cakes', description: 'Maryland lump crab, remoulade, microgreens', price: '22' },
          { name: 'Oysters Rockefeller', description: 'Baked oysters, spinach, parmesan, butter', price: '20' }
        ]
      },
      {
        title: 'Salads',
        items: [
          { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, anchovy dressing', price: '12' },
          { name: 'Wedge Salad', description: 'Iceberg, blue cheese, bacon, tomato', price: '13' },
          { name: 'Cobb Salad', description: 'Mixed greens, chicken, bacon, egg, avocado, blue cheese', price: '16' }
        ]
      }
    ]
  },
  {
    id: 13,
    name: 'Lakeside Club',
    category: 'Country Club',
    description: 'Waterfront club with casual elegance and nautical touches',
    colorScheme: {
      primary: '#1e3a5f',
      secondary: '#ff7f6f',
      accent: '#e8f4f8',
      background: '#e8f4f8',
      text: '#4a6c7c'
    },
    fontFamily: 'sans-serif',
    sections: [
      {
        title: 'Fresh Catches',
        items: [
          { name: 'Grilled Salmon', description: 'Atlantic salmon, lemon butter, seasonal vegetables', price: '32' },
          { name: 'Lobster Tail', description: 'Maine lobster, drawn butter, asparagus, rice pilaf', price: '48' },
          { name: 'Pan-Seared Scallops', description: 'Jumbo sea scallops, risotto, brown butter', price: '36' }
        ]
      },
      {
        title: 'Land & Sea',
        items: [
          { name: 'Surf & Turf', description: 'Filet mignon, lobster tail, mashed potatoes, vegetables', price: '58' },
          { name: 'Chicken Picatta', description: 'Sautéed chicken, lemon caper sauce, angel hair pasta', price: '26' },
          { name: 'Rack of Lamb', description: 'Herb-crusted lamb, mint jelly, roasted potatoes', price: '42' }
        ]
      }
    ]
  },
  {
    id: 14,
    name: 'Mountain Lodge',
    category: 'Country Club',
    description: 'Rustic mountain resort with warm, upscale atmosphere',
    colorScheme: {
      primary: '#2d5016',
      secondary: '#d4621f',
      accent: '#f5ede0',
      background: '#f5ede0',
      text: '#5a4a3a'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Hearty Starters',
        items: [
          { name: 'Bison Chili', description: 'Ground bison, beans, cornbread, cheddar', price: '14' },
          { name: 'Smoked Trout Dip', description: 'House-smoked trout, cream cheese, crackers', price: '16' },
          { name: 'Wild Mushroom Soup', description: 'Forest mushrooms, cream, truffle oil', price: '12' }
        ]
      },
      {
        title: 'Lodge Favorites',
        items: [
          { name: 'Elk Medallions', description: 'Pan-seared elk, huckleberry sauce, wild rice', price: '44' },
          { name: 'Braised Short Rib', description: 'Red wine braised, mashed potatoes, root vegetables', price: '38' },
          { name: 'Trout Almondine', description: 'Rainbow trout, toasted almonds, brown butter, lemon', price: '28' }
        ]
      }
    ]
  },
  {
    id: 15,
    name: 'Private Club Formal',
    category: 'Country Club',
    description: 'Exclusive private club for black-tie dining and special events',
    colorScheme: {
      primary: '#0a1e2c',
      secondary: '#c9a961',
      accent: '#6b1f3e',
      background: '#ffffff',
      text: '#4a4a4a'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'First Course',
        items: [
          { name: 'Beluga Caviar', description: 'With traditional accompaniments, blinis, crème fraîche', price: '125' },
          { name: 'Foie Gras Terrine', description: 'Duck liver mousse, brioche, fig compote', price: '38' },
          { name: 'Lobster Bisque', description: 'Rich shellfish broth, cognac, cream', price: '22' }
        ]
      },
      {
        title: 'Main Course',
        items: [
          { name: 'Wagyu Beef Wellington', description: 'Japanese A5 wagyu, pâté, puff pastry, red wine reduction', price: '145' },
          { name: 'Dover Sole Meunière', description: 'Whole dover sole, brown butter, capers, lemon', price: '62' },
          { name: 'Roasted Duck Breast', description: 'Magret duck, orange gastrique, wild rice, haricots verts', price: '52' }
        ]
      }
    ]
  },
  {
    id: 18,
    name: 'Boca Pointe Dinner',
    category: 'Fine Dining',
    description: 'Sophisticated multi-column dinner menu with elegant typography',
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#d4af37',
      accent: '#8b7355',
      background: '#ffffff',
      text: '#2c2c2c'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Small Plates',
        items: [
          { name: 'Maryland Lump Crab Cake', description: 'Remoulade Sauce', price: '19' },
          { name: 'Jumbo Shrimp Cocktail', description: 'Traditional Cocktail Sauce, Lemon & Caper Berries', price: '16' },
          { name: 'Ahi Poke', description: 'Avocado, Mango, Sweet Soy, Seaweed Salad, Wasabi Creme', price: '21' },
          { name: 'Lamb Lollipops', description: 'Two Lamb Chops served over Arugula and Shaved Fennel with Mint Chutney', price: '25' }
        ]
      },
      {
        title: 'Sharables',
        items: [
          { name: 'Grilled Chicken Quesadilla', description: 'Grilled Chicken, Jack & Cheddar Cheese', price: '20' },
          { name: 'Margherita Flat Bread', description: 'Fresh Mozzarella, Basil, Tomato Sauce, Tomatoes, Sea Salt & Olive Oil', price: '14' },
          { name: 'Loaded Tater Tots', description: 'Melted Queso, Pico de Gallo, Sour Cream Crema', price: '14' }
        ]
      },
      {
        title: 'Big Plates',
        items: [
          { name: 'Pot Roast', description: 'Served with Brown Gravy, Mashed Potatoes and Roasted Carrots and Celery', price: '32' },
          { name: 'Rainbow Trout', description: 'Almond & Leek Butter', price: '30' },
          { name: 'St. Louis Ribs', description: 'House Made Coffee BBQ Sauce', price: '34' },
          { name: 'Seared Bronzino', description: 'Tomato Herb Ragu', price: '34' },
          { name: 'Scottish Salmon', description: 'Lemon Garlic Butter', price: '36' },
          { name: 'Fajitas', description: 'Sauteed Peppers & Onions, Tortilla, Guacamole, Pico De Gallo, Sour Cream', price: '26' }
        ]
      },
      {
        title: 'House Sides',
        items: [
          { name: 'Fries', description: '', price: '6' },
          { name: 'Sweet Potato Fries', description: '', price: '6' },
          { name: 'Buttermilk Mash Potatoes', description: '', price: '6' },
          { name: 'Baked Potato', description: '', price: '6' },
          { name: 'Sweet Baked Potato', description: '', price: '6' },
          { name: 'Sautéed Spinach', description: '', price: '6' },
          { name: 'Sauteed Garlic Broccoli', description: '', price: '6' },
          { name: 'Cole Slaw', description: '', price: '6' }
        ]
      },
      {
        title: 'Soup',
        items: [
          { name: 'Matzo Ball', description: '', price: '6' },
          { name: 'Turkey Chili', description: '', price: '15' },
          { name: 'French Onion', description: '', price: '14' },
          { name: 'Soup of the Day', description: '', price: '6' }
        ]
      },
      {
        title: 'Greens',
        items: [
          { name: 'Caesar Salad', description: 'Chopped Romaine Lettuce, Creamy Garlic Parmesan Dressing, Herb Croutons & Parmesan Crisp', price: '15' },
          { name: 'Thai Noodle Salad', description: 'Lo Mein Noodles, Cabbage, Carrots, Scallions, Peppers, Shiitake Mushrooms, Peanut Dressing, Crispy Wonton', price: '16' },
          { name: 'Boca Cobb', description: 'Spring Mix, Bacon, Egg, Avocado, Cheddar, Tomato, Carrots, Cucumber, Shaved Red Onion', price: '16' },
          { name: 'Boca Pointe Garden Salad', description: 'Chopped Field Greens & Romaine, Tomato Wedge, Cucumber, Shaved Red Onion', price: '15' },
          { name: 'Baby Spinach & Arugula Salad', description: 'Candied Walnuts, Dried Cherries, Crumbled Goat Cheese & Sherry Mustard Vinaigrette', price: '17' }
        ]
      },
      {
        title: 'Handhelds',
        items: [
          { name: 'Hamburger', description: 'Grilled Prime Burger, Lettuce, Tomato, Red Onion on a Brioche Bun', price: '19' },
          { name: 'Boca Burger', description: 'Grilled Prime Burger, Aged Cheddar, Applewood Smoked Bacon, Butter Lettuce, Heirloom Tomato, Russian Dressing on a Brioche Bun', price: '22' },
          { name: 'Philly Cheese Steak', description: 'Thinly Sliced Ribeye with Onions, Peppers, and Cheese Sauce on a Baguette', price: '24' },
          { name: 'Hand Carved Deli Sandwich', description: 'Pastrami, Brisket, Corned Beef, Turkey. Choice of Artisan Country Bread', price: '22' }
        ]
      },
      {
        title: 'Chophouse',
        items: [
          { name: 'Black Angus Filet Mignon', description: 'Garlic Parsley Butter', price: '50' },
          { name: 'Roasted Australian Rack of Lamb', description: 'Mint & Onion Demi-Glace', price: '48' },
          { name: 'Tomahawk Pork Chop', description: 'Roasted Apples and Onion Compote', price: '32' },
          { name: 'Roasted Free Range Chicken', description: 'Natural Seasoned Gravy', price: '28' },
          { name: 'Black Angus Ribeye', description: 'Chimichurri Sauce', price: '48' }
        ]
      },
      {
        title: 'When In Rome',
        items: [
          { name: 'Fettucine Alfredo', description: 'Alfredo Sauce, Garlic and Parmesan Cream Sauce and Spinach, Chicken or Shrimp', price: '26' },
          { name: 'Shrimp Scampi', description: 'Linguine, Toasted Garlic, Spinach & Butter Sauce', price: '28' },
          { name: 'Chicken Parmigiana', description: 'Linguine, Tomato Sauce, Mozzarella, Fresh Oregano & Basil', price: '26' }
        ]
      }
    ]
  },
  {
    id: 19,
    name: 'Kids Menu',
    category: 'Family',
    description: 'Fun and colorful kids menu with playful chef illustrations',
    colorScheme: {
      primary: '#2b4c7e',
      secondary: '#e8b4b8',
      accent: '#DC143C',
      background: '#fcf8e8',
      text: '#2b4c7e'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Kids Menu',
        items: [
          { name: 'Chicken Fingers', description: 'Served with French Fries or Potato Chips, a Fountain Soda, and Ice cream', price: '11' },
          { name: 'Hot Dog', description: 'Served with French Fries or Potato Chips, a Fountain Soda, and Ice cream', price: '11' },
          { name: 'Hamburger', description: 'Served with French Fries or Potato Chips, a Fountain Soda, and Ice cream', price: '11' },
          { name: 'Grilled Cheese', description: 'Served with French Fries or Potato Chips, a Fountain Soda, and Ice cream', price: '11' }
        ]
      }
    ]
  },
  {
    id: 20,
    name: 'Grandezza Spring Brunch',
    category: 'Brunch',
    description: 'Vibrant artistic brunch menu with colorful painted borders',
    colorScheme: {
      primary: '#1e3a5f',
      secondary: '#4a7c9e',
      accent: '#e91e63',
      background: '#ffffff',
      text: '#4a5568'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Kickstarter - $6',
        items: [
          { name: 'KICKSTARTER', description: 'CHOICE OF: KALE-APPLE-SPINACH TONIC | BLACKBERRY-CARROT-GINGER JUICE SUNRISE MEDITATION: ORANGE-LEMON-TURMERIC-GINGER-AGAVE-BEET JUICE', price: '6' }
        ]
      },
      {
        title: 'Classics - the juice bar',
        items: [
          { name: 'BASKET OF CONFECTIONS', description: 'DANISHES | CLUBMADE CHEDDAR BISCUITS | ORANGE & BLUEBERRY SCONES | CROISSANTS', price: '8' },
          { name: 'STEEL CUT OATMEAL', description: 'IRISH STEEL CUT GROUND OATMEAL | BROWN SUGAR | DRIED CRANBERRIES | CINNAMON SLICED BANANAS | SLICED STRAWBERRIES | SERVED WITH A BLUEBERRY MUFFIN', price: '9' },
          { name: 'AVOCADO TOAST', description: 'WHEATBERRY TOAST | PRESERVED LEMON | SEA SALT | CRUSHED AVOCADO MICROGREENS | CHOPPED HARD BOILED EGG WHITE', price: '15' }
        ]
      },
      {
        title: 'Batters',
        items: [
          { name: 'PANCAKES', description: 'BUTTER | MIXED BERRIES | POWDERED SUGAR. ADD BLUEBERRIES OR CHOCOLATE CHIPS FOR $2', price: '11' },
          { name: 'CLASSIC FRENCH TOAST', description: 'CINNAMON-BATTERED | BRIOCHE | POWDERED SUGAR', price: '12' },
          { name: 'WAFFLE', description: 'WHIPPED CREAM | SLICED HONEY-INFUSED STRAWBERRIES | MAPLE CRUSHED PECANS', price: '12' },
          { name: 'SILVER DOLLAR PANCAKES', description: 'FOUR SILVER DOLLAR PANCAKES | BUTTER | MIXED BERRIES | POWDERED SUGAR', price: '10' }
        ]
      },
      {
        title: 'Eggs',
        items: [
          { name: 'OMELET', description: 'SALMON | CHORIZO | SAUSAGE | BACON | HAM | MUSHROOMS | BELL PEPPERS | SPINACH | ONIONS | JALAPEÑOS | SWISS | CHEDDAR | PROVOLONE | AMERICAN', price: '13' },
          { name: 'EGG WHITE OMELET', description: 'SERVED WITH A SIDE OF FRUIT AND TURKEY BACON', price: '14' },
          { name: 'TRADITIONAL EGGS BENEDICT', description: 'CANADIAN BACON | POACHED EGGS | CLUBMADE HOLLANDAISE SAUCE | TOASTED WOLFERMAN\'S ENGLISH MUFFIN', price: '14' },
          { name: 'TWO EGG BREAKFAST', description: 'EGGS YOUR WAY | BACON OR SAUSAGE', price: '12' },
          { name: 'VODKA CURED SALMON BENEDICT', description: 'SLICED VODKA CURED SALMON | CLUBMADE HOLLANDAISE SAUCE | TOASTED WOLFERMAN\'S ENGLISH MUFFIN', price: '18' }
        ]
      },
      {
        title: 'Specialties',
        items: [
          { name: 'CHORIZO BURRITO', description: 'CHORIZO | POTATOES | ONIONS | JACK CHEESE | SCRAMBLED EGGS TORTILLA | POBLANO CREMA | CILANTRO SPRIGS | MARINATED TOMATO SLICES | WATERMELON RADISH', price: '14' },
          { name: 'BREAKFAST TACOS', description: 'SCRAMBLED EGGS | BACON | AMERICAN | FLOUR TORTILLA | POTATOES | NO SIDE', price: '12' },
          { name: 'B.E.L.T', description: 'BACON | OVER EASY EGGS | LETTUCE | TOMATO | CHIPOTLE MAYO | SOURDOUGH | SERVED WITH A SIDE OF FRUIT OR BREAKFAST POTATOES', price: '13' },
          { name: 'DAD\'S BREAKFAST SPECIAL', description: 'FRIED EGGS | BACON | HAM | AMERICAN CHEESE | CROISSANT | SERVED WITH A SIDE OF FRUIT OR BREAKFAST POTATOES', price: '14' },
          { name: 'BREAKFAST BOATS', description: 'TWO FRIED TATER SKINS | SCRAMBLED EGGS | SAUSAGE | BACON | CHEDDAR JACK | SOUR CREAM | SERVED WITH A SIDE OF FRUIT OR BREAKFAST POTATOES', price: '12' }
        ]
      }
    ]
  },
  {
    id: 21,
    name: 'Grandezza Wine List',
    category: 'Wine & Spirits',
    description: 'Elegant wine list with sophisticated navy border and script accents',
    colorScheme: {
      primary: '#1e3a5f',
      secondary: '#4a5568',
      accent: '#1e3a5f',
      background: '#ffffff',
      text: '#1e3a5f'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Chardonnay',
        items: [
          { name: 'METZ ROAD, MONTEREY 2021', description: '', price: '12 | 40' },
          { name: 'TWENTY ACRES, CALIFORNIA 2021', description: '', price: '9.5 | 34' },
          { name: 'SONOMA CUTRER, RUSSIAN RIVER, SONOMA 2022', description: '', price: '15.5 | 50' },
          { name: 'ALEXANDER VALLEY VINEYARDS, SONOMA COUNTY 2018', description: '', price: '56' },
          { name: 'RUTHERFORD RANCH, NAPA VALLEY 2019', description: '', price: '74' }
        ]
      },
      {
        title: 'Pinot Grigio',
        items: [
          { name: 'DUCK POND, OREGON 2021', description: '', price: '9 | 30' },
          { name: 'BARONE FINI, TRENTINO, ITALY 2020', description: '', price: '9.5 | 32' },
          { name: 'SANTA MARGHERITA, ALTO ADIEGE, ITALY 2022', description: '', price: '16 | 58' },
          { name: 'BANFI, SAN ANGELO, ITALY 2021', description: '', price: '34' }
        ]
      },
      {
        title: 'Sauvignon Blanc',
        items: [
          { name: 'YEALANDS, MARLBOROUGH, NEW ZEALAND 2022', description: '', price: '9.5 | 32' },
          { name: 'ROUND POND, RUTHERFORD 2022', description: '', price: '36' }
        ]
      },
      {
        title: 'Interesting Whites',
        items: [
          { name: 'RIESLING, HIVE & HONEY, MONTEREY 2021', description: '', price: '8.5 | 28' },
          { name: 'MOSCATO, CAPOSALDO, LOMBARDI, ITALY', description: '', price: '9.5 | 32' }
        ]
      },
      {
        title: 'Rose',
        items: [
          { name: 'STUDIO BY MIRAVAL, FRANCE 2022', description: '', price: '13.5 | 46' }
        ]
      },
      {
        title: 'Sparkling',
        items: [
          { name: 'PROSECCO, MASCHIO, VENTETO, ITALY (SPLIT)', description: '', price: '9.5' },
          { name: 'BRUT, BLANC DE BLANCE, J.P. CHENET, FRANCE (SPLIT)', description: '', price: '9.5' },
          { name: 'PIPER SONOMA, CALIFORNIA, CHAMPAGNE', description: '', price: '55' },
          { name: 'PIPER HEIDSIECK, CUVEE, FRANCE', description: '', price: '80' },
          { name: 'CHAMPAGNE, DOM PERIGNON, FRANCE 2013', description: '', price: '240' }
        ]
      },
      {
        title: 'Cabernet Sauvignon',
        items: [
          { name: 'BONANZA LOT 3 BY CAYMUS, CALIFORNIA', description: '', price: '12 | 44' },
          { name: 'EARTHQUAKE, LODI, CALIFORNIA 2020', description: '', price: '15 | 56' },
          { name: 'CASTLE ROCK RESERVE, ALEXANDER VALLEY 2020', description: '', price: '16 | 60' },
          { name: 'TREANA, PASO ROBLES 2021', description: '', price: '14 | 52' },
          { name: 'COPPOLA, DIRECTOR\'S CUT, SONOMA 2019', description: '', price: '62' },
          { name: 'ALEXANDER VALLEY VINEYARDS, SCHOOL HOUSE 2018', description: '', price: '80' },
          { name: 'RUTHERFORD RANCH, NAPA VALLEY 2019', description: '', price: '78' }
        ]
      },
      {
        title: 'Pinot Noir',
        items: [
          { name: 'Z ALEXANDER BROWN, UNCAGED 2021', description: '', price: '10 | 30' },
          { name: 'BELLE GLOS CLARK & TELEPHONE, SANTA BARBARA 2022', description: '', price: '59' }
        ]
      },
      {
        title: 'Malbec',
        items: [
          { name: 'ALTA VISTA, MENDOZA, ARGENTINA 2020', description: '', price: '42' },
          { name: 'TRIVENTO RESERVE, MENDOZA, ARGENTINA 2021', description: '', price: '14.5 | 52' }
        ]
      },
      {
        title: 'Interesting Reds',
        items: [
          { name: 'PREDATOR, OLD VINE ZIN, LODI 2021', description: '', price: '12 | 44' },
          { name: 'TROUBLEMAKER BY HOPE, PASO ROBLES', description: '', price: '11 | 39' },
          { name: 'CLOS LA CHANCE, SANTA CLARA VALLEY, MERRITAGE', description: '', price: '48' }
        ]
      },
      {
        title: 'Italian Reds',
        items: [
          { name: 'SUPER TUSCAN, "CENTINE" BY BANFI, TOSCANA, ITALY 2021', description: '', price: '9 | 32' },
          { name: 'CASTELL DEL TREBBIO, TUSCANY, ITALY 2020', description: '', price: '34' }
        ]
      }
    ]
  },
  {
    id: 22,
    name: 'Minimalist Brunch',
    category: 'Brunch',
    description: 'Clean and sophisticated brunch menu with elegant serif typography',
    colorScheme: {
      primary: '#000000',
      secondary: '#4a5568',
      accent: '#000000',
      background: '#ffffff',
      text: '#000000'
    },
    fontFamily: 'serif',
    sections: [
      {
        title: 'Sunday Brunch',
        items: [
          { name: 'OMELETS MADE TO ORDER', description: '3 Eggs, Spinach, Mushroom, Cheddar, Mozzarella, Tomatoes, Bell Peppers, Sausage, Bacon', price: '' },
          { name: 'WAFFLES OR PANCAKES MADE TO ORDER', description: 'Add Blueberries, Strawberries, Raspberries, Whipped Cream, Maple Syrup, Honey Butter', price: '' },
          { name: 'OATMEAL', description: 'Brown Sugar, Maple Syrup, Cinnamon, Raisins, Toasted Almonds', price: '' },
          { name: 'SMOKED SALMON PLATTER', description: 'Red Onion, Cream Cheese, Capers, Chopped Boiled Egg, Sliced Tomatoes, Assorted Bagels', price: '' },
          { name: 'BUILD YOUR OWN YOGURT PARFAIT', description: 'Vanilla Yogurt, Granola, Blueberries, Strawberries, Honey', price: '' },
          { name: 'ASSORTED MORNING PASTRIES', description: '', price: '' },
          { name: 'FRUIT PLATTER', description: '', price: '' },
          { name: 'JUICE BAR', description: 'Fresh Orange Juice, Fresh Grapefruit Juice, Cranberry Juice, Apple Juice', price: '' }
        ]
      }
    ]
  }
]