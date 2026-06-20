import React, { useEffect, useState } from "react";
import { Image, ImageProps } from "react-native";
import { useTheme } from "../../../redux/hooks/useTheme";

const localFallback = require("../../../assets/fallback.png");

type Props = ImageProps & {
  uri?: string;
  fallback?: any; // can be require() or uri
  useDarkFallback?: boolean; // Optional: use different fallback for dark mode
};

const SafeImage = ({ 
  uri, 
  fallback, 
  style, 
  useDarkFallback = false,
  ...props 
}: Props) => {
  const { isDark } = useTheme();
  const [source, setSource] = useState(
    uri ? { uri } : localFallback
  );

  // Optional dark mode fallback
  const getFallback = () => {
    if (fallback) return fallback;
    if (useDarkFallback && isDark) {
      // You can add a dark-specific fallback here
      return require("../../../assets/fallback-dark.png");
    }
    return localFallback;
  };

  useEffect(() => {
    setSource(uri ? { uri } : getFallback());
  }, [uri, isDark]);

  return (
    <Image
      {...props}
      source={source}
      style={style}
      onError={() =>
        setSource(getFallback())
      }
    />
  );
};

export default SafeImage;