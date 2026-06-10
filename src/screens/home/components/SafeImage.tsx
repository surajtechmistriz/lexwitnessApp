import React, { useEffect, useState } from "react";
import { Image, ImageProps } from "react-native";

const localFallback = require("../../../assets/fallback.png");

type Props = ImageProps & {
  uri?: string;
  fallback?: any; // can be require() or uri
};

const SafeImage = ({ uri, fallback, style, ...props }: Props) => {
  const [source, setSource] = useState(
    uri ? { uri } : localFallback
  );

  useEffect(() => {
    setSource(uri ? { uri } : localFallback);
  }, [uri]);

  return (
    <Image
      {...props}
      source={source}
      style={style}
      onError={() =>
        setSource(fallback ? fallback : localFallback)
      }
    />
  );
};

export default SafeImage;