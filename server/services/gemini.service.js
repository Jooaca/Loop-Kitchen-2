const PROXY_URL = process.env.STUDENT_PROXY_URL || 'https://gemini-vertex-student-proxy.vercel.app/api/gemini';
const API_KEY = process.env.STUDENT_PROXY_API_KEY || 'vk_student-garcia_1RFrOicqSx8i17nBTow9rDTnUQGJuV87ZOWxJDsOUAU';

/**
 * Llamada al Proxy de Gemini de la Universidad
 */
const callStudentProxy = async (prompt, systemInstruction = '', modelKey = 'flash') => {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        modelKey,
        prompt,
        systemInstruction,
        generationConfig: {
          temperature: 0.8, // Mayor temperatura para mayor creatividad y diversidad de platos
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await res.json();

    if (data.ok && data.text) {
      let cleaned = data.text.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(cleaned);
      console.log(`[Student Proxy Success]: Saldo de ${data.student}: $${data.usage?.balanceUsd} USD`);
      return parsed;
    }
    
    console.warn('[Student Proxy Notice]: Respuesta devuelta:', data);
    return null;
  } catch (error) {
    console.error('[Student Proxy Error]:', error.message);
    return null;
  }
};

/**
 * 1. Generar recetas inteligentes basadas en la despensa
 */
