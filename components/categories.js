import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Button,
  TouchableOpacity
} from 'react-native'

const categories = (props) => {
  return(
    <View style={styles.container}>
        <TouchableOpacity onPress={()=>props.handleSearch('استثمار')}>
            <Text style={styles.title}>استثمار</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.handleSearch('رياضه')}>
            <Text style={styles.title}>رياضه</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.handleSearch('تكنولوجيا')}>
            <Text style={styles.title}>تكنولوجيا</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.handleSearch('ثقافه')}>
            <Text style={styles.title}>ثقافه</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=>props.handleSearch('اخبار')}>
            <Text style={styles.title}>اخبار</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>props.handleSearch('')}>
            <Text style={styles.title}>الحدث</Text>
        </TouchableOpacity>
    </View>
    )
 }

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    backgroundColor:  "#323232",
    height:35,
   // borderBottomWidth:3,
    //borderBottomColor:'#E39B02'
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 13,
    textAlign: 'right',
    color:'white'
  }
  });

export default categories;