import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IRecipe } from '../types/IRecipe';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface RecipeCardProps {
    recipe: IRecipe;
    onFavoritePress: () => void;
    isFavorite: boolean
};

type RecipeDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetails'>;

function RecipeCard({ recipe, onFavoritePress, isFavorite }: RecipeCardProps) {
    const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();

    const handlePress = () => {
        navigation.navigate('RecipeDetails', { recipe });
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <Text style={styles.time}>20 min.</Text>
                </View>

                <TouchableOpacity onPress={onFavoritePress}>
                    <Icon
                        name="favorite"
                        size={24}
                        color={isFavorite ? 'purple' : 'gray'}
                        style={styles.favoriteIcon}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        width: '95%',
        alignSelf: 'center',
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        tintColor: '#ccc',
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    time: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    favoriteIcon: {
        marginLeft: 10,
    },
});


export default RecipeCard;

