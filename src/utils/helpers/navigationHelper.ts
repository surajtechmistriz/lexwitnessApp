import { navigationRef } from '../../navigation/AppNavigator';

// simple navigation
export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(name, params);
  }
}

// nested navigation
export function navigateNested(stack: string, screen: string, params?: any) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(stack, {
      screen,
      params,
    });
  }
}