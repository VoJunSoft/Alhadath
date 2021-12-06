import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import {Divider} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const splash = ({navigation}) => {

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      //TODO: refresh screen
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const jumpTo = () => {
    navigation.navigate("Hadath")
  }

  return (
    <View style={styles.container}>
    <Animatable.View
        onAnimationEnd={jumpTo}
        easing="ease"
        animation="pulse"
        iterationCount={2}
        direction="alternate-reverse">
        <Image style={styles.logo} source={require('../assets/gallary/splash.png')} />
    </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#323232'
  },
  logo: {
    resizeMode:"contain",
    width: 300,
    height: 300,
    borderRadius: 20,
  }
});

export default splash;