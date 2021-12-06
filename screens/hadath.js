import React, {useState} from 'react';
import { Tab, TabView, Text, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView
} from 'react-native';
import NewsFeed from '../components/newsFeed'
import AboutUs from '../components/settings'
import API from '../components/api'

const Hadath = ()  => {
  const [index, setIndex] = useState(2)
  return (
  <>
    <TabView value={index} onChange={setIndex} animationType="spring">
      <TabView.Item style={{ backgroundColor: 'lightgray', width: '100%' }}>
          <AboutUs />
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: 'lightgray', width: '100%' }}>
          <API />
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: 'lightgray', width: '100%' }}>
          <NewsFeed isEditable={false}/>
      </TabView.Item>
    </TabView>
 
  <Tab value={index} 
       onChange={setIndex}
       indicatorStyle={{
        backgroundColor: '#F1AD05',
        height: 3,
      }}
      variant="default"
       >
    <Tab.Item title="الإعدادات" 
        titleStyle={{ fontSize: 14, color: '#323232', fontWeight:'bold' }}
        icon={{ name: 'construct', type: 'ionicon', color: '#323232' }}/>
    <Tab.Item title="بطاقات" 
        titleStyle={{ fontSize: 14, color: '#323232', fontWeight:'bold' }}
        icon={{ name: 'desktop-outline', type: 'ionicon', color: '#323232' }}/>
    <Tab.Item title="الأخبار"
        titleStyle={{ fontSize: 14, color: '#323232', fontWeight:'bold' }}
        icon={{ name: 'newspaper', type: 'ionicon', color: '#323232' }}/>
  </Tab>
  
  </>
  )
};


export default Hadath;