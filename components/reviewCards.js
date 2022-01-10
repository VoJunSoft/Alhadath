import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Alert
} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
//import  auth  from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const reviewCards = (props) => {
  // loading properties
  const [isLoading, setIsLoading] = useState(true)
  const [deleteBtn, setDeleteBtn] = useState()
  //reviews from DB
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    getData()
  
    const subscriber = firestore()
      .collection('reviews')
      .where('proId', "==", props.userId)
      //.orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        //console.log('Total records: ', querySnapshot.size);
        setReviews([]);
        querySnapshot.forEach(documentSnapshot => {
          //load posts from DB into posts state
          setReviews((prevState) => {
            return [
              {
                postID: documentSnapshot.id, 
                //proId: documentSnapshot.data().proId,
                body: documentSnapshot.data().body,
                level: documentSnapshot.data().level,
                timestamp: documentSnapshot.data().timestamp,
              },  ...prevState
            ]})
        });
      })
      setIsLoading(false);
      return () => subscriber()
    }, [])

    const getData = async () => {
      try {
             const value = await AsyncStorage.getItem('reporterKey')
             if(value !== null){
                setDeleteBtn(true)
              }else{
                setDeleteBtn(false)
              }
      } catch(e) {
        // error reading value
      }
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

        const handleDelete = (reviewId) => {
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
                                    .collection('reviews')
                                    .doc(reviewId)
                                    .delete()
                        
                        //deletePhoto(article.img)
                        return () => sub();
                       }
              }
            ]
          ) 
        }
 
  return(
    <>
    { isLoading ? 
      <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} /> 
      :
      <FlatList 
        data={reviews}
        keyExtractor={item => item.postID}
        renderItem={ ({item}) => (
            <View style={styles.block}>
              { deleteBtn === true ? 
                <Icon
                    name='trash-o'
                    type='font-awesome'
                    size={30}
                    color='red'
                    onPress={() => handleDelete(item.postID)}
                    />
                    : null }
                <Text style={styles.body}> {item.body} {"\n"} <Text style={styles.dateBlock}>{handleDate(item.timestamp.seconds)} </Text> </Text>
                { item.level === 'positive' ?
                     <Icon
                     name='thumbs-up'
                     type='font-awesome'
                     size={40}
                     color='green'
                     />
                    :
                    <Icon
                    name='thumbs-down'
                    type='font-awesome'
                    size={40}
                    color='red'
                    />
                }

            </View>
        )}
      />
    }
    {reviews.length === 0 ? <Text style={{
                                        fontFamily:'Cairo-Bold',
                                        color:'#E39B02',
                                        fontSize: 20,
                                        marginTop: 10,
                                        textAlign:'center'
                                        }}> لا يوجد تقيمات بعد </Text>: null}
    </>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:-1,
    backgroundColor:  "lightgray",
  },
  block:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      backgroundColor:'lightgray',
      marginTop:10,
      margin:5,
      padding:5,
      borderRadius:10
  },
  body:{
    fontFamily:'NotoKufiArabic-Regular',
    fontSize: 15,
    width:'70%',
    color:'black'
  },
  dateBlock:{
    fontSize: 12
  }
});

export default reviewCards;