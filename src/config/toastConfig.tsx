import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useTheme } from '../redux/hooks/useTheme';

// You'll need to pass theme colors from your app
export const getToastConfig = (colors: any, isDark: boolean) => ({
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success || '#16a34a',
        backgroundColor: isDark ? colors.card : '#f0fff4',
        borderRadius: 10,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: isDark ? colors.text : '#1f2937',
      }}
      text2Style={{
        fontSize: 12,
        color: isDark ? colors.textSecondary : '#4b5563',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error || '#c9060a',
        backgroundColor: isDark ? colors.card : '#fff1f1',
        borderRadius: 10,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: isDark ? colors.text : '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: isDark ? colors.textSecondary : '#555555',
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary || '#c9060a',
        backgroundColor: isDark ? colors.card : '#fff7f7',
        borderRadius: 10,
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: isDark ? colors.text : '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: isDark ? colors.textSecondary : '#666666',
      }}
    />
  ),
});

// Alternative: Direct export with theme hook
export const useToastConfig = () => {
  const { colors, isDark } = useTheme(); // Assuming you have useTheme hook

  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success || '#16a34a',
          backgroundColor: isDark ? colors.card : '#f0fff4',
          borderRadius: 10,
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: '700',
          color: isDark ? colors.text : '#1f2937',
        }}
        text2Style={{
          fontSize: 12,
          color: isDark ? colors.textSecondary : '#4b5563',
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error || '#c9060a',
          backgroundColor: isDark ? colors.card : '#fff1f1',
          borderRadius: 10,
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: '700',
          color: isDark ? colors.text : '#333333',
        }}
        text2Style={{
          fontSize: 12,
          color: isDark ? colors.textSecondary : '#555555',
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.primary || '#c9060a',
          backgroundColor: isDark ? colors.card : '#fff7f7',
          borderRadius: 10,
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: '700',
          color: isDark ? colors.text : '#333333',
        }}
        text2Style={{
          fontSize: 12,
          color: isDark ? colors.textSecondary : '#666666',
        }}
      />
    ),
  };
};
