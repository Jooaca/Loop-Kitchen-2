const apiKey = 'vk_student-garcia_1RFrOicqSx8i17nBTow9rDTnUQGJuV87ZOWxJDsOUAU';

async function testCompact() {
  const res = await fetch('https://gemini-vertex-student-proxy.vercel.app/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      modelKey: 'flash',
      prompt: 'Genera en JSON un plan de 7 días hiper compacto. Formato exacto: {"title":"Plan Semanal","days":[{"day":"Lunes","b":"Avena","l":"Pollo","s":"Fruta","d":"Pescado"},{"day":"Martes","b":"Huevos","l":"Carne","s":"Yogurt","d":"Sopa"},{"day":"Miercoles","b":"Avena","l":"Pavo","s":"Nueces","d":"Ensalada"},{"day":"Jueves","b":"Tostadas","l":"Arroz con pollo","s":"Manzana","d":"Pescado"},{"day":"Viernes","b":"Batido","l":"Lentejas","s":"Almendras","d":"Pollo"},{"day":"Sabado","b":"Pancakes","l":"Salmon","s":"Barra","d":"Pizza saludable"},{"day":"Domingo","b":"Omelette","l":"Asado ligero","s":"Frutas","d":"Cena verde"}]}',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });
  const data = await res.json();
  console.log('Compact JSON Output:', data.text);
  console.log('Parsed successfully:', JSON.parse(data.text));
}

testCompact();
