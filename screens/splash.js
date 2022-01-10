import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';


const splash = ({navigation}) => {

  const [headerImg,setHeaderImg] = useState()
  useEffect(() => {
    let time= new Date().getHours()
    if(time>=19 || time<=7)
        setHeaderImg(require('../assets/gallary/town3.jpeg'))
    else
        setHeaderImg(require('../assets/gallary/town2.jpeg'))
     
  }, []);

  const jumpTo = () => {
   navigation.navigate("Hadathh")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.HeaderImgContainer}>
          <Image source={headerImg} />
      </View>
      <TouchableOpacity style={styles.LogoImgContainer} onPress={jumpTo}>
        <Animatable.View
          onAnimationEnd={jumpTo}
          easing="ease"
          animation="pulse"
          iterationCount={3}
          direction="alternate-reverse">
          <Image style={styles.logo} source={require('../assets/gallary/splash1.png')} />
        </Animatable.View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#323232'
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain'
  },
  HeaderImgContainer: {
    width:'100%',
    alignItems:'center',
    margin: 0,
    resizeMode:'cover'
  },
  LogoImgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    backgroundColor: '#323232',
    borderTopRightRadius:40,
    borderTopLeftRadius:40,
    marginTop:"-7%"
  }
});

export default splash;