import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRecipe } from '../types/IRecipe';

const FAVORITES_KEY = 'FAVORITE_RECIPES';

interface RecipeDetailsProps {
    route: RouteProp<{ params: { recipe: IRecipe } }, 'params'>;
}

function RecipeDetails() {
    const route = useRoute<RecipeDetailsProps['route']>();
    const { recipe } = route.params;

    const [favorites, setFavorites] = useState<IRecipe[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        loadFavorites();
        const screenWidth = Dimensions.get('window').width;
        setIsMobile(screenWidth < 768);
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
            if (savedFavorites !== null) {
                const favoritesArray = JSON.parse(savedFavorites) as IRecipe[];
                setFavorites(favoritesArray);
                setIsFavorite(favoritesArray.some((fav) => fav.title === recipe.title));
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

    const toggleFavorite = () => {
        if (isFavorite) {
            const updatedFavorites = favorites.filter((fav) => fav.title !== recipe.title);
            setFavorites(updatedFavorites);
            saveFavorites(updatedFavorites);
            setIsFavorite(false);
            Alert.alert('Removed from Favorites', `${recipe.title} has been removed from your favorites.`);
        } else {
            const updatedFavorites = [...favorites, recipe];
            setFavorites(updatedFavorites);
            saveFavorites(updatedFavorites);
            setIsFavorite(true);
            Alert.alert('Added to Favorites', `${recipe.title} has been added to your favorites.`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.contentWrapper, isMobile && styles.mobileLayout]}>
                <View style={styles.leftColumn}>
                    <Image
                        style={styles.image}
                        source={{ uri: 'placeholder_image_url' }}
                    />
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{recipe.title}</Text>
                        <TouchableOpacity onPress={toggleFavorite}>
                            <Icon name="favorite" size={28} color={isFavorite ? 'purple' : 'gray'} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.time}>20 min.</Text>
                </View>

                <View style={styles.rightColumn}>
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    <Text style={styles.text}>{recipe.ingredients}</Text>

                    <Text style={styles.sectionTitle}>Instructions:</Text>
                    <Text style={styles.text}>{recipe.instructions}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    contentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mobileLayout: {
        flexDirection: 'column',
    },
    leftColumn: {
        flex: 1,
        justifyContent: 'flex-start',
        marginRight: 20,
        marginBottom: 20,
    },
    rightColumn: {
        flex: 2,
    },
    image: {
        width: 200,
        height: 200,
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
        borderRadius: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    icon: {
        marginLeft: 10,
    },
    time: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
    },
});

export default RecipeDetails;

