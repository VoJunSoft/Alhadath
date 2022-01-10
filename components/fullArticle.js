import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Image
} from 'react-native'
import Share from "react-native-share";
import { Button} from 'react-native-elements' 

const fullArticle = (props) => {
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
    const share = async (customOptions) => {
      try {
        await Share.open(customOptions)
      } catch (err) {
        console.log(err);
      }
    }
  return(
    <ScrollView style={styles.container}>
        <Text style={styles.title}>{props.articleInfo.title}</Text>
        <Text style={styles.body}>{props.articleInfo.reporter}</Text>
        <Text style={styles.body}>{handleDate(props.articleInfo.timestamp.seconds)} {handleTime(props.articleInfo.timestamp.seconds)}</Text>
         <View style={styles.imgBlock}>
          {props.articleInfo.img != null ?
            <Image style={styles.img} source={{uri: props.articleInfo.img}} />
            :
            <Image style={styles.logo} source={require('../assets/gallary/breaking2.png')} />
          }
        </View>
        <Text style={styles.body}>{props.articleInfo.body}</Text>
        <View style={styles.buttonContainer}>
        <Button
                title="مشاركه"
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
                  name: 'share',
                  type: 'font-awesome',
                  size: 15,
                  color: '#323232',
                }}
                iconRight
                onPress={async () => {
                    await share({
                    title: props.articleInfo.title,
                    message: props.articleInfo.body,
                    url: 'https://play.google.com/store/apps/details?id=com.junglesoft.alhadath'
                  })
          }}
            />
        <Button
                title="اغلاق"
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
        </View>
    </ScrollView>
    )
 }

const styles = StyleSheet.create({
  container:{
    backgroundColor:  "#323232",
    margin:0,
    padding: 10,
  },
  title: {
    fontFamily:'Cairo-Bold',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'right',
    color:'#E39B02'
  },
  body: {
    fontFamily:'NotoKufiArabic-Regular',
    fontSize: 15,
    textAlign: 'right',
    padding: 5,
    color:'white'
  },
  img: {
    //flex:0,
    width:'100%',
    height:350,
    //aspectRatio: 1,
    resizeMode:'contain',
    backgroundColor:"#323232"
  },
  imgBlock: {
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
    backgroundColor:  "#323232",
  },
  logo:{
    width:"100%",
    height:180,
    resizeMode:'cover',
    //backgroundColor:  "white",
  }
});

export default fullArticle;