import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Button,
  ActivityIndicator
} from 'react-native'

const api = () => {
  return(
    <ScrollView style={styles.container}>
        <ActivityIndicator size={100} color="#E39B02" marginTop={'50%'} /> 
        <Text style={styles.title}>Coming soon</Text>
    </ScrollView>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "lightgray",
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 30,
    marginTop:10,
    fontWeight: '100',
    padding: 7,
    textAlign: 'center',
    color:'black'
  }
  });

export default api;