/* eslint-disable react-native/no-inline-styles */
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from '../redux/hooks/useTheme';
import { Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Enhanced Toast Config with better styling and icons
export const getToastConfig = (colors: any, isDark: boolean): ToastConfig => ({
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success || '#22c55e',
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        borderRadius: 12,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 16,
        minHeight: 60,
        borderLeftWidth: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#1a1a1a',
        letterSpacing: 0.3,
      }}
      text2Style={{
        fontSize: 13,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
        marginTop: 2,
      }}
      renderLeadingIcon={() => (
        <View style={{
          marginLeft: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon 
            name="check-circle" 
            size={24} 
            color={colors.success || '#22c55e'} 
          />
        </View>
      )}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error || '#ef4444',
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        borderRadius: 12,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 16,
        minHeight: 60,
        borderLeftWidth: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#1a1a1a',
        letterSpacing: 0.3,
      }}
      text2Style={{
        fontSize: 13,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
        marginTop: 2,
      }}
      renderLeadingIcon={() => (
        <View style={{
          marginLeft: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon 
            name="alert-circle" 
            size={24} 
            color={colors.error || '#ef4444'} 
          />
        </View>
      )}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary || '#c9060a',
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        borderRadius: 12,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 16,
        minHeight: 60,
        borderLeftWidth: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#1a1a1a',
        letterSpacing: 0.3,
      }}
      text2Style={{
        fontSize: 13,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
        marginTop: 2,
      }}
      renderLeadingIcon={() => (
        <View style={{
          marginLeft: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon 
            name="info" 
            size={24} 
            color={colors.primary || '#c9060a'} 
          />
        </View>
      )}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#f59e0b',
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        borderRadius: 12,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 16,
        minHeight: 60,
        borderLeftWidth: 4,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#1a1a1a',
        letterSpacing: 0.3,
      }}
      text2Style={{
        fontSize: 13,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
        marginTop: 2,
      }}
      renderLeadingIcon={() => (
        <View style={{
          marginLeft: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon 
            name="alert-triangle" 
            size={24} 
            color="#f59e0b" 
          />
        </View>
      )}
    />
  ),
});

// Hook-based config with memoization
import { useMemo } from 'react';

export const useToastConfig = () => {
  const { colors, isDark } = useTheme();

  const toastConfig = useMemo(() => {
    const baseStyle = {
      borderRadius: 12,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 12,
      elevation: 8,
      marginHorizontal: 16,
      minHeight: 60,
      borderLeftWidth: 4,
    };

    const baseContentStyle = {
      paddingHorizontal: 16,
      paddingVertical: 8,
    };

    const text1Style = {
      fontSize: 15,
      fontWeight: '600' as const,
      color: isDark ? '#ffffff' : '#1a1a1a',
      letterSpacing: 0.3,
    };

    const text2Style = {
      fontSize: 13,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontWeight: '400' as const,
      marginTop: 2,
    };

    const renderIcon = (iconName: string, color: string) => () => (
      <View style={{
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon name={iconName} size={24} color={color} />
      </View>
    );

    return {
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{
            ...baseStyle,
            borderLeftColor: colors.success || '#22c55e',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          }}
          contentContainerStyle={baseContentStyle}
          text1Style={text1Style}
          text2Style={text2Style}
          renderLeadingIcon={renderIcon('check-circle', colors.success || '#22c55e')}
        />
      ),
      error: (props: any) => (
        <ErrorToast
          {...props}
          style={{
            ...baseStyle,
            borderLeftColor: colors.error || '#ef4444',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          }}
          contentContainerStyle={baseContentStyle}
          text1Style={text1Style}
          text2Style={text2Style}
          renderLeadingIcon={renderIcon('alert-circle', colors.error || '#ef4444')}
        />
      ),
      info: (props: any) => (
        <BaseToast
          {...props}
          style={{
            ...baseStyle,
            borderLeftColor: colors.primary || '#c9060a',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          }}
          contentContainerStyle={baseContentStyle}
          text1Style={text1Style}
          text2Style={text2Style}
          renderLeadingIcon={renderIcon('info', colors.primary || '#c9060a')}
        />
      ),
      warning: (props: any) => (
        <BaseToast
          {...props}
          style={{
            ...baseStyle,
            borderLeftColor: '#f59e0b',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          }}
          contentContainerStyle={baseContentStyle}
          text1Style={text1Style}
          text2Style={text2Style}
          renderLeadingIcon={renderIcon('alert-triangle', '#f59e0b')}
        />
      ),
    };
  }, [colors, isDark]);

  return toastConfig;
};

// Toast helper functions with consistent usage
export const showToast = {
  success: (text1: string, text2?: string) => {
    Toast.show({
      type: 'success',
      text1,
      text2: text2 || '',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
  },
  
  error: (text1: string, text2?: string) => {
    Toast.show({
      type: 'error',
      text1,
      text2: text2 || '',
      position: 'top',
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
  },
  
  info: (text1: string, text2?: string) => {
    Toast.show({
      type: 'info',
      text1,
      text2: text2 || '',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
  },
  
  warning: (text1: string, text2?: string) => {
    Toast.show({
      type: 'warning',
      text1,
      text2: text2 || '',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
  },
};

// Usage in App.tsx or root component
export const ToastContainer = () => {
  const { colors, isDark } = useTheme();
  const toastConfig = getToastConfig(colors, isDark);
  
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={50}
      bottomOffset={40}
      visibilityTime={3000}
      autoHide={true}
    />
  );
};


// Usage in components (simplified)
// Instead of:
// Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated' });
// Use:
// showToast.success('Profile updated successfully');
// showToast.error('Failed to update profile', 'Please try again');