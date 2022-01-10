import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
  ImageBackground
} from 'react-native'
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import DropShadow from "react-native-drop-shadow";

const specialOfferCard = (props) => {
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

    const handleDelete = (offerId) => {
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
                                .collection('offers')
                                .doc(offerId)
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
    // Create a reference to the file to delete
    var desertRef = storage.refFromURL(`cards/${photoPath}`); 
    // Delete the file
    desertRef.delete()
    .then(() => {
    // File deleted successfully (`cards/${filename}`);
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });
  }

  return(
    <DropShadow style={styles.dropShadow}>
    <ImageBackground source={{uri: props.offers.BGimg}} style={styles.BG}>
      <View style={styles.block}>

        <Text style={[styles.header]}>{props.offers.businessName}</Text>
        <Text style={[styles.title]}>{props.offers.title}</Text>
        <Image style={styles.img} source={{uri: props.offers.img}} />
  
        <Text style={styles.body}>{props.offers.info}</Text>

        <TouchableOpacity 
            onPress={()=>Linking.openURL(`tel:${props.offers.phone}`)}
            //onPress={()=>Linking.openURL(`whatsapp://send?phone=${props.offers.phone}`)}
            style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', padding: 5}}>
            <Text style={[styles.body,{marginRight:5}]}>{props.offers.phone}</Text> 
            <Icon 
                name='mobile'
                type='font-awesome'
                size={30}
                color='white'
            />
        </TouchableOpacity>

        <View style={[styles.infoBlock]}>
            <Text style={styles.date}>حتى {handleDate(props.offers.toDate)}</Text> 
            {props.isOfferAdmin ?
              <View style={{borderWidth:1, padding:5, margin:3, borderColor:'red'}}>
                  <Icon
                  name='trash'
                  type='font-awesome'
                  size={27}
                  color='red'
                  onPress={() => handleDelete(props.offers.offerId)}/> 
              </View>
              : 
              null } 
        
            <Text style={styles.date}>ابتداً من {handleDate(props.offers.fromDate)}</Text> 
        </View>
    </View>
    </ImageBackground>
    </DropShadow>
    )
 }

const styles = StyleSheet.create({
dropShadow: {
    flex:-1,
    flexDirection:'row',
    justifyContent:'center',
    shadowColor: '#171717',
    shadowOffset: {width: 7, height: 12},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom:15,
    marginTop:17,
    width:'100%'
    },
 BG: {
    flex:1, 
    resizeMode:'cover',
    marginLeft:12,
    marginRight:12,
    borderRadius:10,
    overflow:'hidden',
    backgroundColor:'white',
 },
  block:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    width:'90%',
    marginTop:15,
    marginBottom:15,
  },
  infoBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    margin:0,
    width:'95%'
  },
  header: {
    fontFamily:'Cairo-Bold',
    fontSize: 30,
    color:'#E39B02',
    textAlign:'center',
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 22,
    color:'white',
    textAlign:'center',
  },
  body: {
    fontFamily:'Cairo-Regular',
    fontSize: 18,
    color: 'white',
    textAlign:'center',
  },
  date: {
    fontFamily:'Cairo-Bold',
    fontSize: 13,
    margin:2,
    padding: 0,
    color:'#E39B02',
  },
  img: {
    width:'90%',
    height:250,
    resizeMode:'contain',
    borderRadius:10,
    marginTop:7,
    marginBottom:7,
  },
  dateBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
  }
  });

export default specialOfferCard;