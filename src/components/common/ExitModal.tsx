import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Pressable,
} from 'react-native';

interface ExitModalProps {
  visible: boolean;
  onClose: () => void;
}

const ExitModal = ({ visible, onClose }: ExitModalProps) => {
  const handleExit = () => {
    onClose();
    BackHandler.exitApp();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Text style={styles.emoji}>👋</Text>

          <Text style={styles.title}>Exit App</Text>

          <Text style={styles.message}>
            Are you sure you want to exit the application?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.exitButton}
              onPress={handleExit}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ExitModal;

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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    elevation: 8,
  },

  emoji: {
    fontSize: 46,
    textAlign: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 28,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  exitButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600' as const,
  },

  exitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
