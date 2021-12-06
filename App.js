
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
import Hadath from './screens/hadath'
import AdminsArea from './screens/adminsArea'
//import HeaderTitle from './components/header'


const Stack = createNativeStackNavigator()
const App = () => {

  return (
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ 
            headerShown: false 
          }}
        />
        <Stack.Screen
          name="Hadath"
          component={Hadath}
          options={{
            headerShown: false ,
            }}
        />
         <Stack.Screen
          name="AdminsArea"
          component={AdminsArea}
          options={{
            //headerTitle: props => <HeaderTitle {...props} />,
            //headerLeft: null,
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