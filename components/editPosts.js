import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Button
} from 'react-native'
import NewsFeed from './newsFeed';

const editPosts = () => {
  return(
    <>
        <NewsFeed disabled isEditable={true} />
    </>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:  "#6183B4",
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 37,
    marginTop:10,
    fontWeight: '100',
    padding: 7,
    textAlign: 'left',
    color:'white'
  }
  });

export default editPosts;