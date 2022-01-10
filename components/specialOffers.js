import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
} from 'react-native'
import { Overlay } from 'react-native-elements' 
import HeaderTitle from '../components/header'
import filter from 'lodash.filter'
import firestore from '@react-native-firebase/firestore';
import SpecialOfferCard from './specialOfferCard';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import AddOfferForm from './addOfferForm'

const specialOffers = ({navigation}) => {
  // loading properties
  const [isLoading, setIsLoading] = useState(false);

  //TODO: load newsCards from DB
  const [offers, setOffers] = useState([])
  const [offersCopy, setOffersCopy] = useState([]);
  useEffect( () => {
     getData()
    const subscriber = firestore()
      .collection('offers')
      .where('fromDate', '<=', new Date(), '>=', 'toDate')
      .onSnapshot(querySnapshot => {
        console.log('Total records: ', querySnapshot.size);
        //TODO: the following two lines need to be omitted
        if(querySnapshot.size === 0)
            return setResultsFound(false)
        setOffers([]);
        setResultsFound(true)
        querySnapshot.forEach(documentSnapshot => {
          //load posts from DB into posts state
          //if(documentSnapshot.data().phone == '972527919300')
          setOffers((prevState) => {
            return [
              {
                offerId: documentSnapshot.id, 
                title: documentSnapshot.data().title,
                businessName: documentSnapshot.data().businessName,
                fromDate: documentSnapshot.data().fromDate.seconds, 
                toDate: documentSnapshot.data().toDate.seconds, 
                img: documentSnapshot.data().img,
                info: documentSnapshot.data().info, 
                phone: documentSnapshot.data().phone, 
                coupon: documentSnapshot.data().coupon, 
                BGimg: documentSnapshot.data().BGimg
              },  ...prevState
            ]})
        });
      });
      setIsLoading(false);
      return () => subscriber();
  }, []);

  const [reporterInfo, setReporterInfo] = useState({
      reporterId:'',
      name:'',
      role:''
  })
  //if user is admin then he will be allowed to post or delete new offer
  const [isOfferAdmin, setIsOfferAdmin] = useState('')
  const getData = async () => {
    try {
           const value = await AsyncStorage.getItem('reporterKey')
           if(value !== null){
               //connect to reporters database, find reporter based on id (value), 
               // get the reporters email and pass it to addOffer to insert it on submit
               const subscriber = firestore()
                    .collection('reporters')
                    .doc(value)
                    .get()
                    .then(documentSnapshot => {
                        if(documentSnapshot.size !== 0){
                            setReporterInfo({
                                name: documentSnapshot.data().name,
                                reporterId: documentSnapshot.data().email,
                                role: documentSnapshot.data().role
                                })
                                setIsOfferAdmin(documentSnapshot.data().role)
                            }else{
                                setIsOfferAdmin('')
                            }
                    })
                    .catch((e) => {
                        //احدى المعلومات غير صحيحه
                    })
                    return () => subscriber();
            }else{
                 setIsOfferAdmin(false)
            }
    } catch(e) {
      // error reading value
    }
  }
  //toggle visibility for full article
  const [visible, setVisible] = useState(false)
  const toggleOverlay = () => {
    setVisible(!visible)
  }

  //keep track of any input provided by the user to search through the list of data. It has a default value of empty string. 
  //Second, add another variable to hold the data from the API that is going to be used to filter the data.
  const [query, setQuery] = useState('');
  //no results found
  const [resultsFound, setResultsFound] = useState()
  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(offers, user => {
      return contains(user, formattedQuery);
    });

    //show "no results found" when search is empty
    if(filteredData.length === 0)
      setResultsFound(false)
    else
      setResultsFound(true)

    setOffersCopy(filteredData);
    setQuery(text);
  }
  
  const contains = ({ title, info, businessName }, query) => {
    if (title.includes(query) || info.includes(query) || businessName.includes(query)) {
      return true;
    }
    return false;
  }

  return(
    <SafeAreaView style={styles.container}>
    { isLoading ? 
      <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} /> 
      :
      <FlatList 
          ListHeaderComponent={ <HeaderTitle 
                                  queryData={query} 
                                  handleSearch={handleSearch} 
                                  isOfferAdmin={isOfferAdmin}
                                  toggleOverlay={toggleOverlay}
                                  isOffersCards={true}/> }
          stickyHeaderIndices={[0]}
          data={query==='' ? offers : offersCopy}
          keyExtractor={item => item.offerId}
          renderItem={ ({item}) => (
                  <SpecialOfferCard offers={item} isOfferAdmin={isOfferAdmin}/>
        )}
      />
    }
    { resultsFound === false ?
        <Text style={styles.search}>لا يوجد بطاقات </Text> 
        : 
        null 
    }

      <Overlay isVisible={visible} 
              onBackdropPress={toggleOverlay} 
              fullScreen={true}
              overlayStyle={{padding:0}}
              >
          <AddOfferForm toggleOverlay={toggleOverlay} reporterInfo={reporterInfo}/>
      </Overlay>
    </SafeAreaView>
    )
 }

const styles = StyleSheet.create({
  container:{
      flex:1,
      width:'100%',
  },
  search: {
      fontFamily:'Cairo-Bold',
      color:"#E39B02", 
      alignSelf:"center",
      alignItems:'center', 
      fontSize:25, 
      position: "absolute", 
      marginTop:"20%"
    },
    board:{
      width: 300, //Dimensions.get('window').width,
      height:150,
      marginLeft:15,
      marginBottom:30,
      resizeMode:'cover',
      borderRadius:7
    }
});

export default specialOffers;