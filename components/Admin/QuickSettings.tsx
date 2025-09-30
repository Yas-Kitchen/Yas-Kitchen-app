import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

type QuickSettingsType = {
    header : string
    icon : "users" | "coffee" | 'list' | 'clipboard'
    number : number
}

const QuickSettings = ({header,icon,number} : QuickSettingsType) => {
  return (
    <View className='flex-col gap-5 bg-white w-[45%] p-5 rounded-2xl'>
        <View className='flex-row items-center gap-3 w-1/2'>
            <Feather name={icon} size={20} color={'#FF7629'} className='bg-primary/10 rounded-full p-2 '/>
            <Text className='text-[14px] text-base_color'>{header}</Text>
        </View>
        <Text className='text-[20px] font-semibold'>{number}</Text>
    </View>
  )
}

export default QuickSettings