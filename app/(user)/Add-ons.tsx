import { Feather } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

const Addons = () => {
  return (
    <ScrollView>
      <View>
        <View>
          <Feather name='chevron-left' size={20} color={'#6C757D'}/>
          <Text>Food Section</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Addons