import { navigationRef } from "../../navigation/AppNavigator";

// simple navigation
export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

// nested navigation (IMPORTANT FIXED)
export function navigateNested(
  stack: string,
  screen: string,
  params?: any
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(stack as never, {
      screen,
      params,
    } as never);
  }
}