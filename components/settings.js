import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Button,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const settings = () => {
  const [devConsoleCount, setCount] = useState (0)
  useEffect( () => {
    //get Data from asyncstorage on page load 
    getData() 
  },[])
  const [isReporter, setIsReporter] = useState()
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
  const handleSignOut =  () => {
    //AsyncStorage.removeItem('userInfoKey')
    AsyncStorage.clear()
    setCount(0)
  }

  const navigation = useNavigation();
  const jumpTo = () =>{
    navigation.navigate("AdminsArea")
  }

  return(
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Image style={styles.headerImg} source={require('../assets/gallary/splash.png')}/>
      </View>

      <Text style={styles.title}>الحدث الفحماوي</Text>
      <Text style={styles.body}>
      الصحافة موهبة قبل أن تكون مهنة، و لا تدرس خلال ايام، وحتى الإعلاميين الكبار الذين يصنعون نجاحات أكبر القنوات العالمية، هم في حاجة لتكوين مستمر ودائم للتأقلم مع التطور التكنولوجي على مستوى المعدات والأجهزة داخل الاستوديوهات أو حتى في المراسلات الميدانية
      </Text>

      <TouchableWithoutFeedback onPress={()=>setCount(devConsoleCount+1)}>
        <Text style={styles.title}>لوحة المراسلون</Text>
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
      <Button
              title="release storage for testing"
              onPress={()=>handleSignOut()}
              color="#323232"
            />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "lightgray",
  },
  logo: {
    width: 150,
    height: 150
  },
  header: {
    justifyContent: "center",
    alignItems:"center",
    borderWidth: 0,
    marginTop:5,
    padding:5
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 32,
    marginTop:5,
    fontWeight: '100',
    padding: 5,
    textAlign: 'right',
    color:'black'
  },
  headerImg: {
    width:170,
    height: 170,
    resizeMode:'cover'
  },
  entryBtn: {
    margin: 20,
    color:'white',
    alignSelf:'center',
    width:'40%',
  },
  body:{
    marginLeft:20,
    padding:5,
    fontSize:20,
    textAlign: 'right',
    color:'black'
  }
  });

export default settings;