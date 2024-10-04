import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IRecipe } from '../types/IRecipe';
import { fetchRecipes } from '../api';
import { parseResponse } from '../utils';
import RecipeCard from '../components/RecipeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_RECIPES';

function RecipeFinder() {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [favorites, setFavorites] = useState<IRecipe[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
            if (savedFavorites !== null) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Failed to load favorites', error);
        }
    };

    const saveFavorites = async (favoritesToSave: IRecipe[]) => {
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesToSave));
        } catch (error) {
            console.error('Failed to save favorites', error);
        }
    };

    const handleSearch = async () => {
        if (query.trim() === '') {
            return;
        }
        setLoading(true);
        try {
            const chatResponse = await fetchRecipes(query);
            const parsedChatResponse = parseResponse(chatResponse);
            setRecipes(parsedChatResponse);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = (recipe: IRecipe) => {
        if (favorites.some((fav) => fav.title === recipe.title)) {
            const updatedFavorites = favorites.filter((fav) => fav.title !== recipe.title);
            setFavorites(updatedFavorites);
            saveFavorites(updatedFavorites);
            Alert.alert('Removed from Favorites', `${recipe.title} has been removed from your favorites.`);
        } else {
            const updatedFavorites = [...favorites, recipe];
            setFavorites(updatedFavorites);
            saveFavorites(updatedFavorites);
            Alert.alert('Added to Favorites', `${recipe.title} has been added to your favorites.`);
        }
    };

    const handleQueryChange = (text: string) => {
        setQuery(text);
        if (text.trim() === '') {
            setRecipes([]);
        }
    };

    const dataToRender = query.trim() === '' ? favorites : recipes;

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="What do you feel like eating?"
                    value={query}
                    onChangeText={handleQueryChange}
                    onSubmitEditing={handleSearch}
                    selectionColor="transparent"
                    underlineColorAndroid="transparent"
                />
                <Icon name="search" size={24} color="#666" style={styles.searchIcon} onPress={handleSearch} />
            </View>

            <Text style={styles.title}>
                {query.trim() === '' ? 'Favorites' : 'Suggested Recipes'}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6a0dad" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={dataToRender}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            onFavoritePress={() => handleFavorite(item)}
                            isFavorite={favorites.some(fav => fav.title === item.title)}
                        />
                    )}
                    keyExtractor={(item) => item.title}
                    contentContainerStyle={styles.recipeListContainer}
                />
            )}

            {query.trim() !== '' && !loading && (
                <TouchableOpacity style={styles.dislikeButton} onPress={() => setRecipes([])}>
                    <Text style={styles.dislikeText}>I don't like these</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 25,
        padding: 10,
        borderWidth: 1,
        borderColor: '#cfcfcf',
        width: '40%',
        alignSelf: 'center',
        marginBottom: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    searchIcon: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    recipeListContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    dislikeButton: {
        backgroundColor: '#6a0dad',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        width: '40%',
        alignSelf: 'center',
    },
    dislikeText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingIndicator: {
        marginTop: 50,
    },
});

export default RecipeFinder;
