import React from 'react'
import { Image, View } from 'react-native'

const index = () => {
  return (
<View className='h-screen m-auto items-center justify-center'>
    <Image className='w-24 h-24 ' source={ require("../../assets/Login/unfixed_logo.jpeg")}/>
</View>
  )
}

export default index