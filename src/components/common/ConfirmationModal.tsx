import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="log-out-outline" size={38} color="#DC2626" />
          </View>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            disabled={loading}
            style={styles.confirmButton}
            onPress={onConfirm}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>{confirmText}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity disabled={loading} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },

  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 28,
  },

  confirmButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#666',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
