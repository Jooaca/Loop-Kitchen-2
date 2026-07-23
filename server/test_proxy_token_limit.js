const apiKey = 'vk_student-garcia_1RFrOicqSx8i17nBTow9rDTnUQGJuV87ZOWxJDsOUAU';

async function testTokenLimit() {
  const res = await fetch('https://gemini-vertex-student-proxy.vercel.app/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      modelKey: 'flash',
      prompt: 'Genera 2 recetas hiper breves en JSON: [{"t":"a","d":"b"}]',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 500
      }
    })
  });
  const data = await res.json();
  console.log('Short Response JSON test:', data.text);
}

testTokenLimit();
