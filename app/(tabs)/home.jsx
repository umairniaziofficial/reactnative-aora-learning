import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";

const Home = () => {
  useEffect(() => {
    return () => {
      console.log("Loaded");
    };
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Umair Khan
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="h-12 w-12"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={[{ id: 1 }, { id: 2 }] ?? []} />
            </View>
          </View>
        )}

        ListEmptyComponent={()=> <View><EmptyState title={"No Videos Found"} subtitle={"Be the first one to upload a video"}/></View>}
      />
    </SafeAreaView>
  );
};

export default Home;
