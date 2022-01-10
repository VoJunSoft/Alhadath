import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import { Overlay } from 'react-native-elements' 
import NewsCard from "./newsCard"
import NewsCardNew from "./newsCardNew"
import FullArticle from './fullArticle'
import HeaderTitle from '../components/header'
import filter from 'lodash.filter'
import firestore from '@react-native-firebase/firestore';

const newsFeed = (props) => {
  // loading properties
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null);

  //TODO: load newsCards from DB
  const [newsCards, setNewsCards] = useState([])
  //TODO: FIX newscards copy to wait for data load
  const [newsDataCopy, setNewsDataCopy] = useState([])

  useEffect(() => {
    const subscriber = firestore()
      .collection('news')
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        console.log('Total records: ', querySnapshot.size)
        setNewsCards([]);
        querySnapshot.forEach(documentSnapshot => {
          console.log('post ID: ', documentSnapshot.id, documentSnapshot.data());
          //load posts from DB into posts state
          setNewsCards((prevState) => {
            return [
              {
                postID: documentSnapshot.id, 
                title: documentSnapshot.data().title,
                reporter: documentSnapshot.data().reporter,
                timestamp: documentSnapshot.data().timestamp, 
                img: documentSnapshot.data().img,
                body: documentSnapshot.data().body, 
                category: documentSnapshot.data().category,
              },  ...prevState
            ]})
        })
      })
      setIsLoading(false);
      return () => subscriber();
  }, []);

  //toggle visibility for full article
  const [visible, setVisible] = useState(false)
  //full article details
  const [fullArticle, setFullArticle] = useState({})
  const toggleOverlay = (article) => {
    //pass toggleOverlay to fillArticle component
    setFullArticle(article)

    setVisible(!visible)
  }

  //keep track of any input provided by the user to search through the list of data. It has a default value of empty string. 
  //Second, add another variable to hold the data from the API that is going to be used to filter the data.
  const [query, setQuery] = useState('');
  //no results found
  const [resultsFound, setResultsFound] = useState()

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(newsCards, user => {
      return contains(user, formattedQuery);
    })
    //show "no results found" when search is empty
    if(filteredData.length === 0)
      setResultsFound(false)
    else
      setResultsFound(true)

    setNewsDataCopy(filteredData);
    setQuery(text);
  }
  
  const contains = ({ title, body, reporter, category }, query) => {
    if (title.includes(query) || body.includes(query) || reporter.includes(query) || category.includes(query)) {
      return true;
    }
    return false;
  }
  
  const [switchNewsCards, setSwitchNewsCards] = useState(false)
  return(
    <SafeAreaView style={styles.container}>
    { isLoading ? 
      <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} /> 
      :
      <FlatList 
        ListHeaderComponent={<HeaderTitle 
                              queryData={query} 
                              handleSearch={handleSearch} 
                              isNewsCards={true}
                              setSwitchNewsCards={()=>setSwitchNewsCards(!switchNewsCards)}
                              switchNewsCards={switchNewsCards}/>}
        stickyHeaderIndices={[0]}
        data={query==='' ? newsCards : newsDataCopy}
        keyExtractor={item => item.postID}
        renderItem={ ({item}) => (
          <TouchableOpacity onPress={()=>toggleOverlay(item)} {...props}>
            { !switchNewsCards ?
              <NewsCard newsData={item} isEditable={props.isEditable}/>
              :
              <NewsCardNew newsData={item} isEditable={props.isEditable}/>
            }
          </TouchableOpacity>
        )}
      />
    }
    { 
      resultsFound == false ?
        <Text style={{
                      fontFamily:'Cairo-Bold',
                      color:"#E39B02", 
                      alignSelf:"center",
                      alignItems:'center', 
                      fontSize:25, 
                      position: "absolute", 
                      marginTop:"30%"}}>
          البحث غير متوفر</Text> 
        : 
        null
    }
      <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:0}}
              >
          <FullArticle articleInfo={fullArticle} toggleOverlay={toggleOverlay}/>
      </Overlay>
    </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
  container:{
      flex:1,
      width:'100%',
      backgroundColor:'white'
  }
});

export default newsFeed;