import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

type Props = { color: string; size?: number };

export function IconHome({ color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSearch({ color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth={1.6} />
      <Line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function IconCamera({ color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 8.5A1.5 1.5 0 013.5 7h.9l1.4-2h8.4l1.4 2h.9A1.5 1.5 0 0120 8.5v9A1.5 1.5 0 0118.5 19h-15A1.5 1.5 0 012 17.5v-9z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Circle cx="11" cy="13" r="3" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function IconDNA({ color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* DNA helix — two interweaving strands */}
      <Path d="M8 3C8 3 10 6 12 6S16 3 16 3" stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M8 21C8 21 10 18 12 18S16 21 16 21" stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M8 3C7 7 9 10 12 12S17 17 16 21" stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M16 3C17 7 15 10 12 12S7 17 8 21" stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Line x1="8.5" y1="8.5" x2="15.5" y2="8.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Line x1="8.5" y1="15.5" x2="15.5" y2="15.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Line x1="9.5" y1="12" x2="14.5" y2="12" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

export function IconTrophy({ color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 3h8v7a4 4 0 01-8 0V3z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M5 4H3a1 1 0 00-1 1v2a4 4 0 003.8 4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M19 4h2a1 1 0 011 1v2a4 4 0 01-3.8 4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M12 14v3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M8 21h8" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M9 17h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
