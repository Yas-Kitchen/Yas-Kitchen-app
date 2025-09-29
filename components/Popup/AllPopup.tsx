import { useGlobalContext } from '@/context/GlobalContext'
import React from 'react'
import ChangeFoodPlan from './ChangeFoodPlan'

const AllPopup = () => {
    const {popupNames,setPopupNames} = useGlobalContext()
  return (
    <>
      <ChangeFoodPlan open={popupNames === 'Monthly Food Plan'} onClose={() => setPopupNames('')}/>
    </>
  )
}

export default AllPopup