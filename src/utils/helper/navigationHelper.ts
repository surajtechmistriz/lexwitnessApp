import { navigationRef } from "../../navigation/AppNavigator";

export const navigateToAuthor = (slug: string) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('AppMain', {
      screen: 'AuthorScreen',
      params: { slug },
    });
  }
};