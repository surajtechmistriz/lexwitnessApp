import Toast, {
  BaseToast,
  ErrorToast,
} from 'react-native-toast-message';


export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#16a34a',
        backgroundColor: '#f0fff4',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 12,
        color: '#4b5563',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#c9060a',
        backgroundColor: '#fff1f1',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: '#555555',
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#c9060a',
        backgroundColor: '#fff7f7',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 12,
        color: '#666666',
      }}
    />
  ),
};