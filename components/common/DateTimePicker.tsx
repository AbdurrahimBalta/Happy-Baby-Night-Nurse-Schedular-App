import React, { useState } from 'react';
import { View, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DateTimePickerNative from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { formatDate, formatTime } from '@/utils/dateUtils';

interface DateTimePickerProps {
  mode: 'date' | 'time';
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: object;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  mode,
  value,
  onChange,
  minimumDate,
  maximumDate,
  style
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    onChange(currentDate);
  };

  const showPicker = () => {
    setShow(true);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={showPicker}
      >
        {mode === 'date' ? (
          <Calendar size={20} color={COLORS.primary} />
        ) : (
          <Clock size={20} color={COLORS.primary} />
        )}
        
        <Text style={styles.valueText}>
          {mode === 'date' ? formatDate(value) : formatTime(value)}
        </Text>
      </TouchableOpacity>

      {(show || Platform.OS === 'ios') && (
        <DateTimePickerNative
          testID="dateTimePicker"
          value={value}
          mode={mode}
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    height: 56,
  },
  valueText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
});

export default DateTimePicker;