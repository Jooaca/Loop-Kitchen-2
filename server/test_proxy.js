const apiKey = 'vk_student-garcia_1RFrOicqSx8i17nBTow9rDTnUQGJuV87ZOWxJDsOUAU';

async function testProxy() {
  try {
    const res = await fetch('https://gemini-vertex-student-proxy.vercel.app/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        modelKey: 'flash',
        prompt: 'Responde unicamente en JSON con la clave message: {"message": "hola desde proxy"}',
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await res.json();
    console.log('[Test Proxy Response]:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Proxy Test Error:', err);
  }
}

testProxy();
