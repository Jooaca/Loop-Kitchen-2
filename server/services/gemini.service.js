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

  return [
    {
      title: 'Pollo Saltado con Cebolla y Tomate',
      description: 'Plato tradicional rápido y lleno de sabor.',
      prepTimeMinutes: 20,
      difficulty: 'Fácil',
      ingredients: [
        { name: 'Pollo', quantity: 300, unit: 'g', inPantry: true },
        { name: 'Tomate', quantity: 2, unit: 'unid', inPantry: true },
        { name: 'Cebolla', quantity: 1, unit: 'unid', inPantry: true },
        { name: 'Aceite de Oliva', quantity: 1, unit: 'cda', inPantry: true }
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
        { name: 'Arroz', quantity: 200, unit: 'g', inPantry: true },
        { name: 'Queso', quantity: 100, unit: 'g', inPantry: true },
        { name: 'Espinaca', quantity: 1, unit: 'atado', inPantry: true }
      ],
      steps: [
        'Cocinar el arroz de manera tradicional.',
        'Licuar hojas verdes con un toque de agua o caldo.',
        'Integrar el arroz cocido con el licuado verde y añadir el queso rallado hasta derretir.'
      ],
      nutritionalInfo: { calories: 390, protein: 16, carbs: 50, fats: 14 },
      healthyVariants: ['Reemplazar con arroz integral.'],
      tips: ['Servir de inmediato para disfrutar el queso fundido.']
    }
  ];
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
  const systemInstruction = 'Nutricionista y Chef de Loop Kitchen. Genera un menú de 3 días (Lunes a Miércoles) en JSON minificado.';

  const prompt = `
Genera un plan de 3 Días (Lunes, Martes, Miércoles) en JSON de tamaño mínimo para evitar truncación.
IMPORTANTE:
- "description": Máximo 2 palabras.
- "ingredients": Máximo 1 ingrediente por comida (incluyendo solo "name", "quantity" y "unit", omitir el campo "category").
- "steps": Dejar como array vacío [] para todas las comidas.
- "healthyTip": Dejar como string vacío "".

Formato JSON exacto:
{
  "title": "Plan 3 Dias",
  "days": [
    {
      "dayName": "Lunes",
      "breakfast": {
        "title": "Avena",
        "description": "Desayuno",
        "prepTimeMinutes": 5,
        "ingredients": [
          { "name": "Avena", "quantity": 50, "unit": "g" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "lunch": {
        "title": "Pollo",
        "description": "Almuerzo",
        "prepTimeMinutes": 10,
        "ingredients": [
          { "name": "Pollo", "quantity": 150, "unit": "g" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "snack": {
        "title": "Fruta",
        "description": "Merienda",
        "prepTimeMinutes": 5,
        "ingredients": [
          { "name": "Manzana", "quantity": 1, "unit": "unid" }
        ],
        "steps": [],
        "healthyTip": ""
      },
      "dinner": {
        "title": "Sopa",
        "description": "Cena",
        "prepTimeMinutes": 15,
        "ingredients": [
          { "name": "Tomate", "quantity": 2, "unit": "unid" }
        ],
        "steps": [],
        "healthyTip": ""
      }
    }
  ]
}
`;

  const aiResult = await callStudentProxy(prompt, systemInstruction, 'flash');

  if (aiResult && aiResult.days && aiResult.days.length >= 3) {
    return aiResult;
  }

  // Menú predeterminado DIVERSO para los 7 días si el servicio proxy devuelve fallback
  const diverseDaysData = [
    {
      dayName: 'Lunes',
      breakfast: {
        title: 'Tostadas de Palta y Huevo',
        description: 'Desayuno fresco y proteico.',
        prepTimeMinutes: 10,
        ingredients: [
          { name: 'Pan Integral', quantity: 2, unit: 'rebanadas', category: 'Granos' },
          { name: 'Huevo', quantity: 2, unit: 'unid', category: 'Proteínas' },
          { name: 'Palta', quantity: 1, unit: 'unid', category: 'Verduras' }
        ],
        steps: [
          'Tostar las rebanadas de pan integral.',
          'Cocinar los huevos a la plancha o escalfados.',
          'Moler la palta con sal y pimienta y montar sobre el tostado con el huevo por encima.'
        ],
        healthyTip: 'Añadir semillas de chía o sésamo por encima.'
      },
      lunch: {
        title: 'Pollo al Limón con Quinoa y Brócoli',
        description: 'Almuerzo equilibrado alto en proteínas y fibra.',
        prepTimeMinutes: 25,
        ingredients: [
          { name: 'Pechuga de Pollo', quantity: 200, unit: 'g', category: 'Proteínas' },
          { name: 'Quinoa', quantity: 80, unit: 'g', category: 'Granos' },
          { name: 'Brócoli', quantity: 150, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Cocinar la quinoa en agua hirviendo durante 15 minutos.',
          'Dorar la pechuga de pollo a la plancha con jugo de limón fresco y especias.',
          'Cocinar el brócoli al vapor por 5 minutos y emplatar juntamente con la quinoa.'
        ],
        healthyTip: 'Usar aceite de oliva virgen extra en crudo.'
      },
      snack: {
        title: 'Yogurt Griego con Arándanos y Almendras',
        description: 'Merienda alta en proteínas.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Yogurt Griego', quantity: 150, unit: 'g', category: 'Lácteos' },
          { name: 'Arándanos', quantity: 50, unit: 'g', category: 'Frutas' },
          { name: 'Almendras', quantity: 20, unit: 'g', category: 'Frutos Secos' }
        ],
        steps: [
          'Servir el yogurt en un bowl.',
          'Añadir arándanos frescos lavados y las almendras laminadas.'
        ],
        healthyTip: 'Evitar yogures con azúcares agregados.'
      },
      dinner: {
        title: 'Salmón o Pescado a la Plancha con Ensalada',
        description: 'Cena ligera digestiva.',
        prepTimeMinutes: 18,
        ingredients: [
          { name: 'Fillete de Pescado', quantity: 200, unit: 'g', category: 'Proteínas' },
          { name: 'Ensalada Verde Mix', quantity: 150, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Sazonar el pescado con ajo en polvo y sal de mar.',
          'Cocinar en sartén antiadherente por 4 minutos cada lado.',
          'Acompañar con ensalada de hojas verdes aderezada con limón.'
        ],
        healthyTip: 'Cenar 2 horas antes de dormir.'
      }
    },
    {
      dayName: 'Martes',
      breakfast: {
        title: 'Pancakes de Avena y Banana',
        description: 'Desayuno dulce natural sin azúcar añadida.',
        prepTimeMinutes: 15,
        ingredients: [
          { name: 'Avena', quantity: 60, unit: 'g', category: 'Granos' },
          { name: 'Banana', quantity: 1, unit: 'unid', category: 'Frutas' },
          { name: 'Huevo', quantity: 1, unit: 'unid', category: 'Proteínas' }
        ],
        steps: [
          'Licuar la banana, el huevo y la avena hasta obtener una mezcla homogénea.',
          'Verter porciones en una sartén caliente a fuego medio.',
          'Cocinar 2 minutos por lado hasta dorar.'
        ],
        healthyTip: 'Acompañar con frutas frescas en trozos.'
      },
      lunch: {
        title: 'Carne Magra al Horno con Papas Rústicas',
        description: 'Almuerzo reconfortante y nutritivo.',
        prepTimeMinutes: 35,
        ingredients: [
          { name: 'Carne Magra', quantity: 200, unit: 'g', category: 'Proteínas' },
          { name: 'Papa', quantity: 2, unit: 'unid', category: 'Verduras' },
          { name: 'Zanahoria', quantity: 1, unit: 'unid', category: 'Verduras' }
        ],
        steps: [
          'Cortar las papas en gajos y sazonar con romero y pimienta.',
          'Colocar la carne y las papas en una bandeja para horno a 200°C por 30 min.',
          'Servir caliente.'
        ],
        healthyTip: 'Mantener la piel de las papas para consumir más fibra.'
      },
      snack: {
        title: 'Manzana con Mantequilla de Maní',
        description: 'Merienda crujiente y enérgetica.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Manzana', quantity: 1, unit: 'unid', category: 'Frutas' },
          { name: 'Mantequilla de Maní', quantity: 1, unit: 'cda', category: 'Frutos Secos' }
        ],
        steps: [
          'Cortar la manzana en gajos finos.',
          'Untar con una cucharada de mantequilla de maní 100% natural.'
        ],
        healthyTip: 'Verificar que la mantequilla de maní no contenga aceites hidrogenados.'
      },
      dinner: {
        title: 'Tarta Ligera de Zuccini y Queso',
        description: 'Cena vegetariana rica y suave.',
        prepTimeMinutes: 25,
        ingredients: [
          { name: 'Zuccini', quantity: 2, unit: 'unid', category: 'Verduras' },
          { name: 'Huevo', quantity: 2, unit: 'unid', category: 'Proteínas' },
          { name: 'Queso magro', quantity: 80, unit: 'g', category: 'Lácteos' }
        ],
        steps: [
          'Rallar el zuccini y escurrir el exceso de agua.',
          'Mezclar con los huevos batidos y el queso magro.',
          'Hornear o cocinar en sartén tapada a fuego lento por 15 minutos.'
        ],
        healthyTip: 'Añadir orégano o tomillo fresco.'
      }
    },
    {
      dayName: 'Miércoles',
      breakfast: {
        title: 'Bowl de Avena Nocturna con Chía',
        description: 'Desayuno cremoso y saciante.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Avena', quantity: 50, unit: 'g', category: 'Granos' },
          { name: 'Leche de Almendras', quantity: 150, unit: 'ml', category: 'Lácteos' },
          { name: 'Semillas de Chía', quantity: 1, unit: 'cda', category: 'Granos' }
        ],
        steps: [
          'Mezclar la avena, la leche de almendras y las semillas de chía en un frasco.',
          'Dejar reposar en el refrigerador durante la noche.',
          'Disfrutar con un toque de canela al despertar.'
        ],
        healthyTip: 'Preparar varios frascos el domingo para ahorrar tiempo.'
      },
      lunch: {
        title: 'Wok de Pavo o Pollo con Salteado de Vegetales',
        description: 'Almuerzo colorido con estilo asiático.',
        prepTimeMinutes: 20,
        ingredients: [
          { name: 'Pechuga de Pavo', quantity: 180, unit: 'g', category: 'Proteínas' },
          { name: 'Pimiento Rojo y Verde', quantity: 1, unit: 'unid', category: 'Verduras' },
          { name: 'Cebolla', quantity: 1, unit: 'unid', category: 'Verduras' }
        ],
        steps: [
          'Cortar la proteína y los vegetales en juliana.',
          'Saltear la proteína a fuego fuerte en sartén de wok.',
          'Agregar los vegetales, sazonar con salsa de soya reducida en sodio y servir.'
        ],
        healthyTip: 'Cocinar los vegetales al dente para mantener sus vitaminas.'
      },
      snack: {
        title: 'Licuado Proteico de Frutilla y Proteína',
        description: 'Batido refrescante post-entrenamiento.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Frutillas', quantity: 100, unit: 'g', category: 'Frutas' },
          { name: 'Leche o Agua', quantity: 200, unit: 'ml', category: 'Lácteos' }
        ],
        steps: [
          'Licuar todos los ingredientes con hielo hasta obtener una textura suave.'
        ],
        healthyTip: 'Consumir inmediatamente después de preparar.'
      },
      dinner: {
        title: 'Crema de Calabaza y Semillas Tostadas',
        description: 'Cena reconfortante y baja en calorías.',
        prepTimeMinutes: 25,
        ingredients: [
          { name: 'Calabaza', quantity: 300, unit: 'g', category: 'Verduras' },
          { name: 'Semillas de Zapallo', quantity: 1, unit: 'cda', category: 'Granos' }
        ],
        steps: [
          'Hervir la calabaza cortada en cubos con un toque de caldo vegetal.',
          'Licuar hasta lograr una crema fina y sazonar con nuez moscada.',
          'Decorar con semillas de zapallo tostadas por encima.'
        ],
        healthyTip: 'Añadir un chorrito de aceite de oliva en crudo al servir.'
      }
    },
    {
      dayName: 'Jueves',
      breakfast: {
        title: 'Omelette de Champignones y Espinaca',
        description: 'Desayuno salado rico en hierro y proteínas.',
        prepTimeMinutes: 12,
        ingredients: [
          { name: 'Huevo', quantity: 2, unit: 'unid', category: 'Proteínas' },
          { name: 'Espinaca fresca', quantity: 50, unit: 'g', category: 'Verduras' },
          { name: 'Champignones', quantity: 60, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Saltear los champignones y la espinaca en una sartén con spray de cocina.',
          'Verter los huevos batidos sobre los vegetales.',
          'Doblar el omelette a la mitad cuando cuaje y servir.'
        ],
        healthyTip: 'Usar sartenes antiadherentes para cocinar con menos aceite.'
      },
      lunch: {
        title: 'Pastel de Papas y Carne Magra Saludable',
        description: 'Clásico familiar en versión saludable.',
        prepTimeMinutes: 35,
        ingredients: [
          { name: 'Carne Picada Magra', quantity: 200, unit: 'g', category: 'Proteínas' },
          { name: 'Puré de Papa', quantity: 200, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Cocinamos la carne picada con cebolla y morrón.',
          'Colocar la carne en una fuente para horno y cubrir con el puré de papas.',
          'Gratinar en el horno por 15 minutos.'
        ],
        healthyTip: 'Preparar el puré de papas sin mantequilla excesiva.'
      },
      snack: {
        title: 'Tostada Integral con Hummus',
        description: 'Merienda vegetal con proteínas de legumbres.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Pan Integral', quantity: 1, unit: 'rebanada', category: 'Granos' },
          { name: 'Hummus de Garbanzo', quantity: 2, unit: 'cdas', category: 'Proteínas' }
        ],
        steps: [
          'Tostar el pan y untar generosamente con el hummus.'
        ],
        healthyTip: 'Espolvorear pimentón dulce o comino por encima.'
      },
      dinner: {
        title: 'Ensalada Caesar Saludable con Pollo',
        description: 'Cena crujiente y sabrosa.',
        prepTimeMinutes: 15,
        ingredients: [
          { name: 'Pechuga de Pollo', quantity: 150, unit: 'g', category: 'Proteínas' },
          { name: 'Lechuga Romana', quantity: 150, unit: 'g', category: 'Verduras' },
          { name: 'Yogurt para aderezo', quantity: 2, unit: 'cdas', category: 'Lácteos' }
        ],
        steps: [
          'Cocinar el pollo a la plancha en cubos.',
          'Lavar la lechuga romana y mezclar con el aderezo a base de yogurt y ajo.',
          'Servir el pollo sobre la lechuga.'
        ],
        healthyTip: 'Usar yogurt natural en lugar de mayonesa comercial.'
      }
    },
    {
      dayName: 'Viernes',
      breakfast: {
        title: 'Toast de Ricota, Frutillas y Miel',
        description: 'Desayuno fresco y suave.',
        prepTimeMinutes: 8,
        ingredients: [
          { name: 'Pan de Masa Madre', quantity: 1, unit: 'rebanada', category: 'Granos' },
          { name: 'Ricota Magra', quantity: 50, unit: 'g', category: 'Lácteos' },
          { name: 'Frutillas', quantity: 4, unit: 'unid', category: 'Frutas' }
        ],
        steps: [
          'Tostar la rebanada de pan.',
          'Untar con ricota magra y colocar las frutillas laminadas.',
          'Decorar con unas gotas de miel.'
        ],
        healthyTip: 'La ricota es una excelente fuente de proteína de suero.'
      },
      lunch: {
        title: 'Lasaña de Berenjenas y Queso Magro',
        description: 'Almuerzo rico en hortalizas sin harina refinada.',
        prepTimeMinutes: 35,
        ingredients: [
          { name: 'Berenjena', quantity: 2, unit: 'unid', category: 'Verduras' },
          { name: 'Salsa de Tomate natural', quantity: 150, unit: 'g', category: 'Verduras' },
          { name: 'Queso Magro', quantity: 100, unit: 'g', category: 'Lácteos' }
        ],
        steps: [
          'Cortar las berenjenas en láminas a lo largo y dorarlas a la plancha.',
          'Intercalar en un recipiente capas de berenjena, salsa de tomate y queso.',
          'Horno a 190°C por 20 minutos hasta derretir el queso.'
        ],
        healthyTip: 'Dejar reposar 5 minutos antes de cortar.'
      },
      snack: {
        title: 'Puñado de Frutos Secos e Higo Seco',
        description: 'Snack energético para el viernes por la tarde.',
        prepTimeMinutes: 2,
        ingredients: [
          { name: 'Nueces y Almendras', quantity: 30, unit: 'g', category: 'Frutos Secos' }
        ],
        steps: [
          'Servir en una porción controlada y disfrutar.'
        ],
        healthyTip: 'Ideal para combatir el cansancio de fin de semana.'
      },
      dinner: {
        title: 'Pizza Saludable con Base de Queso y Avena',
        description: 'Cena divertida para el viernes sin culpa.',
        prepTimeMinutes: 25,
        ingredients: [
          { name: 'Avena o Harina Integral', quantity: 80, unit: 'g', category: 'Granos' },
          { name: 'Queso Mozzarella magra', quantity: 80, unit: 'g', category: 'Lácteos' },
          { name: 'Tomate y Orégano', quantity: 100, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Mezclar la avena con agua y clara de huevo para formar la masa fina.',
          'Precocinar la masa 8 minutos al horno.',
          'Colocar tomate, queso y tus vegetales favoritos y hornear 10 minutos más.'
        ],
        healthyTip: 'Agregar rúcula fresca sobre la pizza terminada.'
      }
    },
    {
      dayName: 'Sábado',
      breakfast: {
        title: 'Huevos Revueltos con Tomates Cherry',
        description: 'Desayuno relajado de fin de semana.',
        prepTimeMinutes: 10,
        ingredients: [
          { name: 'Huevo', quantity: 2, unit: 'unid', category: 'Proteínas' },
          { name: 'Tomate Cherry', quantity: 6, unit: 'unid', category: 'Verduras' }
        ],
        steps: [
          'Saltear los tomates cherry partidos a la mitad en la sartén.',
          'Incorporar los huevos batidos a fuego lento sin dejar de revolver.'
        ],
        healthyTip: 'Retirar del fuego cuando sigan jugosos.'
      },
      lunch: {
        title: 'Hamburguesa Casera de Lentejas o Carne Magra',
        description: 'Almuerzo sabroso de sábado.',
        prepTimeMinutes: 25,
        ingredients: [
          { name: 'Medallón de Carne o Lenteja', quantity: 1, unit: 'unid', category: 'Proteínas' },
          { name: 'Pan de Hamburguesa Integral', quantity: 1, unit: 'unid', category: 'Granos' },
          { name: 'Lechuga y Tomate', quantity: 50, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Cocinar el medallón a la plancha.',
          'Tostar el pan integral.',
          'Armar la hamburguesa con vegetales frescos y mostaza.'
        ],
        healthyTip: 'Sustituir la mayonesa tradicional por palta pisada.'
      },
      snack: {
        title: 'Pororó / Pipocas Caseras sin Azúcar',
        description: 'Merienda de película.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Maíz Pisingallo', quantity: 40, unit: 'g', category: 'Granos' }
        ],
        steps: [
          'Hacer el maíz en olla tapada con unas gotas de aceite.',
          'Sazonar con una pizca de sal marina.'
        ],
        healthyTip: 'Excelente fuente de fibra natural sin grasas trans.'
      },
      dinner: {
        title: 'Tacos de Pollo y Vegetales en Hojas de Lechuga',
        description: 'Cena mexicana ligera y divertida.',
        prepTimeMinutes: 20,
        ingredients: [
          { name: 'Pollo desmenuzado', quantity: 180, unit: 'g', category: 'Proteínas' },
          { name: 'Hojas grandes de Lechuga', quantity: 4, unit: 'unid', category: 'Verduras' },
          { name: 'Pimiento y Cebolla', quantity: 100, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Saltear la cebolla, el pimiento y el pollo sazonado con comino y paprika.',
          'Usar las hojas de lechuga lavadas como tortillas.',
          'Rellenar los tacos y disfrutar.'
        ],
        healthyTip: 'Añadir unas gotas de lima o salsa picante casera.'
      }
    },
    {
      dayName: 'Domingo',
      breakfast: {
        title: 'Waffles o Tostadas Francesas de Avena',
        description: 'Desayuno especial de domingo.',
        prepTimeMinutes: 15,
        ingredients: [
          { name: 'Pan Integral o Avena', quantity: 60, unit: 'g', category: 'Granos' },
          { name: 'Huevo y Canela', quantity: 1, unit: 'unid', category: 'Proteínas' }
        ],
        steps: [
          'Pasar el pan por huevo batido con leche y canela.',
          'Dorar en sartén por ambos lados.',
          'Servir con frutas de estación.'
        ],
        healthyTip: 'Endulzar con canela en lugar de almíbares calóricos.'
      },
      lunch: {
        title: 'Asado Magro o Pollo al Horno con Ensalada Rusa Saludable',
        description: 'Almuerzo dominical tradicional adaptado.',
        prepTimeMinutes: 40,
        ingredients: [
          { name: 'Pollo o Carne', quantity: 250, unit: 'g', category: 'Proteínas' },
          { name: 'Papa y Zanahoria hervida', quantity: 150, unit: 'g', category: 'Verduras' },
          { name: 'Yogurt o Mayonesa Light', quantity: 1, unit: 'cda', category: 'Lácteos' }
        ],
        steps: [
          'Cocinar la proteína al horno con hierbas aromáticas.',
          'Hervir cubos de papa y zanahoria.',
          'Mezclar los vegetales con una cucharada de aderezo liviano y servir.'
        ],
        healthyTip: 'Disfrutar en familia lentamente.'
      },
      snack: {
        title: 'Taza de Té Verde con Galletas de Avena',
        description: 'Merienda tranquila para finalizar el fin de semana.',
        prepTimeMinutes: 5,
        ingredients: [
          { name: 'Galletas de Avena caseras', quantity: 2, unit: 'unid', category: 'Granos' }
        ],
        steps: [
          'Preparar una infusión caliente y acompañar con las galletas.'
        ],
        healthyTip: 'El té verde aporta antioxidantes favorecedores de la digestión.'
      },
      dinner: {
        title: 'Sopa Detox de Vegetales Mixtos',
        description: 'Cena reparadora para iniciar la semana renovado.',
        prepTimeMinutes: 20,
        ingredients: [
          { name: 'Zapallito, Zapallo y Espinaca', quantity: 250, unit: 'g', category: 'Verduras' }
        ],
        steps: [
          'Hervir las verduras en caldo casero de verduras.',
          'Procesar ligeramente y servir con un toque de queso magro.'
        ],
        healthyTip: 'Ayuda a hidratar el cuerpo durante la noche.'
      }
    }
  ];

  return {
    title: `Plan Semanal Culinario Variado (${preferences.householdSize || 2} personas)`,
    days: diverseDaysData
  };
};

module.exports = {
  generateSmartRecipes,
  optimizeCart,
  generateWeeklyMealPlan
};
