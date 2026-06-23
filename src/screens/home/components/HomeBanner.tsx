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
import { useTheme } from '../../../redux/hooks/useTheme';
import Toast from 'react-native-toast-message';

const HomeBanner = () => {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    if (!name || !email) {
      Toast.show({
             type: 'error',
             text1: 'Name and email are required',})
      return;
    }

    // console.log('Subscribed:', {
    //   name,
    //   email,
    //   contact,
    // });

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
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? colors.card : '#111',
                shadowColor: isDark ? '#000' : '#000',
              },
            ]}
          >
            <Text style={[styles.title, { color: '#fff' }]}>Subscribe Us</Text>

            <Text
              style={[
                styles.subtitle,
                { color: isDark ? colors.textSecondary : '#bbb' },
              ]}
            >
              Get the latest articles & editions directly in your inbox
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.border : '#ffffff',
                  color: colors.text,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={isDark ? colors.textMuted : '#999'}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.border : '#ffffff',
                  color: colors.text,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? colors.textMuted : '#999'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? colors.border : '#ffffff',
                  color: colors.text,
                },
              ]}
              placeholder="Enter your number"
              placeholderTextColor={isDark ? colors.textMuted : '#999'}
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
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
    marginHorizontal: -12,
  },

  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },

  button: {
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
