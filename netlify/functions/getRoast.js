const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: "OK"
        };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, dob, pob } = JSON.parse(event.body);
        
        // Initialize with your Environment Variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Use "gemini-1.5-flash-latest" for the most stable endpoint
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `Act as a savage, Gen-Z astrologer. Roast this person brutally based on their birth info: 
        Name: ${name}, Born: ${pob} on ${dob}. 
        Keep it under 3 sentences. Use slang like 'mid', 'delulu', 'cooked', and 'ratioed'.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify({ roast: text })
        };
    } catch (error) {
        console.error("Gemini Error:", error.message);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "The stars are blocked: " + error.message })
        };
    }
};
