import { View, Text, FlatList } from 'react-native'
import React from 'react'

const Trending = ({ posts }) => {
    return (
      <View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text className="text-3xl text-gray-100">{item.id}</Text>
          )}
          horizontal
        />
      </View>
    );
  };
  
  export default Trending;
  