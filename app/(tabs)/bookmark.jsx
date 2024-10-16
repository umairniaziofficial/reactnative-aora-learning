import { Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'react-native-web'
import { SafeAreaView } from 'react-native-safe-area-context'

const Bookmark = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center ">
      <Text className="text-2xl">Bookmark</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

export default Bookmark