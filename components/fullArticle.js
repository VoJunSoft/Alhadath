import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  BackHandler,
  Alert,
  Image
} from 'react-native'
import { Button} from 'react-native-elements' 
const fullArticle = (props) => {
  return(
    <ScrollView style={styles.container}>
        <Text style={styles.title}>{props.articleInfo.title}</Text>
        <Text style={styles.body}>{props.articleInfo.reporter}</Text>
        <Text style={styles.body}>{Date(props.articleInfo.timestamp.seconds)}</Text>
        <Image style={styles.img} source={{uri: props.articleInfo.img}} />
        <Text style={styles.body}>{props.articleInfo.body}</Text>
        <View style={styles.buttonContainer}>
        <Button
                title="Close"
                titleStyle={{ fontWeight: 'bold', fontSize: 18, color:'#323232' }}
                buttonStyle={{
                  borderWidth: 0,
                  borderColor: 'transparent',
                  borderRadius: 20,
                  backgroundColor: '#E39B02'
                }}
                containerStyle={{
                  width: 300,
                  marginHorizontal: 0,
                  marginVertical: 10,
                }}
                icon={{
                  name: 'arrow-left',
                  type: 'font-awesome',
                  size: 15,
                  color: '#323232',
                }}
                iconLeft
                iconContainerStyle={{ marginLeft: -10, marginRight: 10 }}
                onPress={props.toggleOverlay}
            />
        </View>
    </ScrollView>
    )
 }

const styles = StyleSheet.create({
  container:{
    backgroundColor:  "#323232",
    margin:0,
    padding: 10,
  },
  title: {
    fontFamily:'Cheeky Bite Shine - AND',
    fontSize: 37,
    fontWeight: '100',
    textAlign: 'right',
    color:'white'
  },
  body: {
    fontSize: 15,
    textAlign: 'right',
    padding: 5,
    color:'white'
  },
  img: {
    width:"100%",
    height: 320,
    resizeMode:'cover',
    backgroundColor:"white"
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    backgroundColor:  "#323232",
  }
});

export default fullArticle;