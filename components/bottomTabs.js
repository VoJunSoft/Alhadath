import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {Icon} from 'react-native-elements';

const bottomTabs = (props) => {
  return(
    <View style={styles.container}>
         <TouchableOpacity onPress={() => props.switchTabs(3)}>
            <Icon
            name='cogs'
            type='font-awesome'
            size={25}
            color={props.index == 3 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}> الإعدادات </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.switchTabs(2)}>
            <Icon
            name='briefcase'
            type='font-awesome'
            size={25}
            color={props.index == 2 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}> عروض </Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => props.switchTabs(1)}>
            <Icon
            name='address-card'
            type='font-awesome'
            size={25}
            color={props.index == 1 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}> بطاقات </Text>
       </TouchableOpacity>
        <TouchableOpacity onPress={() => props.switchTabs(0)}>
            <Icon
            name='book'
            type='font-awesome'
            size={25}
            color={props.index == 0 ? '#E39B02' : 'white'}/>
            <Text style={styles.title}> الحدث </Text>
        </TouchableOpacity>
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
    fontSize: 13,
    textAlign: 'right',
    color:'white'
  },
  });

export default bottomTabs;