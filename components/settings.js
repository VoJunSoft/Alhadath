import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Linking,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Icon } from 'react-native-elements';
import Share from "react-native-share";
import  auth  from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const settings = () => {
  //tap 7 times to show login button
  const [devConsoleCount, setCount] = useState (0)
  //reporter authentication state
  const [isReporter, setIsReporter] = useState(false)
  //appInfo
  const [appInfo, setAppInfo] = useState({})
  useEffect(() => {
    getData()
    const subscriber = firestore()
                      .collection('appInfo')
                      .onSnapshot(doc => { 
                        doc.forEach( docData => {
                          setAppInfo(docData.data())
                        })
                      })
                      //console.log('-------->', appInfo)
    return () => subscriber();
}, [])

  const getData = async () => {
    try {
           const value = await AsyncStorage.getItem('reporterKey')
           if(value !== null){
              setIsReporter(true)
            }else{
              setIsReporter(false)
            }
    } catch(e) {
      // error reading value
    }
  }

  const confirmSignOut = () =>
    Alert.alert(
      "الحدث الفحماوي",
      "هل تريد الخروج من صفحة المراسلون",
      [
        {
          text: "كلا"
        },
        { 
          text: "نعم", 
          onPress: () => handleSignOut() 
        }
      ]
  )

  const handleSignOut = () => {
    //AsyncStorage.removeItem('userInfoKey')
    AsyncStorage.clear()
    setCount(0)
    setIsReporter(false)
    return() => auth().signOut().then(() => {})
  }

  const navigation = useNavigation();
  const jumpTo = () =>{
    navigation.navigate("AdminsArea")
  }

  const share = async (customOptions) => {
    try {
      await Share.open(customOptions)
    } catch (err) {
      console.log(err);
    }
  }

  const [toggleOn, setToggleOn] = useState(false)
  return(
    <ScrollView>
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../assets/gallary/splash1.png')} />
        <Text style={styles.title}>الحدث الفحماوي</Text>
      </View>
  <Text style={styles.body}> {appInfo.info} </Text>
      <Text style={styles.titleSub}>مصدر الحدث</Text>
        <TouchableOpacity style={styles.contactBlock} onPress={()=>Linking.openURL(`${appInfo.web}`)}>
          <Text style={styles.body}>{appInfo.web}</Text>
              <Icon
                name='web'
                type='and-design'
                size={40}
                color='#323232'
                />
        </TouchableOpacity>
        <View style={styles.contactBlock}>
          <Text style={styles.body}>{appInfo.email}</Text>
              <Icon
                name='email'
                type='and-design'
                size={40}
                color='#323232'
                />
        </View>
        <View style={styles.contactBlock}>
          <Text style={styles.body}>{appInfo.phone}</Text>
              <Icon
                name='phone'
                type='and-design'
                size={40}
                color='#323232'
                />
        </View>
        <View style={styles.contactBlock}>
          <Text style={styles.body}>{appInfo.address}</Text>
              <Icon
                name='store'
                type='and-design'
                size={40}
                color='#323232'
                />
        </View>
        

      <Text style={styles.titleSub}>لوحة المفاتيح</Text>
        <View style={styles.block}>
          <Text style={styles.body}>إشعارات</Text>
          {toggleOn ? 
              <Icon
                name='toggle-on'
                type='and-design'
                size={50}
                color='green'
                onPress={() => setToggleOn(!toggleOn)}
                />
              :
              <Icon
                name='toggle-off'
                type='and-design'
                size={50}
                color='red'
                onPress={() => setToggleOn(!toggleOn)}
                />
          }
        </View>
        <TouchableOpacity style={styles.block} onPress={async () => {
                  await share({
                    title: "الحدث الفحماوي",
                    message: "الحدث الفحماوي",
                    url: 'https://play.google.com/store/apps/details?id=com.junglesoft.alhadath'
                  })
          }}>
        <Text style={styles.body}>مشاركه</Text>
        <Icon
              name='share-alt'
              type='font-awesome'
              size={37}
              color='#323232'/>
        </TouchableOpacity>

        {isReporter ?
          <TouchableOpacity style={styles.block} onPress={()=>confirmSignOut()} >
            <Text style={styles.body}>خروج</Text>
            <Icon
                  name='sign-out'
                  type='font-awesome'
                  size={37}
                  color='#323232'/>
          </TouchableOpacity>
          :
          null
        }

      <TouchableWithoutFeedback onPress={()=>setCount(devConsoleCount+1)}>
        <Text style={styles.titleSub}>لوحة المراسلون</Text>
      </TouchableWithoutFeedback>

      <Text style={styles.body}>كيف تصبح مراسلا للحدث الفحماوي</Text>
      {
        devConsoleCount >= 7 || isReporter ?
          <View style={styles.entryBtn}>
            <Button
              title="دخول"
              onPress={()=>jumpTo()}
              color="#323232"
            />
          </View>
        :
        null
      }
     </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding: 5
  },
  header :{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingTop: 7,
    paddingBottom:7,
    textAlign: 'center',
    backgroundColor:"#323232",
    padding: 15,
    marginBottom:10,
    borderBottomWidth:3,
    borderBottomColor:'#E39B02',
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
  },
  title: {
    fontFamily:'Cairo-Bold',
    fontSize: 25,
    marginRight: 5,
    color:'#E39B02',
  },
  titleSub: {
    alignSelf:'flex-end',
    width:'95%',
    fontFamily:'Cairo-Bold',
    fontSize: 17,
    marginTop: 7,
    textAlign: 'right',
    color:'#E39B02',
    backgroundColor:"#323232",
    padding: 6,
    paddingRight: 20,
    marginBottom:10,
    borderBottomWidth:3,
    borderBottomColor:'#E39B02',
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5
    
  },
  entryBtn: {
    fontFamily:'Cairo-Regular',
    margin: 15,
    color:'white',
    alignSelf:'center',
    width:'50%',
    borderBottomWidth:3,
    borderBottomColor:'#E39B02'
  },
  body:{
    fontFamily:'NotoKufiArabic-Regular',
    fontSize:15,
    textAlign: 'right',
    color:'black',
    paddingRight:10,
    paddingLeft: 20,
    padding:7
  },
  block: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
   alignSelf:'flex-end',
    marginRight:20,
    width:'50%',
  },
  contactBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
   //alignSelf:'flex-end',
    marginRight:20,
    width:'95%',
  },
  logo: {
    resizeMode:"contain",
    width: 60,
    height: 60,
  }
  });

export default settings;