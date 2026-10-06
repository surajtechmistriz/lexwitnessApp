import { useCallback, useEffect, useState } from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

import fallbackImage from '../../../assets/images/fallback.png';
import fallbackDarkImage from '../../../assets/images/fallback-dark.png';
import { useTheme } from '../../../store/hooks/useTheme';

type SafeImageProps = ImageProps & {
  uri?: string;
  fallback?: ImageSourcePropType;
  useDarkFallback?: boolean;
};

const SafeImage = ({
  uri,
  fallback,
  useDarkFallback = false,
  ...props
}: SafeImageProps) => {
  const { isDark } = useTheme();

  const getFallback = useCallback((): ImageSourcePropType => {
    if (fallback) {
      return fallback;
    }

    if (useDarkFallback && isDark) {
      return fallbackDarkImage;
    }

    return fallbackImage;
  }, [fallback, isDark, useDarkFallback]);

  const getSource = useCallback((): ImageSourcePropType => {
    return uri ? { uri } : getFallback();
  }, [getFallback, uri]);

  const [source, setSource] = useState<ImageSourcePropType>(getSource());

  useEffect(() => {
    setSource(getSource());
  }, [getSource]);

  const handleImageError = useCallback(() => {
    setSource(getFallback());
  }, [getFallback]);

  return <Image {...props} source={source} onError={handleImageError} />;
};

export default SafeImage;
