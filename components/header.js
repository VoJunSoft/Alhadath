import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {Icon} from 'react-native-elements';
import Categories from './categories'

const header = (props) => {
  const [categoryVisibility, setCategoryVisibility] = useState(false)

  return (
    <>
    <View style={styles.headerBar}>
        {props.isBusinessCards ?  
            <TouchableOpacity onPress={props.switchCards}>
              <Icon
                    name='th-list'
                    type='font-awesome'
                    size={35}
                    color={props.isFullCard  ? '#E39B02' : 'white'}
                    />
            </TouchableOpacity>
            :
            null
          }
        {props.isOfferAdmin === 'admin' ?  
            <TouchableOpacity onPress={props.toggleOverlay}>
              <Icon
                    name='plus-square'
                    type='font-awesome'
                    size={35}
                    color='#E39B02' 
                    />
            </TouchableOpacity>
            :
            null
          }
        {props.isNewsCards ?  
            <TouchableOpacity onPress={props.setSwitchNewsCards}>
              <Icon
                    name='eye'
                    type='font-awesome'
                    size={35}
                    color={props.switchNewsCards  ? 'white' : '#E39B02'}
                    />
            </TouchableOpacity>
            :
            null
          }
        <View style={styles.searchBox}>
        {props.queryData !== '' ?
          <Icon
              name='close'
              type='font-awesome'
              size={25}
              onPress={() => props.handleSearch('')}
              /> 
              : 
              null 
          }
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={props.queryData}
            onChangeText={queryText => props.handleSearch(queryText)}
            placeholder="بحث..."
            style={styles.searchBar}
            textAlign="right"
            textAlignVertical="bottom"
            underlineColorAndroid='transparent'
          />
        </View>
        <TouchableOpacity onPress={() => setCategoryVisibility(!categoryVisibility)}>
          <Image style={styles.img} 
                source={require("../assets/gallary/alhadath.png")}/> 
        </TouchableOpacity>
    </View>
    
    { props.isNewsCards ?
      <>
        { categoryVisibility ?
          <Categories handleSearch={props.handleSearch} />
        :
        null
        }
      </>
      :
      null
    }
  </>
  )
}

const styles = StyleSheet.create({
  headerBar: {
    flex:1,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems:'center',
    width: '100%',
    height: 52,
    backgroundColor: "#323232",
    padding:5 ,
    borderBottomWidth:3,
    borderBottomColor:'#E39B02'
  },
  searchBar:{
    flex:1, 
    height:45,
    color:'black'
    //backgroundColor:'yellow'
  },
  searchBox: {
    flex:1, 
    flexDirection:'row',
    justifyContent:'center', 
    alignItems:'center',
    backgroundColor:'white',
    height:32,
    margin:7,
    borderWidth:2,
    borderRadius:15,
    paddingRight:2,
    paddingLeft:5,
    borderColor:'#E39B02',
    
  },
  img: {
    width: 95,
    height:50,
    resizeMode:"cover"
  }

});
export default header;  