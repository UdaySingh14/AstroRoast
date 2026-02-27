const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // 1. Setup CORS so your website can talk to the function
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    try {
        const { name, dob, pob } = JSON.parse(event.body);
        
        // 2. Initialize with your Key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 3. FIX: Use the stable model name without the "-latest" suffix
        // This is the most compatible name across all API versions
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a savage Gen-Z astrologer. Roast this person brutally. 
        Name: ${name}, Born: ${pob} on ${dob}. 
        Use slang like 'cooked', 'L', 'mid'. Max 3 sentences.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ roast: text })
        };
    } catch (error) {
        console.error("DEBUG:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "The stars are blocked: " + error.message })
        };
    }
};
