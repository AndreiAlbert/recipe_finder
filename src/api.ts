import axios from "axios";
import { apiKey, apiUrl } from "./constants";

export async function fetchRecipes(query: string) {
    console.log(apiKey);
    try {
        const response = await axios.post(
            apiUrl,
            {
                messages: [
                    {
                        "role": "system",
                        "content": "You are heling with finding recipes for all sorts of foods. Please for everything i ask provide a title, a list of ingredients and a list of instructions. Don't use markdown. Please provide just the recipes, i don't want anything else in the response."
                    },
                    {
                        "role": "user",
                        "content": `Give me a list of recipes for ${query}`
                    }
                ],
                max_tokens: 5000,
                temperature: 0.7,
                model: 'gpt-4o-mini',
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            }
        );
        const chatResponse: string = response.data.choices[0].message.content;
        return chatResponse;
    } catch (err: any) {
        throw new Error(err);
    }
}
