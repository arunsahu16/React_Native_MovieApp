# React Native Movie App Documentation

## 1. Project Overview

### Project Name: React Native Movie App

### Description:
The React Native Movie App allows users to search for movies, view details, and add them to their favorites list. The app fetches movie data from the OMDB API and stores favorite movies using AsyncStorage. Users can browse movies and manage their favorites seamlessly.

### Features:
- Movie search functionality
- Displaying movie details
- Adding/removing movies to/from favorites
- Persistent storage of favorite movies

## 2. Setup Instructions

### Prerequisites:
- Node.js (v14.x or later)
- npm (v6.x or later) or yarn (v1.x or later)
- React Native CLI or Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Steps to Setup:

1. *Clone the repository:*
   bash
   git clone https://github.com/your-username/react-native-movie-app.git
   cd react-native-movie-app
   

2. *Install dependencies:*
   If using npm:
   bash
   npm install
   
   If using yarn:
   bash
   yarn install
   

3. *Install Pods (for iOS):*
   bash
   cd ios
   pod install
   cd ..
   

4. *Run the app:*
   For Android:
   bash
   npx react-native run-android
   
   For iOS:
   bash
   npx react-native run-ios
   

### Environment Variables:
- Create a .env file in the root directory with the following content:
  env
  API_KEY=a677e6e2
  
- Ensure to replace a677e6e2 with your actual OMDB API key.


## 3. Screenshots
![Pixel Fold Landscape Mode](./screenshots/s1.png)
![Pixel Fold Portrait Mode](./screenshots/s2.png)
![Pixel Fold](./screenshots/s3.png)
![Pixel 8 Pro Landscape](./screenshots/s4.png)
![Pixel 8 Pro Landscape](./screenshots/s5.png)

### Note:
- Ensure that the Android emulator or iOS simulator is running before starting the app.
- If using a physical device, enable USB debugging (Android) or ensure the device is connected and trusted (iOS).