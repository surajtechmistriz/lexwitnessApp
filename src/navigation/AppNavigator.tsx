import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Profile from "../screens/Profile";


export type RootStackParamList = {
    Home:  undefined;
    Profile: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
            screenOptions={{headerShown:false}}
            >
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Profile" component={Profile}/>
                </Stack.Navigator>
        </NavigationContainer>
    )
}


export default AppNavigator