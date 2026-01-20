import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RNGoogleMap from '../Screens/RNGoogleMaps'
import { NavigationContainer } from '@react-navigation/native'
import ModuleSelect from '../Screens/ModuleSelect'
import RNGoogleLogin from '../Screens/RNGoogleLogin'
import RNArVr from '../Screens/RNArgumentReality'

const Stack = createStackNavigator()

const MainRoute = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='moduleSelect'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                }}
            >
                <Stack.Screen name='moduleSelect' component={ModuleSelect} />
                <Stack.Screen name='rnmap' component={RNGoogleMap} />
                <Stack.Screen name='RNGoogleLogin' component={RNGoogleLogin} />
                <Stack.Screen name='RNArVr' component={RNArVr} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainRoute