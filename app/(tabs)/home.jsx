import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useState } from "react";
import { getAllposts, getLatestposts } from ".";
import useAppwrite from "./useAppWrite";
import { VideoCard, SearchInput, Trending, EmptyState } from "../../components";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const { data: posts, isLoading, refetch } = useAppwrite(getAllposts);
  const { data: latestPosts } = useAppwrite(getLatestposts);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            playingVideoId={playingVideoId}
            setPlayingVideoId={setPlayingVideoId}
          />
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

              <Trending posts={latestPosts} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <EmptyState
              title={"No Videos Found"}
              subtitle={"Be the first one to upload a video"}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
