import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, Animated, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env'; 

const MovieItem = ({ item, onSelect, isFavourite }) => {
  if (!item.Poster || item.Poster === 'N/A') {
    return (
      <View style={styles.movieItem}>
        <Text>No Movie Found</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={() => isFavourite ? onSelect(item) : onSelect(item.imdbID)} 
      style={styles.touchable}
    >
      <Image
        source={{ uri: item.Poster }}
        style={styles.poster}
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.Title}</Text>
        <Text style={styles.movieInfo}>{item.Year}</Text>
        <Text style={styles.movieInfo}>{item.Type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [animation] = useState(new Animated.Value(1));

  const getMovieRequest = async (searchValue) => {
    try {
      const url = searchValue 
      ?`http://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`
      : `http://www.omdbapi.com/?s=top&apikey=${API_KEY}`;

    const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson.Search) {
        setMovies(responseJson.Search);
        setSelectedMovie(null);
      } 
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchMovieDetails = async (movie) => {
    try {
      const imdbID = typeof movie === 'string' ? movie : movie.imdbID;
      const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const movieDetails = await response.json();
      
      if (movieDetails.Response === 'True') {
        setSelectedMovie(movieDetails);
      } else {
        Alert.alert('Error', movieDetails.Error || 'Unable to fetch movie details');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      Alert.alert('Error', 'Unable to fetch movie details');
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const movieFavourites = await AsyncStorage.getItem('react-movie-app-favourites');
        if (movieFavourites) {
          setFavourites(JSON.parse(movieFavourites));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadFavourites();
  }, []);

  const saveToLocalStorage = async (items) => {
    try {
      await AsyncStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
    } catch (error) {
      console.error(error);
    }
  };

  const addFavouriteMovie = (movie) => {
    const isAlreadyFavourite = favourites.some((favourite) => favourite.imdbID === movie.imdbID);
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
    animate();
    setSelectedMovie(null); 
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
    animate();
    setSelectedMovie(null); 
  };

  const animate = () => {
    Animated.spring(animation, {
      toValue: 1.03,
      friction: 2,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animation, {
        toValue: 1.03,
        friction: 2,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, { textAlign: 'center' }]}>Movies</Text>
        <TextInput
          style={styles.searchBox}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search movies..."
          placeholderTextColor="#888"
        />
      </View>
      {!selectedMovie ? (
        <>
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieItem 
                item={item} 
                onSelect={fetchMovieDetails} 
                isFavourite={false} 
              />
            )}
            keyExtractor={(item) => `movie-${item.imdbID}`}
            style={styles.movieList}
            contentContainerStyle={styles.flatListContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={21}
          />
          <View style={styles.header}>
            <Text style={[styles.heading, { textAlign: 'center' }]}>Favourites</Text>
          </View>
          <FlatList
            data={favourites}
            renderItem={({ item }) => (
              <MovieItem 
                item={item} 
                onSelect={fetchMovieDetails} 
                isFavourite={true} 
              />
            )}
            keyExtractor={(item) => `favourite-${item.imdbID}`}
            style={styles.movieList}
            contentContainerStyle={styles.flatListContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={21}
          />
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <Animated.Image
            source={{ uri: selectedMovie.Poster }}
            style={[styles.detailsPoster, { transform: [{ scale: animation }] }]}
          />
          <View style={styles.detailsContent}>
            <Text style={styles.detailsTitle}>{selectedMovie.Title}</Text>
            <Text style={styles.detailsYear}>Year: {selectedMovie.Year}</Text>
            <Text style={styles.detailsDirector}>Director: {selectedMovie.Director}</Text>
            <Text style={styles.detailsPlot}>Plot: {selectedMovie.Plot}</Text>
            <Text style={styles.detailsRuntime}>Runtime: {selectedMovie.Runtime}</Text>
            <Text style={styles.detailsReleased}>Released: {selectedMovie.Released}</Text>
            <Text style={styles.detailsGenre}>Genre: {selectedMovie.Genre}</Text>
            <Text style={styles.detailsRating}>Rating: {selectedMovie.imdbRating}</Text>
            {favourites.some(fav => fav.imdbID === selectedMovie.imdbID) ? (
              <TouchableOpacity 
                style={styles.addToFavoritesButton}
                onPress={() => removeFavouriteMovie(selectedMovie)}
              >
                <Text style={styles.addToFavoritesText}>Remove from Favorites</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addToFavoritesButton}
                onPress={() => addFavouriteMovie(selectedMovie)}
              >
                <Text style={styles.addToFavoritesText}>Add to Favorites</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedMovie(null)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    marginTop: 10,
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 104,
    color: 'white',
  },
  movieList: {
    marginVertical: 8,
  },
  flatListContent: {
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  movieItem: {
    marginHorizontal: 8,
    width: 250,
    height: 250,
    borderRadius: 12,
    overflow: 'scroll',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    padding: 0,
    borderRadius: 10,
    marginBottom: 14,
  },
  poster: {
    width: '70%',
    height: 300,
    resizeMode: 'cover',
    paddingHorizontal: 8,
  },
  movieDetails: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f2e36',
    marginHorizontal: 10,
    borderRadius: 35,
  },
  movieTitle: {
    fontSize: 16,
    minWidth: 250,
    maxWidth: 250,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  movieInfo: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  detailsPoster: {
    width: 300,
    height: 450,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  detailsYear: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 5,
  },
  detailsDirector: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 5,
  },
  detailsPlot: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  detailsRuntime: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  detailsReleased: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  detailsGenre: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  detailsRating: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  addToFavoritesButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToFavoritesText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom:50
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;