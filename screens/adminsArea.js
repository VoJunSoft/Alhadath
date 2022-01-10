import React, {useState, useEffect} from 'react';
import { Tab, TabView, Text, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import NewsForm from '../components/newsForm';
import EditPost from '../components/editPosts';
import BusinessForm from '../components/businessForm'
import { Button} from 'react-native-elements' 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import auth from '@react-native-firebase/auth';
import EditBusinessCard from '../components/editBusinessCard'
import BottomTabsAdmin from '../components/bottomTabsAdmin'
import firestore from '@react-native-firebase/firestore';

const adminsArea = ({navigation})  => {

  //TODO: one state for reporter info
  // const [reporterInfor, setReporterInfo] = useState({
    // email:'',
  //   name:'',
  //   role:'',
  //   reporterId:''
  // })
  const [isReporter, setIsReporter] = useState(false)
  const [reporterEmail, setReporterEmail] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [reporterName, setReporterName]= useState('')

  useEffect( () => {
    //getData
    const unsubscribe = navigation.addListener('focus', () => {
        auth().onAuthStateChanged((user) => {
            if(user){
              getData()
              getReporterRole(user.uid)
              setReporterEmail(user.email)
            }else{
              setIsReporter(false)
            }
          })
    })
    return () => unsubscribe()

  },[navigation])

  const getReporterRole =  (reporterId) =>{
    const subscriber = firestore()
        .collection('reporters')
        .doc(reporterId)
        .get()
        .then(documentSnapshot => {
            setArticleState({...articleState, reporter: documentSnapshot.data().name})
            if(documentSnapshot.data().role === 'admin')
              setIsAdmin(true)
            else 
              setIsAdmin(false)
        }).catch((e) =>{

        })
        return () => subscriber()
  }


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

  const storeData = async (userid) => {
    try {
      await AsyncStorage.setItem('reporterKey', userid)
    } catch (e) {
      //err storing data
    }
  }

  //log in fields data
  const [login, setLogin] = useState({
    email:'',
    password:''
  })

  // set an error message in case login failed 
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsloading] = useState(false)
  const handleSubmit = () => {
    if(login.email==='' || login.password==='')
       return setErrMsg('احدى المعلومات غير صحيحه')
    //if information is correct setIsReporter to true and save user to asyncStorage
    setIsloading(true)
    const unsub=  auth()
        .signInWithEmailAndPassword(login.email, login.password)
        .then((userCreditentials) => {
            //User account signed in
            //get uid and pass it to store data
            const user = userCreditentials.user
            //check for admin/name within reporters DB
            getReporterRole(user.uid)
            //get authenticated user email
            setReporterEmail(user.email)
            //async storage for offline loggin
            storeData(user.uid) 
            //display tabs
            setIsReporter(true) 
        })
        .catch(error => {
          setIsloading(false)
          setErrMsg('احدى المعلومات غير صحيحه')
      })
        setIsloading(false)
        return () => unsub()
  }

  //connect to reporters database and get reporters name
  const [articleState, setArticleState] = useState({
    title: '',
    reporter: '',
    timestamp: {seconds: Math.floor(Date.now() / 1000)}, 
    img: null,
    body: '',
    category:'' 
  })

  //TODO: nitiate empty state to business form
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    profession: '',
    timestamp: {seconds: Math.floor(Date.now() / 1000)}, 
    img: null,
    phone: '' 
  })
  const [index, setIndex] = useState(2)
  const flipper = (indica) => {
    setIndex(indica)
  }

  const renderSwitch = (index) => {
    switch(index){
      case 0:
        return <NewsForm articleInfo={articleState} reporterInfo={reporterEmail}/>
      case 1:
        return <EditPost />
      case 2:
        return <BusinessForm businessInfo={businessInfo} reporterInfo={reporterEmail}/>
      case 3:
        return <EditBusinessCard />
    }
  }

  return (
    <>
    {!isReporter ?
    <ImageBackground source={require("../assets/gallary/settingsBG.png")} style={styles.login}>
        <TextInput
        style={styles.postInput}
        onChangeText={text=> setLogin({...login,email: text})}
        selectionColor="orange"
        placeholderTextColor="white"
        placeholder="اسم المستخدم"
        underlineColorAndroid='transparent'
        autoFocus= {true}
        keyboardType="email-address"
        />
        <TextInput
            style={styles.postInput}
            onChangeText={text=> setLogin({...login,password: text})}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="كلمة المرور"
            underlineColorAndroid='transparent'
            secureTextEntry={true}
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
            width: '80%',
            marginHorizontal: 0,
            marginVertical: 10,
        }}
        iconLeft
        iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
        onPress={() => handleSubmit()}
        />
         { isLoading ? 
          <ActivityIndicator color='#E39B02' size={50}/>
          :
          null
        }
      </ImageBackground>
      :
      <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        {
          renderSwitch(index)
        }
        <BottomTabsAdmin switchTabs={x => flipper(x)} index={index} isAdmin={isAdmin}/>
      </SafeAreaView>
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
    alignSelf:'center',
    width:'100%',
    borderWidth:0

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
    width:'80%'
  }
});
export default adminsArea;