declare module 'react-native-config' {
  export interface NativeConfig {
    BANNER_BASE_URL: any;
    NEXT_PUBLIC_BANNER_BASE_URL: any;
    EDITORIAL_IMAGE_URL: any;
    POSTS_BASE_URL: any;
    MAGAZINES_BASE_URL: any;
    API_BASE_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}