const generateSmartRecipes = async (pantryItems, preferences = {}) => {
  const systemInstruction = 'Sos el chef ejecutivo de Loop Kitchen. Genera 2 recetas cortas en JSON de tamaño mínimo para evitar truncación.';

  const prompt = `
Ingredientes: ${JSON.stringify(pantryItems)}
Genera exactamente 2 recetas ultra compactas en JSON.
IMPORTANTE:
- "description": Frase de máximo 8 palabras.
- "ingredients": Incluir máximo 4 ingredientes por receta.
- "steps": Máximo 2 pasos muy cortos (máximo 12 palabras por paso).
- "healthyVariants" y "tips": Omitir o dejar vacíos para ahorrar espacio.
Formato JSON exacto:
[
  {
    "title": "Nombre",
    "description": "Corto",
    "prepTimeMinutes": 15,
    "difficulty": "Fácil",
    "ingredients": [
      { "name": "Ingrediente", "quantity": 100, "unit": "g", "inPantry": true }
    ],
    "steps": ["Paso 1", "Paso 2"],
    "nutritionalInfo": { "calories": 300, "protein": 20, "carbs": 10, "fats": 5 }
  }
]
`;

  const aiResult = await callStudentProxy(prompt, systemInstruction, 'flash');
  if (aiResult && Array.isArray(aiResult)) return aiResult;

  if (aiResult && Array.isArray(aiResult)) return aiResult;

  // Dynamic backup recipes search when AI rate limit is reached
  const localRecipes = [
    {
      title: 'Pollo Saltado con Cebolla y Tomate',
      description: 'Plato tradicional rápido y lleno de sabor.',
      prepTimeMinutes: 20,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Pollo', quantity: 300, unit: 'g' },
        { name: 'Tomate', quantity: 2, unit: 'unid' },
        { name: 'Cebolla', quantity: 1, unit: 'unid' },
        { name: 'Aceite de oliva', quantity: 1, unit: 'cda' }
      ],
      steps: [
        'Cortar el pollo en tiras finas y sazonar con sal y pimienta.',
        'Picar la cebolla y el tomate en gajos medianos.',
        'Saltear el pollo a fuego alto en sartén caliente por 5 min.',
        'Agregar la cebolla y el tomate, saltear 3 minutos más y servir caliente.'
      ],
      nutritionalInfo: { calories: 420, protein: 38, carbs: 14, fats: 12 },
      healthyVariants: ['Usar pechuga sin piel y sal baja en sodio.'],
      tips: ['Mantener la sartén muy caliente para un salteado crujiente.']
    },
    {
      title: 'Arroz Verde Cremoso con Queso',
      description: 'Aprovecha el arroz y el queso para un plato rústico.',
      prepTimeMinutes: 25,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Arroz', quantity: 200, unit: 'g' },
        { name: 'Queso', quantity: 100, unit: 'g' },
        { name: 'Espinaca', quantity: 1, unit: 'atado' }
      ],
      steps: [
        'Cocinar el arroz de manera tradicional.',
        'Licuar hojas verdes con un toque de agua o caldo.',
        'Integrar el arroz cocido con el licuado verde y añadir el queso rallado hasta derretir.'
      ],
      nutritionalInfo: { calories: 390, protein: 16, carbs: 50, fats: 14 },
      healthyVariants: ['Reemplazar con arroz integral.'],
      tips: ['Servir de inmediato para disfrutar el queso fundido.']
    },
    {
      title: 'Fajitas de Pollo y Verduras',
      description: 'Wraps rápidos y sabrosos con pollo y pimientos.',
      prepTimeMinutes: 15,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Pollo', quantity: 300, unit: 'g' },
        { name: 'Cebolla', quantity: 1, unit: 'unid' },
        { name: 'Pimiento', quantity: 1, unit: 'unid' },
        { name: 'Harina', quantity: 150, unit: 'g' }
      ],
      steps: [
        'Saltear el pollo cortado en tiras junto con las cebollas y pimientos.',
        'Preparar tortillas rápidas con harina y agua, rellenar y servir.'
      ],
      nutritionalInfo: { calories: 450, protein: 32, carbs: 40, fats: 15 },
      healthyVariants: ['Usar harina integral para las tortillas.'],
      tips: ['Puedes sazonar con limón y comino para realzar el sabor.']
    },
    {
      title: 'Tortilla de Huevo y Queso',
      description: 'Un desayuno o cena proteica súper rápida.',
      prepTimeMinutes: 10,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Huevo', quantity: 3, unit: 'unid' },
        { name: 'Queso', quantity: 80, unit: 'g' },
        { name: 'Aceite de oliva', quantity: 1, unit: 'cda' }
      ],
      steps: [
        'Batir los huevos con una pizca de sal.',
        'Cocinar en sartén con aceite a fuego bajo, colocar queso en el medio y doblar.'
      ],
      nutritionalInfo: { calories: 320, protein: 22, carbs: 2, fats: 25 },
      healthyVariants: ['Agregar claras de huevo y espinaca fresca.'],
      tips: ['Cocinar a fuego lento para que el queso se derrita sin quemar el huevo.']
    },
    {
      title: 'Bananas con Chocolate Culinario',
      description: 'Un postre o merienda dulce e inteligente.',
      prepTimeMinutes: 8,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Banana', quantity: 2, unit: 'unid' },
        { name: 'Chocolate', quantity: 50, unit: 'g' },
        { name: 'Harina', quantity: 50, unit: 'g' }
      ],
      steps: [
        'Cortar las bananas al medio y espolvorear con una lluvia fina de harina.',
        'Derretir el chocolate a baño maría y bañar las bananas.'
      ],
      nutritionalInfo: { calories: 280, protein: 4, carbs: 48, fats: 8 },
      healthyVariants: ['Usar chocolate negro con cacao al 70% o superior.'],
      tips: ['Puedes refrigerar las bananas un rato antes de bañarlas.']
    },
    {
      title: 'Panqueques de Harina y Huevo',
      description: 'Dulces o salados, perfectos para acompañar con fruta.',
      prepTimeMinutes: 12,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Harina', quantity: 100, unit: 'g' },
        { name: 'Huevo', quantity: 1, unit: 'unid' },
        { name: 'Leche', quantity: 150, unit: 'ml' }
      ],
      steps: [
        'Batir la harina, el huevo y la leche hasta formar una mezcla líquida homogénea.',
        'Cocinar porciones delgadas en una sartén caliente vuelta y vuelta.'
      ],
      nutritionalInfo: { calories: 250, protein: 9, carbs: 38, fats: 5 },
      healthyVariants: ['Usar avena molida en lugar de harina refinada.'],
      tips: ['Untar con queso crema o miel para un toque extra dulce.']
    },
    {
      title: 'Ensalada de Atún y Cebolla Rápida',
      description: 'Ensalada fresca repleta de proteínas y omega 3.',
      prepTimeMinutes: 10,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Atún', quantity: 1, unit: 'lata' },
        { name: 'Cebolla', quantity: 0.5, unit: 'unid' },
        { name: 'Tomate', quantity: 1, unit: 'unid' }
      ],
      steps: [
        'Escurrir la lata de atún y colocar en un bowl.',
        'Picar la cebolla y el tomate finamente, mezclar y condimentar con sal y aceite.'
      ],
      nutritionalInfo: { calories: 210, protein: 26, carbs: 8, fats: 9 },
      healthyVariants: ['Usar atún al agua para reducir calorías.'],
      tips: ['Añadir unas gotas de jugo de limón fresco.']
    }
  ];

  // Algoritmo de emparejamiento inteligente de recetas locales basado en stock de despensa
  const matchedRecipes = localRecipes.map(recipe => {
    let matchCount = 0;
    const ingredientsWithInPantry = recipe.ingredients.map(ing => {
      const inPantry = pantryItems.some(p => 
        p && p.name && (
          p.name.toLowerCase().includes(ing.name.toLowerCase()) || 
          ing.name.toLowerCase().includes(p.name.toLowerCase())
        )
      );
      if (inPantry) matchCount++;
      return { ...ing, inPantry };
    });
    return { ...recipe, ingredients: ingredientsWithInPantry, matchCount };
  });

  // Ordenar de mayor a menor cantidad de ingredientes coincidentes
  matchedRecipes.sort((a, b) => b.matchCount - a.matchCount);

  // Devolver las 2 mejores coincidencias
  return matchedRecipes.slice(0, 2).map(r => {
    const { matchCount, ...rest } = r;
    return rest;
  });
};

