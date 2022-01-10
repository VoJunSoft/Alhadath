import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native'

const formHeader = (props) => {
  return(
    <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        <Image style={styles.logo} source={require('../assets/gallary/splash1.png')} />
    </View>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex: -1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:75,
    backgroundColor:  "#323232",
    borderBottomColor: '#E39B02',
    borderBottomWidth: 3,
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 25,
    padding:7,
    color:'#E39B02'
  },
  logo: {
    resizeMode:"contain",
    width: 60,
    height: 60,
  }
  });

export default formHeader;