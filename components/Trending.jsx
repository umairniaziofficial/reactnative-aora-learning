import React, { useState, useRef } from "react";
import { Image, ImageBackground, TouchableOpacity, View, FlatList } from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.1 },
};

const zoomOut = {
  0: { scale: 1.0 },
  1: { scale: 0.9 },
};

const TrendingItem = ({ activeItem, item, onPress, playingItem, setPlayingItem }) => {
  const videoRef = useRef(null);

  const handlePlayPress = () => {
    if (playingItem && playingItem !== item.$id) {
      setPlayingItem(null); 
    }
    setPlayingItem(item.$id); 
    onPress(item.$id);
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playingItem === item.$id ? (
        <Video
          ref={videoRef}
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlayingItem(null);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={handlePlayPress}
          accessibilityRole="button"
          accessibilityLabel={`Play video titled ${item.title}`}
        >
          <ImageBackground
            source={{ uri: item.thumbnail || 'path/to/default/image.png' }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          >
            <Image
              source={icons.play}
              className="w-12 h-12 absolute self-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              resizeMode="contain"
              style={{ tintColor: 'white' }}
            />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);
  const [playingItem, setPlayingItem] = useState(null);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.$id);
    }
  };

  return (
    <View className="mt-5">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TrendingItem
            activeItem={activeItem}
            item={item}
            onPress={setActiveItem}
            playingItem={playingItem}
            setPlayingItem={setPlayingItem}
          />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={170}
      />
    </View>
  );
};

export default Trending;
