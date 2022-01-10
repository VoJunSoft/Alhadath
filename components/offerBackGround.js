import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native'

const offerBackGround = (props) => {
  return(
    <View style={styles.container}>
    {
        props.BG.map( (item, index) => (
            <TouchableOpacity 
                key={item}
                onPress={() => props.switchOfferBG(item)} 
                style={{margin:2}}>
                    <Image style={styles.img} source={{uri: item}} />  
            </TouchableOpacity>
        ))
    }
    </View>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexWrap: 'wrap',
    flexDirection:'row',
    justifyContent:'space-around', 
    alignItems: 'center',
    padding:2
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 37,
    marginTop:10,
    fontWeight: '100',
    padding: 7,
    textAlign: 'left',
    color:'white'
  },
  img:{
      height: 60,
      width:60,
      borderWidth: 1,
      borderColor:'black',
      resizeMode:'contain',
  }
  });

export default offerBackGround;