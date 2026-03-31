import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WavyCurveProps {
  width: number;
  height?: number;
  color: string;
  style?: ViewStyle;
}

export const WavyCurve: React.FC<WavyCurveProps> = ({ 
  width, 
  height = 60, 
  color, 
  style 
}) => {
  return (
    <View style={[styles.svgContainer, { height }, style]}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <Path
          d={`M0 0 C${width * 0.25} 40, ${width * 0.45} 10, ${width * 0.5} 40 C${width * 0.55} 10, ${width * 0.75} 40, ${width} 0 L${width} ${height} L0 ${height} Z`}
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
});
