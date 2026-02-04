import { ActivityIndicator, Image, ImageResizeMode, View } from "react-native";
import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60";

interface ImageWithSkeletonProps {
  uri?: string | null;
  containerClassName?: string;
  imageClassName?: string;
  fallbackUri?: string;
  resizeMode?: ImageResizeMode;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  uri,
  containerClassName = "",
  imageClassName = "",
  fallbackUri = FALLBACK_IMAGE,
  resizeMode = "cover",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const resolvedUri = !uri || failed ? fallbackUri : uri;

  return (
    <View className={`relative overflow-hidden ${containerClassName}`}>
      {!loaded && (
        <View className="font-poppins absolute inset-0 bg-gray-200/70 items-center justify-center">
          <ActivityIndicator color="#FF7629" />
        </View>
      )}
      <Image
        source={{ uri: resolvedUri }}
        onError={() => setFailed(true)}
        onLoadEnd={() => setLoaded(true)}
        resizeMode={resizeMode}
        className={`${imageClassName} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </View>
  );
};

export default ImageWithSkeleton;

