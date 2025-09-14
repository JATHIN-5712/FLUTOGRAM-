import { GoogleGenAI, Type } from "@google/genai";
// FIX: Added .ts extension to import path
import type { Post } from '../types.ts';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const postSchema = {
    type: Type.OBJECT,
    properties: {
        content: {
            type: Type.STRING,
            description: "The main text content of the social media post. Should be engaging and creative.",
        },
        imageUrl: {
            type: Type.STRING,
            description: "A URL for a relevant, high-quality image for the post. Use a https://picsum.photos URL with a unique seed.",
        },
    },
    required: ["content"],
};

const responseSchema = {
    type: Type.ARRAY,
    items: postSchema,
};


export const generateSuggestedPosts = async (): Promise<Partial<Post>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 creative and engaging social media posts. 
      The topics can range from technology breakthroughs, stunning travel destinations, delicious food recipes, or funny observations about daily life.
      For each post, provide engaging content and an optional image URL from picsum.photos. 
      For image URLs, use a different seed for each, for example: https://picsum.photos/seed/travel1/600/400`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const generatedPosts = JSON.parse(jsonText) as Partial<Post>[];
    
    return generatedPosts.map((post, index) => ({
      ...post,
      id: `${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
      likes: { count: Math.floor(Math.random() * 200) + 10, users: [] },
      comments: [],
    }));
    
  } catch (error) {
    console.error("Error generating suggested posts:", error);
    return [];
  }
};