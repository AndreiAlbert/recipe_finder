import { IRecipe } from "./types/IRecipe";

export function parseResponse(content: string) {
    const lines = content.split('\n').map(line => line.trim());
    const recipes: IRecipe[] = [];

    let currentRecipe: Partial<IRecipe> = {};
    let ingredients: string[] = [];
    let instructions: string[] = [];

    lines.forEach((line) => {
        if (line.startsWith("Title:")) {
            if (currentRecipe.title) {
                recipes.push({
                    title: currentRecipe.title!,
                    ingredients: ingredients.join('\n'),
                    instructions: instructions.join('\n')
                });
                ingredients = [];
                instructions = [];
            }
            currentRecipe.title = line.replace("Title: ", "").trim();
        } else if (line.startsWith("Ingredients:")) {
        } else if (line.startsWith("Instructions:")) {
        } else if (line.startsWith("-")) {
            ingredients.push(line);
        } else if (line.match(/^\d+\./)) {
            instructions.push(line);
        }
    });

    if (currentRecipe.title) {
        recipes.push({
            title: currentRecipe.title!,
            ingredients: ingredients.join('\n'),
            instructions: instructions.join('\n')
        });
    }

    return recipes;
}
