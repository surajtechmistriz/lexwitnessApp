import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const HomeBanner = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    if (!name || !email) {
      console.log('Name and email are required');
      return;
    }

    console.log('Subscribed:', {
      name,
      email,
      contact,
    });

    // reset form (optional)
    setName('');
    setEmail('');
    setContact('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.wrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Subscribe Us</Text>

            <Text style={styles.subtitle}>
              Get the latest articles & editions directly in your inbox
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your number"
              placeholderTextColor="#999"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeBanner;

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal:-12
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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