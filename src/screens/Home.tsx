import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/Header';
import Menubar from '../components/Menubar';
import Hero from '../components/Hero';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Menubar />
      <Hero />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Home Screen</Text>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default Home;
