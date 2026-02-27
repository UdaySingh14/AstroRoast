const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { name, dob, pob } = JSON.parse(event.body);
    
    // 1. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. The Savage Prompt
    const prompt = `Act as a mean, sarcastic astrologer. Roast this person: 
    Name: ${name}, Date of Birth: ${dob}, Place of Birth: ${pob}. 
    Use Gen-Z slang like 'L', 'mid', 'delulu'. Keep it under 3 sentences.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roastText = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ roast: roastText }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Cosmic Error!" }) };
  }
};
