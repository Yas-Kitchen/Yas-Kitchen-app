import React from 'react'
import { Text, View } from 'react-native'

const MealPercentage = () => {
  return (
  <View className='flex-col gap-5 mx-5 bg-white p-5 rounded-2xl'>
    <Text className='text-[16px] font-semibold text-faded_black'>Today&apos;s Meal Distribution</Text>
    <View className='w-full flex-row relative'>
        <View className='bg-primary h-5 rounded-full w-full absolute left-0'></View>
        <View className='bg-yellow h-5 rounded-full w-[70%] z-[10] absolute right-0'></View>
    </View>
    <View className='flex-row mt-3 justify-evenly'>
        <Text className='text-[12px] text-base_color'>North indian : 20</Text>
        <Text className='text-[12px] text-base_color' >South indian : 80</Text>
    </View>
  </View>
  )
}

export default MealPercentage