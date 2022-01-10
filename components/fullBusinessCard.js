import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Button, Divider} from 'react-native-elements' 
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import ReviewCards from './reviewCards'
import BusinessSnapshot from './businessSnapshot'
import {Picker} from '@react-native-picker/picker'

const fullBusinessCard = (props) => {
   
  const [review, setReview] = useState({
      proId: props.cardInfo.postID,
      timestamp:{seconds: Math.floor(Date.now() / 1000)}, //firestore.Timestamp.fromDate(new Date())
      body: '',
      level: ''
  })

  const handleSubmit =  (proId) => {
    if(review.body.length > 7 && review.level != ''){
        //UPDATE article to database based on input.postID
        const subscriber = firestore()
            .collection('reviews')
            .add(review)
            .then(() => {
                setReview({...review,
                    body: '',
                    level: ''
                })
                setFormVisibility(!formVisibility)
                //show add success msg to reporter
                //Alert.alert('تم ادخال التفاصيل بنجاح')
          })
          .catch((e)=>{
                Alert.alert("حدث خلل")
        })
        return() =>  subscriber();
    }else{
        Alert.alert("ادخل جميع المعلومات")
    }
  }
  const [formVisibility, setFormVisibility] = useState(false)
  return(
    <View style={styles.container}>
        <View style={{backgroundColor:'lightgray', alignSelf:'center', width:'20%', borderRadius:50}}>
        <Icon
                name='close'
                type='font-awesome'
                size={40}
                color='#E39B02'
                onPress={props.toggleOverlay} 
                style={{marginRight:5}}
                />
        </View>
        <View style={{width:'100%'}}>
            <BusinessSnapshot cardData={props.cardInfo} isEditable={false} isFullCard={true} isFullBusinessCardScreen={true}/>
        </View>
        <TouchableOpacity 
            style={{
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    alignItems:'center', 
                    alignSelf: 'flex-end',
                    margin: 5, 
                    width:'50%'}}
            onPress={()=>setFormVisibility(!formVisibility)}>     
            <Text style={styles.title}> اكتب تقييم </Text>
            { !formVisibility ?
                <Icon
                name='hand-o-left'
                type='font-awesome'
                size={30}
                color='#E39B02'
                style={{margin:5}}
                />
                :
                <Icon
                name='hand-o-down'
                type='font-awesome'
                size={30}
                color='#E39B02'
                style={{margin:5}}
                />
            }
        </TouchableOpacity>
        {formVisibility ?
            <View style={styles.block}>
                {/* TODO: full form: body, level seperate component*/}
                <Picker
                    selectedValue={review.level}
                    style={{backgroundColor:'white',margin:5, color:'black'  }}
                    onValueChange={(itemValue, itemIndex) => setReview({...review, level: itemValue})}
                    >
                    <Picker.Item label="هل أنت راضٍ عن الخدمات المقدمة" value="" />
                    <Picker.Item label="نعم" value="positive" />
                    <Picker.Item label="كلا" value="negative" />
                </Picker>
                <TextInput
                    value={review.body}
                    style={styles.postInput}
                    onChangeText={text=> setReview({...review, body: text})}
                    maxLength={250}
                    selectionColor="orange"
                    placeholderTextColor="black"
                    placeholder="اكتب تقييم"
                    underlineColorAndroid='transparent'
                />
                <Text style={{paddingLeft:7, color:review.body.length > 7 ? 'green': 'red'}}>{review.body.length}/250</Text>
                <Button
                    title="حفظ"
                    titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
                    buttonStyle={{
                        borderWidth: 0,
                        borderColor: 'transparent',
                        borderRadius: 20,
                        backgroundColor: '#E39B02'
                    }}
                    containerStyle={{
                        width: 100,
                        marginHorizontal: '30%',
                        marginVertical: 5,
                    }}
                    onPress={() => handleSubmit(props.cardInfo.postID)}
                    />
            </View>
            :
            null
        }
        {/* same value: userId={props.cardInfo.postID} */}
           <ReviewCards  userId={review.proId} />
        </View>
        
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "#323232",
    margin:0,
    padding: 2,
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 22,
    fontWeight: '100',
    textAlign: 'right',
    color:'#E39B02'
  },
  body: {
    fontFamily:'NotoKufiArabic-Regular',
    fontSize: 22,
    textAlign: 'right',
    padding: 3,
    color:'white'
  },
  img: {
    width:"100%",
    height:170,
    resizeMode:'cover',
    backgroundColor:"white",
    margin:5,
  },
  postInput: {
    textAlignVertical:'top',
    fontSize: 20,
    borderColor:'#E39B02',
    borderWidth:1,
    margin:5,
    fontFamily: "Outrun future",
    textAlign:'right',
    backgroundColor:'white',
    color: 'black'
  },
  block:{
      borderWidth:1,
      borderColor: '#E39B02',
      alignSelf:'center',
      width:"97%",
      marginBottom:15,
      margin: 5
  }
});

export default fullBusinessCard;