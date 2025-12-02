import { GoogleGenerativeAI } from '@google/generative-ai';

async function testModelWithImage() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAyJ97A_xZH7_hwrc2e7JGUoSCrVpezhuw';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('Testing model: gemini-2.0-flash-exp-image-generation');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

        // 1x1 pixel red dot base64
        const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        const prompt = "Change the color of this pixel to blue";

        console.log('Sending request...');
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/png",
                },
            },
        ]);

        console.log('Response received');
        console.log(JSON.stringify(result.response, null, 2));

    } catch (error) {
        console.error('Error accessing model:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            // @ts-ignore
            if (error.response) {
                // @ts-ignore
                console.error('API Error Details:', JSON.stringify(error.response, null, 2));
            }
        }
    }
}

testModelWithImage();
