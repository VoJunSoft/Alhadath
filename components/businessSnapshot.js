import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Linking
} from 'react-native'
import {Icon, Overlay} from 'react-native-elements';
import BusinessForm from '../components/businessForm'
import firestore from '@react-native-firebase/firestore';

const businessSnapshot = (props) => {

    //Date format
    const handleDate = (dataD) => {
      let data= new Date(dataD*1000)
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
      let data= new Date(dataD*1000)
      let hrs = data.getHours()
      let mins = data.getMinutes()
      if(hrs<=9)
         hrs = '0' + hrs
      if(mins<10)
        mins = '0' + mins
      const postTime= hrs + ':' + mins
      return postTime
    }
    //toggle visibility for full article
    const [visible, setVisible] = useState(false)
    //full card's detals
    //const [fullArticle, setFullArticle] = useState({})
    const toggleOverlay = (article) => {
      //setFullArticle(article)  ==> no need

      setVisible(!visible)
    }

    const handleDelete = (article) => {
      //delete item based on postID 
      //postID is passed to businessSnapshot from businessBoard through props.cardData
      Alert.alert(
        "تحذير",
        "هل تريد حذف هذا الكرت",
        [
          {
            text: "كلا",
            //onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { 
            text: "نعم", 
            onPress: () => {
                    const sub = firestore()
                                .collection('business')
                                .doc(article.postID)
                                .delete()
                    
                    //deletePhoto(article.img)
                    return () => sub();
                        }
          }
        ]
      ) 
    }

  //TODO: delete photo
  const deletePhoto = (photoPath) =>{
  
  }

  return(
    // <View style={styles.container}>
      <SafeAreaView style={[styles.block, { backgroundColor : props.isFullCard ? '#E39B02' : '#323232',  
                                            paddingBottom : props.isFullCard ? 5 : 0 , 
                                            }]}>
        {props.isFullCard ?
          <>
            {props.cardData.img!= null ?
              <Image style={styles.img} source={{uri: props.cardData.img}} />
              :
              <Image style={styles.img} source={require('../assets/gallary/businessCard.png')} />
              
            }
          </>
          :
          null
        }
        <View style={{ backgroundColor:props.isFullCard ? '#E39B02' : '#323232', 
                       borderBottomWidth:props.isFullCard ? 0 : 5, 
                       borderBottomColor:props.isFullCard ? '#E39B02' : '#E39B02', 
                       padding:0}}>
            <View style={[styles.infoBlock]}>
                <Text style={styles.title}>{props.cardData.phone}</Text> 
                <Text style={styles.title}>{props.cardData.name}</Text> 
            </View>
            <View style={[styles.infoBlock]}>
            {!props.isFullBusinessCardScreen ? 
                <View style={styles.review}>
                    <Text style={styles.body}>تقييم</Text>
                    <Icon
                    name='hand-o-left'
                    type='font-awesome'
                    size={25}
                    color='green'/>
                </View>: null }
                <Text style={styles.body}>{props.cardData.profession}</Text> 
            </View>
        {props.isFullBusinessCardScreen ? 
            <TouchableOpacity 
              onPress={()=>Linking.openURL(`tel:${props.cardData.phone}`)}
              //onPress={()=>Linking.openURL(`whatsapp://send?phone=${props.offers.phone}`)}
              style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', padding: 5, backgroundColor:'#323232'}}>
              <Text style={[styles.body,{marginRight:15}]}>اضغط هنا للاتصال</Text> 
              <Icon 
                  name='mobile'
                  type='font-awesome'
                  size={35}
                  color='white'
              />
            </TouchableOpacity>
        :
            null
        }
        { props.isEditable ?
        <View style={[styles.dateBlock, {borderWidth: 1, borderColor:'white', height: 35}]}>
            <Icon
                name='trash'
                type='font-awesome'
                size={27}
                color='red'
                onPress={() => handleDelete(props.cardData)}/>
            <Icon
                name='edit'
                type='font-awesome'
                size={27}
                color='green'
                onPress={() => toggleOverlay(props.cardData)}/>
        </View>
        :
        null
        }
    </View>
    {/* </View> */}
    <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:0}}>
          <BusinessForm businessInfo={props.cardData} 
                        toggleOverlay={toggleOverlay} 
                        cancelButton={true}
                        />
    </Overlay>

    </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
 
  block:{
    marginTop:10,
    margin:5,
    paddingBottom: 5,
    borderRadius:5,
  },
  infoBlock: {
    flex:-1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  review: {
    flex:-1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'25%',
  },
  title: {
    fontFamily:'Cairo-Bold',
    fontSize: 17,
    color:'white',
    textAlign:'center',
    margin: 2,
    flexWrap:'wrap'
  },
  body: {
    fontFamily:'Cairo-Regular',
    fontSize: 17,
    textAlign: 'center',
    margin:2,
    padding: 0,
    color: 'white',
    flexWrap:'wrap'
  },
  img: {
    width:'100%',
    height:150,
    resizeMode:'cover',
    overflow:'hidden',
    borderRadius:5,
  },
  dateBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
  }
  });

export default businessSnapshot;