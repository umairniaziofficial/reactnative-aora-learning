import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { TouchableOpacity } from "react-native";
import { ResizeMode, Video } from "expo-av";

const VideoCard = ({ video, playingVideoId, setPlayingVideoId }) => {
  const { title, thumbnail, video: videoUrl, users } = video || {};
  const avatar = users?.avatar;
  const username = users?.username;
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Stop video playback when another video starts playing
    if (playingVideoId !== video?.$id) {
      setPlay(false);
    }
  }, [playingVideoId]);

  const handlePlayPress = () => {
    if (playingVideoId && playingVideoId !== video.$id) {
      setPlayingVideoId(null); // Reset the previous video state
    }
    setPlayingVideoId(video.$id); // Set the current video as the playing one
    setPlay(true);
  };

  if (!video) {
    return <Text className="text-red-500">Video data not available</Text>;
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-1 flex-row">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              onError={() => {
                console.log("Error loading image");
              }}
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular "
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: videoUrl }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
              setPlayingVideoId(null);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={handlePlayPress}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