/**
 * 2. Optimizar lista de supermercado con IA
 */
const optimizeCart = async (groceryItems, pantryItems, preferences = {}) => {
  const systemInstruction = 'Asesor de compras de Loop Kitchen. Responde en JSON conciso.';

  const prompt = `
Lista: ${JSON.stringify(groceryItems)}
Despensa: ${JSON.stringify(pantryItems)}

JSON requerido:
{
  "optimizationSummary": "Resumen conciso",
  "recommendations": [
    "Sugerencia 1 sobre duplicados",
    "Sugerencia 2 sobre empaque familiar",
    "Sugerencia 3 sobre verduras y proteínas"
  ]
}
`;

  const aiResult = await callStudentProxy(prompt, systemInstruction, 'flash');
  if (aiResult && aiResult.recommendations) return aiResult;

  return {
    optimizationSummary: 'Optimizaciones sugeridas para tu carrito:',
    recommendations: [
      '💡 Suma verduras de hoja verde para mayor aporte de fibra.',
      '💰 Compra arroz en empaque familiar para ahorrar un 20%.',
      '🌱 Sustituye aderezos procesados por palta o aceite de oliva.'
    ]
  };
};

/**
 * 3. Asistente de Planificación Semanal IA ⭐ (7 Días Variados con Receta Completa)
 */
