
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/splash'
import Hadathh from './screens/hadathh'
import AdminsArea from './screens/adminsArea'
import { I18nManager, StatusBar } from "react-native";
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const Stack = createNativeStackNavigator()
const App = () => {

  return (
  <NavigationContainer>
    <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#323232"/>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ 
            headerShown: false 
          }}
        />
        <Stack.Screen
          name="Hadathh"
          component={Hadathh}
          options={{
            headerShown: false ,
            }}
        />
         <Stack.Screen
          name="AdminsArea"
          component={AdminsArea}
          options={{
            headerShown: false ,
            headerStyle: {
              backgroundColor: '#6183B4',
            }}}
        />
      </Stack.Navigator>
  </NavigationContainer>
  );
};


export default App;