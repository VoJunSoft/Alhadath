import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  SafeAreaView
} from 'react-native'
import {Icon, Overlay} from 'react-native-elements';
import NewsForm from '../components/newsForm'
import firestore from '@react-native-firebase/firestore';

const newsCard = (props) => {
    //TODO: props.newsData.body take the first 100 letters
    const handleArticleBody = (x) => {
      return x.substring(0,100)
    }

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
    //full article detals
    const [fullArticle, setFullArticle] = useState({})
    const toggleOverlay = (article) => {
      //pass toggleOverlay to fillArticle component
      setFullArticle(article)

      setVisible(!visible)
    }

    const handleDelete = (article) => {
      //delete item based on postID 
      //postID is passed to newsCard from newsFeed through props
      Alert.alert(
        "تحذير",
        "هل تريد حذف هذا المنشور",
        [
          {
            text: "كلا",
            //onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { 
            text: "نعم", 
            onPress: () => firestore()
                          .collection('news')
                          .doc(article.postID)
                          .delete()
          }
        ]
      )
      
    }

  return(
    <SafeAreaView style={styles.block}>
    <View style={styles.newsBlock}>
        <View style={{flex:1, alignItems:'flex-end'}}>
            <Text style={styles.title}>{props.newsData.title}</Text> 
            <Text style={[styles.body,{fontStyle:'italic'}]}>{props.newsData.reporter}</Text> 
            <Text style={styles.body}>{handleArticleBody(props.newsData.body)}...</Text> 
        </View>
        <Image style={styles.img} source={{uri: props.newsData.img}} />
    </View>
    { props.isEditable ?
      <View style={[styles.dateBlock, {borderWidth: 1, borderColor:'#E39B02', height: 35}]}>
        <Icon
            name='trash'
            type='font-awesome'
            size={20}
            color='#E39B02'
            onPress={() => handleDelete(props.newsData)}/>
        <Icon
            name='edit'
            type='font-awesome'
            size={20}
            color='#E39B02'
            onPress={() => toggleOverlay(props.newsData)}/>
      </View>
      :
      <View style={styles.dateBlock}>
        <Text style={styles.body}> {handleTime(props.newsData.timestamp.seconds)} </Text> 
        <Text style={styles.body}> {handleDate(props.newsData.timestamp.seconds)} </Text> 
      </View>
    }
    <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:0}}
              >
          <NewsForm articleInfo={fullArticle} toggleOverlay={toggleOverlay} cancelButton={true}/>
    </Overlay>

    </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
 container:{
    flex:1,
    backgroundColor:  "#323232",
  },
  block:{
    borderRadius: 5,
    margin: 3,
    padding:1,
    backgroundColor:'#323232',
    borderWidth:1,
    borderColor: 'black',
  },
  newsBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',

  },
  dateBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    marginTop:9,
    borderBottomRightRadius:5,
    borderBottomLeftRadius: 5
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 20,
    textAlign: 'right',
    color:'white',
    width:"100%"
  },
  body: {
    fontSize: 15,
    textAlign: 'right',
    padding: 0,
    color: 'white'
  },
  img: {
    height:'100%',
    width:'45%',
    marginTop: 10,
    margin:3,
    resizeMode:'cover',
    backgroundColor: 'white',
    alignSelf:"center"
  }
  });

export default newsCard;
