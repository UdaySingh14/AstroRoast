const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "OK" };

    try {
        const { name, dob, pob } = JSON.parse(event.body);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // SWITCHING TO THE MOST STABLE BASIC MODEL
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

        const prompt = `Roast this person brutally: Name: ${name}, Born: ${pob} on ${dob}. Use Gen-Z slang. Max 2 sentences.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ roast: response.text() })
        };
    } catch (error) {
        console.error("Gemini Error:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "API Error: " + error.message })
        };
    }
};