const generateWeeklyMealPlan = async (preferences = {}) => {
  const systemInstruction = 'Nutricionista y Chef de Loop Kitchen. Genera un menú inteligente de 2 días (Lunes y Martes) en JSON minificado. El menú debe ser inteligente, planificando platos que compartan/reutilicen ingredientes comunes a lo largo de los días para ahorrar costos y evitar desperdicio.';

  const prompt = `
Genera un plan de 2 Días (Lunes, Martes) en JSON de tamaño mínimo para evitar truncación.
IMPORTANTE:
- "description": Máximo 2 palabras.
- "ingredients": Máximo 1 ingrediente por comida (incluyendo solo "name", "quantity" y "unit", omitir el campo "category").
- REUTILIZACIÓN: Diseña las comidas de forma inteligente para que se repitan/reutilicen ingredientes comunes de un día a otro (por ejemplo: si usas "Pollo" el lunes en el almuerzo, reutilízalo el martes; si usas "Tomate", úsalo en varias comidas).
- VARIACIÓN: Sé creativo y no repitas platos de ejemplo. Genera desayunos, almuerzos, meriendas y cenas saludables y diversas.
- "steps": Dejar como array vacío [] para todas las comidas.
- "healthyTip": Dejar como string vacío "".
- Semilla de variedad aleatoria: ${Math.random()}

Formato JSON requerido:
{
  "title": "Plan Variado e Inteligente",
  "days": [
    {
      "dayName": "Lunes",
      "breakfast": {
        "title": "Nombre creativo de desayuno (ej: Panqueques de avena, Huevos revueltos, etc.)",
        "description": "Desayuno",
        "prepTimeMinutes": 10,
        "ingredients": [
          { "name": "Ingrediente principal", "quantity": 50, "unit": "g" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "lunch": {
        "title": "Nombre creativo de almuerzo (ej: Fajitas de pollo, Ensalada de quinoa, etc.)",
        "description": "Almuerzo",
        "prepTimeMinutes": 20,
        "ingredients": [
          { "name": "Ingrediente principal", "quantity": 150, "unit": "g" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "snack": {
        "title": "Nombre de merienda (ej: Rodajas de manzana, Yogurt con nueces, etc.)",
        "description": "Merienda",
        "prepTimeMinutes": 5,
        "ingredients": [
          { "name": "Ingrediente principal", "quantity": 1, "unit": "unid" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "dinner": {
        "title": "Nombre creativo de cena (ej: Sopa de calabaza, Omelette de espinaca, etc.)",
        "description": "Cena",
        "prepTimeMinutes": 15,
        "ingredients": [
          { "name": "Ingrediente principal", "quantity": 2, "unit": "unid" }
        ],
        "steps": [],
        "healthyTip": ""
      }
    }
  ]
}
`;

  const aiResult = await callStudentProxy(prompt, systemInstruction, 'flash');

  if (aiResult && aiResult.days && aiResult.days.length >= 2) {
    return aiResult;
  }

  // Dynamic, randomized weekly planner fallback when AI proxy is rate-limited or offline
  const breakfastsPool = [
    {
      title: 'Tostadas de Palta y Huevo',
      description: 'Desayuno fresco.',
      prepTimeMinutes: 10,
      ingredients: [
        { name: 'Pan Integral', quantity: 2, unit: 'rebanadas' },
        { name: 'Huevo', quantity: 2, unit: 'unid' },
        { name: 'Palta', quantity: 1, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Avena con Almendras y Frutas',
      description: 'Desayuno saciante.',
      prepTimeMinutes: 5,
      ingredients: [
        { name: 'Avena en hojuelas', quantity: 60, unit: 'g' },
        { name: 'Leche de Almendras', quantity: 200, unit: 'ml' },
        { name: 'Banana', quantity: 0.5, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Panqueques de Avena',
      description: 'Desayuno saludable.',
      prepTimeMinutes: 12,
      ingredients: [
        { name: 'Harina', quantity: 80, unit: 'g' },
        { name: 'Huevo', quantity: 1, unit: 'unid' },
        { name: 'Leche', quantity: 100, unit: 'ml' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Yogurt Griego con Miel',
      description: 'Desayuno rápido.',
      prepTimeMinutes: 5,
      ingredients: [
        { name: 'Yogurt Griego', quantity: 200, unit: 'g' },
        { name: 'Miel', quantity: 1, unit: 'cda' }
      ],
      steps: [],
      healthyTip: ''
    }
  ];

  const lunchesPool = [
    {
      title: 'Pollo al Limón con Quinoa',
      description: 'Almuerzo equilibrado.',
      prepTimeMinutes: 25,
      ingredients: [
        { name: 'Pechuga de Pollo', quantity: 200, unit: 'g' },
        { name: 'Quinoa', quantity: 80, unit: 'g' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Salmón con Puré',
      description: 'Almuerzo rico.',
      prepTimeMinutes: 30,
      ingredients: [
        { name: 'Salmón', quantity: 200, unit: 'g' },
        { name: 'Papa', quantity: 200, unit: 'g' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Pasta al Fileto',
      description: 'Almuerzo tradicional.',
      prepTimeMinutes: 15,
      ingredients: [
        { name: 'Fideos', quantity: 100, unit: 'g' },
        { name: 'Tomate', quantity: 2, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Ensalada de Atún y Huevo',
      description: 'Almuerzo proteico.',
      prepTimeMinutes: 10,
      ingredients: [
        { name: 'Atún', quantity: 1, unit: 'lata' },
        { name: 'Huevo', quantity: 2, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    }
  ];

  const snacksPool = [
    {
      title: 'Yogurt con Almendras',
      description: 'Merienda saludable.',
      prepTimeMinutes: 5,
      ingredients: [{ name: 'Yogurt Griego', quantity: 150, unit: 'g' }],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Banana con Chocolate',
      description: 'Merienda dulce.',
      prepTimeMinutes: 5,
      ingredients: [{ name: 'Banana', quantity: 1, unit: 'unid' }, { name: 'Chocolate', quantity: 20, unit: 'g' }],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Manzana con Canela',
      description: 'Merienda ligera.',
      prepTimeMinutes: 4,
      ingredients: [{ name: 'Manzana', quantity: 1, unit: 'unid' }],
      steps: [],
      healthyTip: ''
    }
  ];

  const dinnersPool = [
    {
      title: 'Fajitas de Pollo',
      description: 'Cena rápida.',
      prepTimeMinutes: 20,
      ingredients: [
        { name: 'Pollo', quantity: 180, unit: 'g' },
        { name: 'Harina', quantity: 100, unit: 'g' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Sopa de Vegetales',
      description: 'Cena detox.',
      prepTimeMinutes: 20,
      ingredients: [
        { name: 'Tomate', quantity: 2, unit: 'unid' },
        { name: 'Cebolla', quantity: 1, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Arroz Verde con Huevo',
      description: 'Cena rústica.',
      prepTimeMinutes: 15,
      ingredients: [
        { name: 'Arroz', quantity: 100, unit: 'g' },
        { name: 'Huevo', quantity: 1, unit: 'unid' }
      ],
      steps: [],
      healthyTip: ''
    },
    {
      title: 'Tortilla de Queso',
      description: 'Cena ligera.',
      prepTimeMinutes: 10,
      ingredients: [
        { name: 'Huevo', quantity: 3, unit: 'unid' },
        { name: 'Queso', quantity: 80, unit: 'g' }
      ],
      steps: [],
      healthyTip: ''
    }
  ];

  // Filtrar alimentos desagradados
  const dislikes = (preferences.dislikedFoods || '')
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean);

  const filterDisliked = (pool) => {
    if (dislikes.length === 0) return pool;
    return pool.filter(meal => {
      return !meal.ingredients.some(ing => 
        dislikes.some(d => ing.name.toLowerCase().includes(d) || d.includes(ing.name.toLowerCase()))
      );
    });
  };

  const finalBreakfasts = filterDisliked(breakfastsPool).length > 0 ? filterDisliked(breakfastsPool) : breakfastsPool;
  const finalLunches = filterDisliked(lunchesPool).length > 0 ? filterDisliked(lunchesPool) : lunchesPool;
  const finalSnacks = filterDisliked(snacksPool).length > 0 ? filterDisliked(snacksPool) : snacksPool;
  const finalDinners = filterDisliked(dinnersPool).length > 0 ? filterDisliked(dinnersPool) : dinnersPool;

  const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

  const shuffledBreakfasts = shuffleArray(finalBreakfasts);
  const shuffledLunches = shuffleArray(finalLunches);
  const shuffledSnacks = shuffleArray(finalSnacks);
  const shuffledDinners = shuffleArray(finalDinners);

  const dynamicPlanDays = ['Lunes', 'Martes', 'Miércoles'].map((dayName, idx) => {
    return {
      dayName,
      breakfast: shuffledBreakfasts[idx % shuffledBreakfasts.length],
      lunch: shuffledLunches[idx % shuffledLunches.length],
      snack: shuffledSnacks[idx % shuffledSnacks.length],
      dinner: shuffledDinners[idx % shuffledDinners.length]
    };
  });

  return {
    title: `Plan Semanal Culinario Inteligente (${preferences.householdSize || 2} personas)`,
    days: dynamicPlanDays
  };
};

module.exports = {
  generateSmartRecipes,
  optimizeCart,
  generateWeeklyMealPlan
};
