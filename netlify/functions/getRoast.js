const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // 1. Handle Preflight (Important for some browsers)
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Only POST allowed, buddy!" };
    }

    try {
        const { name, dob, pob } = JSON.parse(event.body);
        
        // 2. Check if API Key exists
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in Netlify settings!");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-1.5-flash because it is super fast and free
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a mean, sarcastic astrologer. Roast this person: 
        Name: ${name}, Born: ${pob} on ${dob}. 
        Use Gen-Z slang like 'mid', 'L', 'cooked'. Keep it under 50 words. Be funny but savage.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const roastText = response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roast: roastText }),
        };
    } catch (error) {
        console.error("DEBUG ERROR:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "The stars are broken: " + error.message }),
        };
    }
};
