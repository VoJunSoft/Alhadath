import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {Icon} from 'react-native-elements';

const bottomTabsAdmin = (props) => {
  return(
    <View style={styles.container}>
        <TouchableOpacity onPress={() => props.switchTabs(0)}>
            <Icon
            name='file-upload'
            size={27}
            color={props.index === 0 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}>نشر خبر</Text>
        </TouchableOpacity>
      {props.isAdmin  ?
       <TouchableOpacity onPress={() => props.switchTabs(1)}>
            <Icon
            name='edit'
            size={25}
            color={props.index === 1 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}>تعديل خبر</Text>
       </TouchableOpacity> : null }
       <TouchableOpacity onPress={() => props.switchTabs(2)}>
            <Icon
            name='id-card'
            type='font-awesome'
            size={25}
            color={props.index === 2 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}>كرت عمل</Text>
       </TouchableOpacity>
       {props.isAdmin  ?
       <TouchableOpacity onPress={() => props.switchTabs(3)}>
            <Icon
            name='edit'
            type='font-awesome'
            size={25}
            color={props.index === 3 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}>تعديل كرت</Text>
       </TouchableOpacity>: null }
    </View>
    )
 }

const styles = StyleSheet.create({
  container:{
    //flex:-1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    height:70,
    backgroundColor:  "#323232",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderTopWidth:1,
    borderTopColor:'#E39B02'
  },
  title: {
    fontFamily:'Cairo-Regular',
    fontSize: 12,
    textAlign: 'right',
    color:'white'
  },
  });

export default bottomTabsAdmin;