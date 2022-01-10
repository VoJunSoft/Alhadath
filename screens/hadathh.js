import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
} from 'react-native';
import NewsFeed from '../components/newsFeed'
import AboutUs from '../components/settings'
import BusinessBoard from '../components/businessBoard'
import BottomTabs from '../components/bottomTabs'
import SpecialOffers from '../components/specialOffers'

const Hadathh = ()  => {

  const [index, setIndex] = useState(0)
  const flipper = (indica) => {
    setIndex(indica)
  }

  const renderSwitch = (index) => {
    switch(index){
      case 0:
        return <NewsFeed isEditable={false}/>
      case 1:
        return <BusinessBoard />
      case 2:
        return <SpecialOffers />
      case 3:
        return <AboutUs />
    }
  }
  return (
    <SafeAreaView style={{flex:1}}>
    {
      renderSwitch(index)
    }
     <BottomTabs switchTabs={x => flipper(x)} index={index}/>
    </SafeAreaView>
  )
};


export default Hadathh;