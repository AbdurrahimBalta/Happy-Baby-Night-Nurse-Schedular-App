import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onSelect }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default RadioButton;