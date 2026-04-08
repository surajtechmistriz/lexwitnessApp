import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const HomeBanner = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    console.log('Subscribed:', email);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Subscribe Us</Text>

        <Text style={styles.subtitle}>
          Get the latest articles & editions directly in your inbox
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name.."
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your number.."
          placeholderTextColor="#999"
          value={contact}
          onChangeText={setContact}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeBanner;

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
    // paddingHorizontal: 12,
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },

  input: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    color: '#fff',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#c9060a',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});