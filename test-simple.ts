import { GoogleGenerativeAI } from '@google/generative-ai';

async function testModel() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAyJ97A_xZH7_hwrc2e7JGUoSCrVpezhuw';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('Testing model access...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        const result = await model.generateContent("Hello, are you there?");
        console.log('Response:', result.response.text());
        console.log('Model access successful!');
    } catch (error) {
        console.error('Error accessing model:', error);
    }
}

testModel();
