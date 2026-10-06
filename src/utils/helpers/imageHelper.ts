import Config from 'react-native-config';

const MAGAZINES_BASE_URL = Config.MAGAZINES_BASE_URL;
const POSTS_BASE_URL = Config.POSTS_BASE_URL;

export const getMagazineImageUrl = (image?: string) =>
  image ? `${MAGAZINES_BASE_URL}/${image}` : '';

export const getPostImageUrl = (image?: string) =>
  image ? `${POSTS_BASE_URL}/${image}` : '';
