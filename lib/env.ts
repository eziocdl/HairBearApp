import { z } from 'zod';

const envSchema = z.object({
    // Public env vars
    NEXT_PUBLIC_GEMINI_API_KEY: z.string().min(1, 'AIzaSyBCUe7djpBAvorog5hzuLCt-siSlyTOE4U'),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).default('false'),
    NEXT_PUBLIC_ENABLE_TENSORFLOW: z.enum(['true', 'false']).default('false'),

    // Server-side env vars
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;

// Type-safe helper to check if analytics is enabled
export const isAnalyticsEnabled = () => env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

// Type-safe helper to check if TensorFlow is enabled
export const isTensorFlowEnabled = () => env.NEXT_PUBLIC_ENABLE_TENSORFLOW === 'true';

// Type-safe helper to get Gemini API key
export const getGeminiApiKey = () => env.NEXT_PUBLIC_GEMINI_API_KEY;
