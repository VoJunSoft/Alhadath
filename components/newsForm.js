import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native'
import { Button} from 'react-native-elements' 
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const newsForm = (props) => {
  //TODO: add the rest of the fields to the article input state
  const [input, setInput] = useState(props.articleInfo)
  const [isVerified, setIsVerified] = useState(false)

  const verifyForm = () => {
    //TODO: verify form input
    if(input.title.length<=12){
        Alert.alert('العنوان قصير')
        setIsVerified(false)
    }
    else if(input.reporter.length<=8){
        Alert.alert("الاسم قصير")
        setIsVerified(false)
    }
    //image verification
    // if(input.img == null){
    //     Alert.alert("اختر الصوره")
    //     setIsVerified(false)
    // }
    //TODO: fix length to 100+ instead of 10
    else if(input.body.length<=10){
        Alert.alert("المقال قصير المضمون")
        setIsVerified(false)
    }
    else{
        setIsVerified(true)
    }
  }
  const handleSubmit = async () => {
    verifyForm()
    //const imageUrl = await uploadImage();
    //setInput({...input,img: imageUrl})
    if(isVerified==true) {
        //add article to database
        firestore()
        .collection('news')
        .add(input)
        .then(() => {
            //show add success msg to reporter
            Alert.alert('تم قبول المقال بنجاح')
        });

        //rest form info
        setInput({   
            title: '',
            reporter: '',
            timestamp:{seconds: Math.floor(Date.now() / 1000)}, 
            img: '',
            body: '', 
        })
    }
  }
  const handleEdit = () => {
    //edit state to database
    verifyForm()
    if(isVerified==true) {
        //UPDATE article to database based on input.postID
        firestore()
        .collection('news')
        .doc(input.postID)
        .set(input)
        .then(() => {
            //show add success msg to reporter
            Alert.alert('تم تعديل المقال بنجاح')
        });
    }

}
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image)
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri)
    })
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  return(
    <ScrollView style={styles.container}>
        { !props.cancelButton ?
            <Text style={styles.title}>تسجيل مقال جديد</Text>
            :
            <Text style={styles.title}>تعديل مقال</Text>
        }
        <TextInput
            value={input.title}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,title: text})}
            maxLength={100}
            minLength={10}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="العنوان"
            underlineColorAndroid='transparent'
         />
         <TextInput
            value={input.reporter}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,reporter: text})}
            numberOfLines={1}
            maxLength={100}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder="المراسل"
            underlineColorAndroid='transparent'
         />
        <TextInput
        value={Date(input.date)}
        style={styles.postInput}
        editable={false}
        selectionColor="orange"
        placeholderTextColor="white"
        underlineColorAndroid='transparent'
        opacity={0.75}
        />
        
        {props.cancelButton  ?
        <Image style={styles.img} source={{uri: input.img}} />
        :
        <TouchableOpacity onPress={() => Alert.alert('add image later')}>
            <Image style={styles.img} source={require('../assets/gallary/addImg.png')} />
        </TouchableOpacity>
        }
        <TextInput
            value={input.body}
            style={styles.postInput}
            onChangeText={text=> setInput({...input,body: text})}
            multiline={true}
            numberOfLines={10}
            maxLength={1000}
            selectionColor="orange"
            placeholderTextColor="white"
            placeholder='المقال كامل'
            underlineColorAndroid='transparent'
         />
        <View style={styles.buttonContainer}>
        { props.cancelButton  ?
        <Button
            title="حفظ التعديل"
            titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
            buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: '#E39B02'
            }}
            containerStyle={{
                width: 300,
                marginHorizontal: 0,
                marginVertical: 10,
            }}
            iconLeft
            iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
            onPress={() => handleEdit()}
        />
        :
        <Button
            title="حفظ المقال"
            titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
            buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: '#E39B02'
            }}
            containerStyle={{
                width: 300,
                marginHorizontal: 0,
                marginVertical: 10,
            }}
            iconLeft
            iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
            onPress={() => handleSubmit()}
            />
        }
        { props.cancelButton ?
        <Button
                title="الغاء"
                titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
                buttonStyle={{
                  borderWidth: 0,
                  borderColor: 'transparent',
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
    </ScrollView>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "lightgray",
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 33,
    marginTop:10,
    fontWeight: '100',
    padding: 5,
    textAlign: 'center',
    color:'#323232',
    borderColor:'#E39B02',
    borderWidth:1,
    margin:5,
    borderRadius:15
  },
  postInput: {
    textAlignVertical:'top',
    fontSize: 20,
    borderColor:'#E39B02',
    borderWidth:1,
    margin:5,
    fontFamily: "Outrun future",
    textAlign:'right',
    backgroundColor:'#323232',
    color: 'white'
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    backgroundColor:  "lightgray",
  },
  img: {
    width:"50%",
    height: 200,
    resizeMode:'contain',
    alignSelf:'center'
  },
});

export default newsForm;