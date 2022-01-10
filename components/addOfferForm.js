import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Button, Overlay} from 'react-native-elements' 
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import SpecialOfferCard from './specialOfferCard';
import OfferBackGrounds from './offerBackGround';
import DatePicker from 'react-native-date-picker';

const addOfferForm = (props) => {
  const SCREEN_HEIGHT = Dimensions.get('window').height
  const SCREEN_WIDTH = Dimensions.get('window').width

  //Date format
  const handleDate = (dataD) => {
    let data= new Date(dataD)
    let month = data.getMonth() + 1
    let day = data.getDate()
    let year = data.getFullYear()
    if(day<=9)
      day = '0' + day
    if(month<10)
      month = '0' + month
    const postDate = year + '-' + month + '-' + day
    return postDate
  }

  //Date format
  const handleTime = (dataD) => {
    let data= new Date(dataD)
    let hrs = data.getHours()
    let mins = data.getMinutes()
    if(hrs<=9)
        hrs = '0' + hrs
    if(mins<10)
      mins = '0' + mins
    const postTime= hrs + ':' + mins
    return postTime
  }

  //TODO: load background color from database
  const [bgIndex, setBgIndex] = useState(0)
  const [BG, setBG] = useState([
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG5.png?alt=media&token=4a175407-bde1-4569-8562-20081ed2d83c',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG1.png?alt=media&token=c93df271-bef0-48b4-949d-8701f7f2a61d',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2F10.png?alt=media&token=68d7b8f9-48ae-4113-8032-3b957e7337ed',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG2.png?alt=media&token=95e74664-8a50-463e-aced-03a5f697935c',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG6.png?alt=media&token=25fd9ae4-b8b5-47b2-a263-8e1fbfa9f206',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG7.png?alt=media&token=8f4dc72d-bcbe-4c19-b730-13f09a30f111',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG8.png?alt=media&token=0878bf28-a6b0-4829-9313-2bdd41f0fafa',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2FBG9.png?alt=media&token=5c987952-b426-4e3a-81c3-da5e7e00529f',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2Fbg13.png?alt=media&token=b6ef0bd8-e13d-484f-ace6-3c34b053f5ad',
      'https://firebasestorage.googleapis.com/v0/b/alhadath-d0351.appspot.com/o/offersAssets%2Fbg12.png?alt=media&token=7b7af6ab-b59f-4830-9d29-02d5236a78bb'
  ])
 
  //input state for the offers card
  //get logged in email from specialoffers.js and add it on submit
  //Handle image upload: the path from phone to show the chosen picture on screen (before upload)
  const [image, setImage] = useState(null)
  const [input, setInput] = useState({   
        //offerId: , 
        title: '',
        businessName: '',
        fromDate: new Date(), 
        toDate: new Date(), 
        BGimg: BG[2],
        info: '', 
        phone: '', 
        coupon: '', 
        img: null,
        reporterId: props.reporterInfo.reporterId
        })

  const switchOfferBG = (path) => {
      setInput({...input, BGimg: path})
  }

  const [transferred, setTransferred] = useState(0)
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 2048,
      height: 2048,
      cropping: true,
    }).then((image) => {
      console.log(image)
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri)
      setInput({...input, img: imageUri})
    })
    .catch((e) =>{
      setImage(null)
    })
  }

  const uploadImage = async () => {
   
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setTransferred(0);

    const storageRef = storage().ref(`offers/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
      );
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL()
      return url
      
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const handleSubmit = async () => {
    if( image === null) 
        return  Alert.alert("اختر صوره")

    //TODO: get reporter's name from database
    if(input.businessName.length >= 5 && input.title.length >= 5 && input.phone.length >= 10 && input.businessName.length >= 5 && input.info.length >= 5){
      toggleOverlay()
      const imageUri = await uploadImage()
      //setInput({...input, img: imageUri})
      const subscriber = firestore()
          .collection('offers')
          .add({...input, img: imageUri})
          .then(() => {
              //reset form info
              setInput({   
                //offerId: , 
                title: '',
                businessName: '',
                fromDate: new Date(), 
                toDate: new Date(), 
                BGimg: BG[2],
                info: '', 
                phone: '', 
                coupon: '', 
                img: null,
                reporterId: props.reporterInfo.reporterId
                })

              setImage(null)
              setVisible(false)
              //props.toggleOverlay()
              //show add success msg to reporter
              Alert.alert('تم قبول الكرت بنجاح')
          })
          .catch((e)=>{
              Alert.alert("حدث خلل في تسجيل الكرت")
          })
          return () => subscriber();
    }else{
        Alert.alert("ادخل جميع المعلومات")
    }
  }

  const handleEdit = async () => {
    if(input.businessName.length >= 5 && input.title.length >= 5 && input.phone.length >= 10 && input.businessName.length >= 5 && input.info.length >= 5){
       toggleOverlay()
        const imageUri = await uploadImage()
        //UPDATE article to database based on input.postID
        const subscriber = firestore()
          .collection('offers')
          .doc(props.businessInfo.postID)
          .update({...input, img: imageUri})
          .then(() => {

            setVisible(false)
            //show add success msg to reporter
            Alert.alert('سجل الاعلان بنجاح')
          })
          .catch((e)=>{
            Alert.alert("حدث خلل حاول مره اخرى")
        })
         return () => subscriber();
    }else{
        Alert.alert("ادخل جميع المعلومات")
    }
  }

   //toggle visibility for full article
   const [visible, setVisible] = useState(false)
   //Check
   const toggleOverlay = () => {
     setVisible(!visible)
   }
 
  const [openTo, setOpenTo] = useState(false)
  const [openFrom, setOpenFrom] = useState(false)
  return(
        <>
        <View style={styles.header}>
             <Text style={styles.title}> مرحبا بك <Text style={{color:'#E39B02'}}>{props.reporterInfo.name}</Text>  </Text>
             <Text style={styles.title}> أضف عرضك الخاص </Text>
        </View>
        
        <ScrollView style={styles.container}>
        <TextInput
            value={input.businessName}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,businessName: text})}
            maxLength={25}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="اسم الشركه"
            underlineColorAndroid='transparent'
           //autoFocus
         />
         <Text style={{paddingLeft:7, color: input.businessName.length < 5  ? 'red': 'green', fontSize:10}}>{input.businessName.length}/25</Text>

         <TextInput
            value={input.title}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,title: text})}
            numberOfLines={1}
            maxLength={25}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="عنوان الحمله"
            underlineColorAndroid='transparent'
         />
         <Text style={{paddingLeft:7, color: input.title.length < 4 ? 'red': 'green', fontSize:10}}>{input.title.length}/25</Text>

        <View style={styles.dateBlock}>
            <TextInput
                value={handleDate(input.toDate)}
                style={styles.postInputDate}
                editable={false}
                numberOfLines={1}
                selectionColor="orange"
                placeholderTextColor="white"
                placeholder="حتى تاريخ"
                underlineColorAndroid='transparent'
            />
            <Icon
                name='calendar'
                type='font-awesome'
                size={40}
                color='#323232'
                onPress={() => setOpenTo(true)}/>
            <DatePicker
                    modal
                    open={openTo}
                    date={input.toDate}
                    mode="date"
                    onConfirm={(date) => {
                        setOpenTo(false)
                        setInput({...input, toDate:date})
                    }}
                    onCancel={() => {
                        setOpenTo(false)
                    }}
                />

            <TextInput
                value={handleDate(input.fromDate)}
                style={styles.postInputDate}
                editable={false}
                numberOfLines={1}
                selectionColor="orange"
                placeholderTextColor="white"
                placeholder="من تاريخ"
                underlineColorAndroid='transparent'
            />
             <Icon
                name='calendar'
                type='font-awesome'
                size={45}
                color='#323232'
                onPress={() => setOpenFrom(true)}/>
            <DatePicker
                modal
                open={openFrom}
                date={input.fromDate}
                mode="date"
                onConfirm={(date) => {
                    setOpenFrom(false)
                    setInput({...input, fromDate:date})
                    
                }}
                onCancel={() => {
                    setOpenFrom(false)
                }}
            />
        </View>

        <TextInput
            value={input.phone}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,phone: text})}
            keyboardType='numeric'
            selectionColor="orange"
            placeholderTextColor="white"
            underlineColorAndroid='transparent'
            maxLength={10}
            placeholder="الهاتف"
        />
        <Text style={{paddingLeft:5, color: input.phone.length < 10  ? 'red': 'green', fontSize:10}}>{input.phone.length}/10</Text>

        <TextInput
            value={input.info}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,info: text})}
            selectionColor="orange"
            placeholderTextColor="white"
            underlineColorAndroid='transparent'
            maxLength={80}
            placeholder="معلومات إضافية"
        />
        <Text style={{paddingLeft:5, color: input.info.length < 10  ? 'red': 'green', fontSize:10}}>{input.info.length}/80</Text>
           
        <TouchableOpacity onPress={() => choosePhotoFromLibrary()} style={{alignSelf:'center'}}> 
            <Icon
                name='photo'
                type='font-awesome'
                size={45}
                color='#323232'/>
        </TouchableOpacity>

        <View style={{}}>
            <SpecialOfferCard offers={input}/>
        </View>

        <View style={{margin:10, flexWrap:'wrap'}}>
            <OfferBackGrounds BG={BG} switchOfferBG={(path)=>switchOfferBG(path)}/>
        </View>

        <View style={styles.buttonContainer}>
            <Button
                    title="رجوع"
                    titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'white' }}
                    buttonStyle={{
                    borderBottomWidth: 3,
                    borderColor: '#E39B02',
                    borderRadius: 10,
                    backgroundColor: '#323232'
                    }}
                    containerStyle={{
                    width: 150,
                    marginHorizontal: 0,
                    marginVertical: 15,
                    }}
                    icon={{
                    name: 'arrow-left',
                    type: 'font-awesome',
                    size: 15,
                    color: 'white',
                    }}
                    iconLeft
                    iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
                    onPress={props.toggleOverlay}
                /> 
            <Button
                title="حفظ الكرت"
                titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'white' }}
                buttonStyle={{
                    borderBottomWidth: 3,
                    borderColor: '#E39B02',
                    borderRadius: 10,
                    backgroundColor: '#323232'
                }}
                containerStyle={{
                    width: 150,
                    marginHorizontal: 0,
                    marginVertical: 15,
                }}
                onPress={() => handleSubmit()}
                />
            </View>

            <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:20}}
              >
                <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} />
                <Text style={styles.loading}>جاري التحميل</Text>
           </Overlay>
    </ScrollView></>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "white",
    paddingTop:10,
    padding: 5,
  },
  header: {
    justifyContent:'center',
    margin:5,
    borderColor:'#323232',
    borderBottomWidth:3,
    borderBottomColor:'#E39B02',
    backgroundColor:'black'
  },
  title: {
    fontFamily:'Cairo-Bold',
    fontSize: 23,
    textAlign: 'center',
    color:'white',
  },
  postInput: {
    textAlignVertical:'top',
    fontSize: 15,
    borderBottomColor:'#E39B02',
    borderBottomWidth:3,
    margin:5,
    fontFamily: "Outrun future",
    textAlign:'right',
    backgroundColor:'#323232',
    color: 'white',
    borderRadius:0
  },
  postInputDate: {
    width:'35%',
    textAlignVertical:'top',
    fontSize: 15,
    borderColor:'#E39B02',
    borderWidth:1,
    margin:5,
    fontFamily: "Outrun future",
    textAlign:'center',
    backgroundColor:'#323232',
    color: 'white',
    borderRadius:10
  },
  dateBlock: {
    flex:-1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginBottom: 5
  },
  buttonContainer: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor:  "white",
  },
  loading: {
    textAlign:'center',
    fontSize: 20,
    color:'green',
  }
});

export default addOfferForm;