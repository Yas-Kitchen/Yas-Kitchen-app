import React from 'react'
import { View } from 'react-native'
import MealPercentage from './MealPercentage'
import MostOrders from './MostOrders'
import QuickSettings from './QuickSettings'

const Summary = () => {
  return (
    <>
    <View className='flex-row flex-wrap gap-3 justify-center'>
        <QuickSettings header={"Active Users"} icon={"users"} number={128}/>
        <QuickSettings header={"Today's specials"} icon={"coffee"} number={12}/>
        <QuickSettings header={"Regular Orders"} icon={"clipboard"} number={120}/>
        <QuickSettings header={"Add-on Orders"} icon={"list"} number={2}/>
    </View>
    <MealPercentage/>
    <MostOrders/>
    </>
  )
}

export default Summary