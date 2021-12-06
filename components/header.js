import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  searchBar
} from 'react-native';

const header = (props) => {

  return (
    <View style={styles.headerBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={props.query}
          onChangeText={queryText => props.handleSearch(queryText)}
          placeholder="بحث..."
          style={styles.searchBar}
          textAlign="right"
        />
        <Image style={styles.img} source={require("../assets/gallary/alhadath.png")} /> 
    </View>
  )
}

const styles = StyleSheet.create({
  headerBar: {
    flex: -1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems:'center',
    width: '100%',
    backgroundColor: "#323232",
    paddingLeft: 10,
    paddingRight: 10,
    // borderBottomColor:'black',
    // borderBottomWidth:1,
    // borderBottomRightRadius:4,
    // borderBottomLeftRadius:4
  },
  title: {
    fontSize: 20,
    color:'white',
    textAlign:'center',
  },
  searchBar:{
    width:'70%',
    height:30,
    padding:2,
    backgroundColor:'lightgray',
    borderWidth:2,
    borderColor:'#E39B02',
    borderRadius:50,
    margin:5
  },
  img: {
    width: 99,
    height:50,
    resizeMode:"contain"
  }

});
export default header;  