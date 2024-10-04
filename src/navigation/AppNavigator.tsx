import React from 'react';
import { View, StyleSheet } from 'react-native'; // Added StyleSheet for styles
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeFinder from '../pages/RecipeFinder';
import RecipeDetails from '../pages/RecipeDetails';
import { IRecipe } from '../types/IRecipe';

export type RootStackParamList = {
    RecipeFinder: undefined;
    RecipeDetails: { recipe: IRecipe };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="RecipeFinder">
                <Stack.Screen name="RecipeFinder" component={RecipeFinder} options={{ title: 'Recipes' }} />
                <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ title: 'Recipe Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default AppNavigator;

