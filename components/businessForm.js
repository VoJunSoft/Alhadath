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
  ActivityIndicator
} from 'react-native'
import { Button, Overlay} from 'react-native-elements' 
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import FormHeader from './formHeader'

const businessForm = (props) => {
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
  //pass businessInfo props (from businessBoard.js) to input state disincluding postID
  const [input, setInput] = useState({   
        name: props.businessInfo.name,
        profession: props.businessInfo.profession,
        timestamp: props.businessInfo.timestamp, 
        img: props.businessInfo.img, 
        phone:props.businessInfo.phone,  
        })
    props.businessInfo

  //Handle image upload: the path from phone to show the chosen picture on screen (before upload)
  const [image, setImage] = useState(props.cancelButton ? input.img : null)
  const [transferred, setTransferred] = useState(0)
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: SCREEN_WIDTH,
      height: 170,
      cropping: true,
    }).then((image) => {
      console.log(image)
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri)
    })
    .catch((e) =>{
        setImage(null)
    })
  }

  const uploadImage = async () => {
    if( image === null) 
       return  null //setInput({...input,img: null});
    
    if(image === props.businessInfo.img)
        return  props.businessInfo.img

    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setTransferred(0);

    const storageRef = storage().ref(`cards/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
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
    //TODO: get reporter's name from database
    if(input.profession.length >= 4 && input.name.length >= 4 && input.phone.length >= 10 ){
      toggleOverlay()
      const imageUri = await uploadImage()
      //setInput({...input, img: imageUri})
      const subscriber = firestore()
          .collection('business')
          .add({...input, img: imageUri, reporterId: props.reporterInfo})
          .then(() => {
              //reset form info
              setInput({   
                name: '',
                profession: '',
                //timestamp:firestore.Timestamp.fromDate(new Date()),
                timestamp:{seconds: Math.floor(Date.now() / 1000)}, 
                img: null,
                phone: '', 
                })
              setImage(null)
              setVisible(false)
              //show add success msg to reporter
              //Alert.alert('تم قبول المقال بنجاح')
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
    if(input.profession.length >= 4 && input.name.length > 5 && input.phone.length >= 10 ){
        toggleOverlay()
        const imageUri = await uploadImage()
        //UPDATE article to database based on input.postID
        const subscriber = firestore()
          .collection('business')
          .doc(props.businessInfo.postID)
          .update({...input, img: imageUri})
          .then(() => {
            //setImage(null)
            setVisible(false)
            //show add success msg to reporter
            //Alert.alert('تم تعديل المقال بنجاح')
          })
          .catch((e)=>{
            Alert.alert("حدث خلل في تعديل الكرت")
        })
         return () => subscriber();
    }else{
        Alert.alert("ادخل جميع المعلومات")
    }
  }

   //toggle visibility for full article
   const [visible, setVisible] = useState(false)
   const toggleOverlay = () => {
     setVisible(!visible)
   }
 
  return(
    
        <>
        { !props.cancelButton ?
            <FormHeader title='تسجيل كرت عمل جديد' />
            :
            <FormHeader title='تعديل كرت عمل' />
        }
        <ScrollView style={styles.container}>
        <TextInput
            value={input.name}
            style={[styles.postInput,{marginTop:20}]}
            onChangeText={text=> setInput({...input,name: text})}
            maxLength={25}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="الاسم"
            underlineColorAndroid='transparent'
           // autoFocus
         />
         <Text style={{paddingLeft:7, color: input.name.length < 5  ? 'red': 'green'}}>{input.name.length}/25</Text>
         <TextInput
            value={input.profession}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,profession: text})}
            numberOfLines={1}
            maxLength={25}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="المهنه"
            underlineColorAndroid='transparent'
         />
         <Text style={{paddingLeft:7, color: input.profession.length < 4 ? 'red': 'green'}}>{input.profession.length}/25</Text>
        <View style={styles.dateBlock}>
            <TextInput
              value={props.cancelButton ? handleTime(input.timestamp.seconds*1000) : handleTime(Date())}
              style={styles.postInputDate}
              editable={false}
              selectionColor="orange"
              placeholderTextColor="white"
              underlineColorAndroid='transparent'
            />
            <TextInput
              value={handleDate(Date())}
              style={styles.postInputDate}
              editable={false}
              selectionColor="orange"
              placeholderTextColor="white"
              underlineColorAndroid='transparent'
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
        <Text style={{paddingLeft:5, color: input.phone.length < 10  ? 'red': 'green'}}>{input.phone.length}/10</Text>

        <TouchableOpacity onPress={() => choosePhotoFromLibrary()} style={styles.imgBlock}>
            {image != null ?
              <Image style={styles.img} source={{uri: image}} />
              :
              <Image style={styles.imgTemp} source={require('../assets/gallary/businessCard.png')} />
            }
        </TouchableOpacity>

       
         
        <View style={styles.buttonContainer}>
        { props.cancelButton  ?
        <Button
            title="حفظ التعديل"
            titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
            buttonStyle={{
              borderBottomColor:'#323232',
              borderBottomWidth:3,
                borderRadius: 20,
                backgroundColor: '#E39B02'
            }}
            containerStyle={{
                width: 300,
                marginHorizontal: 0,
                marginVertical: 10,
            }}
            //iconLeft
            //iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
            onPress={() => handleEdit()}
        />
        :
        <Button
            title="حفظ الكرت"
            titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
            buttonStyle={{
                borderBottomColor:'#323232',
                borderBottomWidth:3,
                borderRadius: 20,
                backgroundColor: '#E39B02'
            }}
            containerStyle={{
                width: 300,
                marginHorizontal: 0,
                marginVertical: 10,
            }}
            onPress={() => handleSubmit()}
            />
        }
        { props.cancelButton ?
        <Button
                title="رجوع"
                titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
                buttonStyle={{
                  borderBottomColor:'#323232',
                  borderBottomWidth:3,
                  borderRadius: 20,
                  backgroundColor: '#E39B02'
                }}
                containerStyle={{
                  width: 300,
                  marginHorizontal: 0,
                  marginVertical: 10,
                }}
                icon={{
                  name: 'arrow-left',
                  type: 'font-awesome',
                  size: 15,
                  color: '#323232',
                }}
                iconLeft
                iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
                onPress={props.toggleOverlay}
            /> 
            :  
            null
            }
            </View>
            <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:20}}
              >
            <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} />
            <Text style={styles.loading}>جاري التحميل</Text>
           </Overlay>
    </ScrollView>
    </>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "white",
    paddingTop:10
  },
  title: {
    fontFamily:'NotoKufiArabic-SemiBold',
    fontSize: 20,
    marginTop:10,
    fontWeight: '100',
    padding: 5,
    textAlign: 'center',
    color:'#323232',
    backgroundColor:'#E39B02',
    borderColor:'#323232',
    borderWidth:2,
    margin:5,
    marginBottom:15,
    borderRadius:15
  },
  postInput: {
    textAlignVertical:'top',
    fontSize: 15,
    borderBottomColor:'#E39B02',
    borderBottomWidth:3,
    margin:5,
    fontFamily: "Cairo-Regular",
    textAlign:'right',
    backgroundColor:'#323232',
    color: 'white',
    borderRadius:10
  },
  postInputDate: {
    width:'47%',
    textAlignVertical:'top',
    fontSize: 15,
    borderBottomColor:'#E39B02',
    borderBottomWidth:3,
    margin:5,
    fontFamily: "Cairo-Regular",
    textAlign:'center',
    backgroundColor:'#323232',
    color: 'white',
    opacity:0.5,
    borderRadius:10
  },
  dateBlock: {
    flex:-1,
    flexDirection:'row',
    justifyContent:'space-around',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    backgroundColor:  "white",
  },
  imgBlock:{
    flex:1,
    justifyContent:'center',
    width:"97%",
    height: 170,
    resizeMode:'contain',
    alignSelf:'center',
    backgroundColor:'#323232',
    borderBottomColor:'#E39B02',
    borderBottomWidth:3,
    margin:5,
    borderRadius:10,
    overflow:'hidden'
  },
  img: {
    width:"100%",
    height: 170,
    resizeMode:'cover',
    alignSelf:'center',
    borderRadius:5,
    margin:0
  },
  imgTemp: {
    width:120,
    height: 100,
    resizeMode:'contain',
    alignSelf:'center',
    backgroundColor:'#323232',
    margin:5,
    borderRadius:10
  },
  loading: {
    textAlign:'center',
    fontSize: 20,
    color:'green',
  }
});

export default businessForm;