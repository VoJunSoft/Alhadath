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

const newsCardNew = (props) => {
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
            onPress: () => {
                        const sub = firestore()
                          .collection('news')
                          .doc(article.postID)
                          .delete()
                        
                        return () => sub();
                        }
          }
        ]
      )
      
    }

  return(
    <SafeAreaView style={styles.block}>
        {props.newsData.img!= null ?
        <Image style={styles.img} source={{uri: props.newsData.img}} />
        :
        <Image style={styles.img} source={require('../assets/gallary/breaking2.png')} />
        }

        <View style={styles.newsBlock}>
            <Text style={styles.title}>{props.newsData.title}</Text> 
            <Text style={[styles.body,{fontStyle:'italic'}]}>{props.newsData.reporter}</Text>
     
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
                <Text style={[styles.body,{color:'white', fontSize:12}]}> {handleTime(props.newsData.timestamp.seconds)} </Text> 
                {/* <Icon
                name='eye'
                type='font-awesome'
                size={20}
                color='white'/> */}
                <Text style={[styles.body,{color:'white', fontSize:12}]}> {handleDate(props.newsData.timestamp.seconds)} </Text> 
            </View>
            }
        </View>

        <Overlay isVisible={visible} 
                onBackdropPress={toggleOverlay} 
                fullScreen={true}
                overlayStyle={{padding:0}}
                >
            <NewsForm articleInfo={fullArticle} 
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
    margin: 5,
    padding:0,
    backgroundColor:'white',
  },
  newsBlock: {
    width:'100%',
    marginTop: -20,
    borderTopRightRadius: 20,
    borderTopLeftRadius:20,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius:10,
    backgroundColor: '#323232',//'#CFD7D8',
    paddingTop:10,
    paddingLeft: 9,
    paddingRight: 9,
    borderBottomWidth:3,
    borderBottomColor:'#E39B02'
  },
  img: {
    width:'100%',
    height: 150,
    marginTop: 3,
    margin:3,
    resizeMode:'cover',
    alignSelf:"center",
    borderTopRightRadius: 20,
    borderTopLeftRadius:20,
    borderWidth:3,
    borderColor:'#323232'
  },
  dateBlock: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    borderBottomRightRadius:5,
    borderBottomLeftRadius: 5,
    padding:0
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 18,
    textAlign: 'center',
    color:'white'
  },
  body: {
    fontFamily:'Cairo-Regular',
    fontSize: 13,
    textAlign: 'center',
    padding: 2,
    color: '#E39B02', //'#128345'
  }
  });

export default newsCardNew;