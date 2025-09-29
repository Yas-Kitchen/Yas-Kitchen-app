import { useGlobalContext } from '@/context/GlobalContext'
import React from 'react'
import ChangeFoodPlan from './ChangeFoodPlan'
import SwitchMeals from './Switchmeals'

const AllPopup = () => {
    const {popupNames,setPopupNames} = useGlobalContext()
  return (
    <>
      <ChangeFoodPlan open={popupNames === 'Monthly Food Plan'} onClose={() => setPopupNames('')}/>
      <SwitchMeals open={popupNames === 'Switch Meals'} onClose={() => setPopupNames('')}/>
    </>
  )
}

export default AllPopup