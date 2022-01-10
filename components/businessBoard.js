import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView
} from 'react-native'
import { Overlay } from 'react-native-elements' 
import HeaderTitle from './header'
import filter from 'lodash.filter'
import firestore from '@react-native-firebase/firestore';
import BusinessSnapshot from './businessSnapshot'
import FullBusinessCard from './fullBusinessCard'

const businessBoard = (props) => {
  // loading properties
  const [isLoading, setIsLoading] = useState(true);

  //TODO: load newsCards from DB
  const [businessCards, setBusinessCards] = useState([])
  //TODO: FIX newscards copy to wait for data load
  const [copy, setCopy] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('business')
      .onSnapshot(querySnapshot => {
        console.log('Total records: ', querySnapshot.size);
        setBusinessCards([]);
        querySnapshot.forEach(documentSnapshot => {
          console.log('post ID: ', documentSnapshot.id, documentSnapshot.data());
          //load posts from DB into posts state
          setBusinessCards((prevState) => {
            return [
              {
                postID: documentSnapshot.id, 
                name: documentSnapshot.data().name,
                profession: documentSnapshot.data().profession,
                phone: documentSnapshot.data().phone,
                img: documentSnapshot.data().img, 
                timestamp: documentSnapshot.data().timestamp, 
              },  ...prevState
            ]})
        });
      });
      setIsLoading(false);
      return () => subscriber();
  }, []);

  //toggle visibility for full article
  const [visible, setVisible] = useState(false)
  //full article details
  const [fullCard, setFullCard] = useState({})
  const toggleOverlay = (article) => {
    //pass toggleOverlay to fillArticle component ==> no need
    setFullCard(article)

    setVisible(!visible)
  }

  //keep track of any input provided by the user to search through the list of data. It has a default value of empty string. 
  //Second, add another variable to hold the data from the API that is going to be used to filter the data.
  const [query, setQuery] = useState('');
  //no results found
  const [resultsFound, setResultsFound] = useState()

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(businessCards, user => {
      return contains(user, formattedQuery);
    });
    //show "no results found" when search is empty
    if(filteredData.length === 0)
      setResultsFound(false)
    else
      setResultsFound(true)

    setCopy(filteredData);
    setQuery(text);
  };
  
  const contains = ({ name, profession }, query) => {
  
    if (name.includes(query) || profession.includes(query)) {
      return true;
    }
  
    return false;
  };
  
  const [fullBusinessCardView, setFullBusinessCardView] = useState(true)
  return(
    <SafeAreaView style={styles.container}>
    { isLoading ? 
      <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} /> 
      :
      <FlatList 
          ListHeaderComponent={<HeaderTitle 
                                  queryData={query} 
                                  handleSearch={handleSearch} 
                                  isBusinessCards={true}
                                  switchCards={() => setFullBusinessCardView(!fullBusinessCardView)}
                                  isFullCard={fullBusinessCardView}
                                  //isEditable={props.isEditable}
                                  />}
          stickyHeaderIndices={[0]}
          data={query==='' ? businessCards : copy}
          keyExtractor={item => item.postID}
          renderItem={ ({item}) => (
          <TouchableOpacity onPress={()=>toggleOverlay(item)} {...props} >
            <BusinessSnapshot cardData={item} isEditable={props.isEditable} isFullCard={fullBusinessCardView}/>
          </TouchableOpacity>
        )}
      />
    }
    { 
      resultsFound == false ?
        <Text style={{fontFamily:'Cairo-Bold', color:"#E39B02", alignSelf:"center",alignItems:'center', fontSize:25, position: "absolute", marginTop:"25%"}}>البحث غير متوفر</Text> 
        : 
        null
    }
      {/* fullBusinessCard with reviews */}
        <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:0}}
              >
          <FullBusinessCard cardInfo={fullCard} toggleOverlay={toggleOverlay}/>
      </Overlay>
    </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "white"
  }
});

export default businessBoard;