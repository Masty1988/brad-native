import Svg, { Defs, LinearGradient, Stop, Text as SvgText, TSpan } from 'react-native-svg';

interface BradLogoProps {
  width?: number;
  height?: number;
  variant?: 'default' | 'white';
}

export default function BradLogo({ width = 150, height = 50, variant = 'default' }: BradLogoProps) {
  const gradientId = `bradGradient-${Math.random()}`;

  return (
    <Svg width={width} height={height} viewBox="0 0 300 100">
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
          <Stop offset="100%" stopColor="#10B981" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <SvgText
        x="20"
        y="72"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="50"
        fill={variant === 'white' ? 'white' : `url(#${gradientId})`}
      >
        Brad
        <TSpan fontSize="60" dy="0">.</TSpan>
      </SvgText>
    </Svg>
  );
}
