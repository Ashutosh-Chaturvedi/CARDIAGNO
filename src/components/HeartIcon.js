import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const HeartIcon = ({ size = 64, color = THEME.colors.primary, animated = false }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name="heart" size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
