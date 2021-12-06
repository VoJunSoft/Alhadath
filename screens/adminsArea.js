import React, {useState, useEffect} from 'react';
import { Tab, TabView, Text, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TextInput
} from 'react-native';
import NewsForm from '../components/newsForm';
import EditPost from '../components/editPosts';
import { Button, Input} from 'react-native-elements' 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const adminsArea = ()  => {
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

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('reporterKey', 'keyExists')
    } catch (e) {
      //err storing data
    }
  }

  const [index, setIndex] = useState(1)
  //TODO: connect to reporters database and get reporters name
  const [articleState, setArticleState] = useState({
    title: '',
    reporter: '',
    timestamp: {seconds: Math.floor(Date.now() / 1000)}, 
    img: '',
    body: '' 
  })
  //log in fields data
  const [login, setLogin] = useState({
    username:'',
    passward:''
  })
  // set an error message in case login failed 
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = () => {
    //if information is correct setIsReporter to true and save user to asyncStorage
    //TODO: complete auth from firebase
    if(login.username==='12345' && login.password==='123'){
       storeData()
       setIsReporter(true)
    }else{
      setErrMsg('احدى المعلومات غير صحيحه')
    }
  }

  return (
    <>
    {!isReporter ?
     <View style={styles.login}>
        <TextInput
        style={styles.postInput}
        onChangeText={text=> setLogin({...login,username: text})}
        selectionColor="orange"
        placeholderTextColor="white"
        placeholder="اسم المستخدم"
        underlineColorAndroid='transparent'
        autoFocus= {true}
        />
        <TextInput
            style={styles.postInput}
            onChangeText={text=> setLogin({...login,password: text})}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="كلمة المرور"
            underlineColorAndroid='transparent'
        />
        <Text style={{color:'red'}}>{errMsg}</Text>
        <Button
        title="دخول"
        titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
        buttonStyle={{
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 20,
            backgroundColor: '#E39B02'
        }}
        containerStyle={{
            width: '70%',
            marginHorizontal: 0,
            marginVertical: 10,
        }}
        iconLeft
        iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
        onPress={() => handleSubmit()}
        />
      </View>
      :
      <>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ backgroundColor: 'lightgray', width: '100%' }}>
            <EditPost />
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'lightgray', width: '100%' }}>
            <NewsForm articleInfo={articleState}/>
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
      <Tab.Item title="تعديل خبر" 
          titleStyle={{ fontSize: 14, color: '#323232', fontWeight:'bold' }}
          icon={{ name: 'create', type: 'ionicon', color: '#323232' }}/>
      <Tab.Item title="نشر خبر" 
          titleStyle={{ fontSize: 14, color: '#323232', fontWeight:'bold' }}
          icon={{ name: 'add-circle', type: 'ionicon', color: '#323232'}}/>
    </Tab>
    </>
  } 
  </>
  )
};

const styles = StyleSheet.create({
  login:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%'

  },
  postInput: {
    textAlignVertical:'top',
    fontSize: 20,
    borderColor:'#E39B02',
    borderWidth:2,
    borderRadius:25,
    margin:5,
    fontFamily: "Outrun future",
    textAlign:'right',
    backgroundColor:'#323232',
    color: 'white',
    width:'70%'
  }
});
export default adminsArea;