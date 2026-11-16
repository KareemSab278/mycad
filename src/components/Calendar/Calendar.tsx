import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../Typography/Typography';
import { styles } from './style';

type CalendarProps = {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
};

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const sameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const dayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

// Use to select a date from a month view.
export const Calendar = ({ label, value, onChange, minDate, maxDate, showTime = false }: CalendarProps) => {
  const theme = useTheme();
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date((value ?? new Date()).getFullYear(), (value ?? new Date()).getMonth(), 1),
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? new Date(year, month, day) : null;
  });

  const changeMonth = (monthOffset: number) => {
    setVisibleMonth(new Date(year, month + monthOffset, 1));
  };

  return (
    <View style={[styles.calendar, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {label ? <Typography text={label} variant="caption" /> : null}
      {!timePickerVisible ? (
        <>
          <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => changeMonth(-1)}
          style={styles.monthButton}
        >
          <Typography text="‹" style={{ ...styles.monthButtonLabel, color: theme.text }} />
        </Pressable>
        <Typography
          text={visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          style={styles.monthLabel}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => changeMonth(1)}
          style={styles.monthButton}
        >
          <Typography text="›" style={{ ...styles.monthButtonLabel, color: theme.text }} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <Typography key={day} text={day} variant="caption" style={styles.weekDay} />
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((date, index) => {
          if (!date) return <View key={`empty-${index}`} style={styles.dayCell} />;

          const isSelected = value ? sameDay(value, date) : false;
          const isToday = sameDay(new Date(), date);
          const timestamp = dayStart(date);
          const isDisabled =
            (minDate !== undefined && timestamp < dayStart(minDate)) ||
            (maxDate !== undefined && timestamp > dayStart(maxDate));

          return (
            <Pressable
              key={date.toISOString()}
              accessibilityRole="button"
              accessibilityLabel={date.toLocaleDateString()}
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              disabled={isDisabled}
              onPress={() => {
                const selectedDate = new Date(date);
                if (value) {
                  selectedDate.setHours(
                    value.getHours(),
                    value.getMinutes(),
                    value.getSeconds(),
                    value.getMilliseconds(),
                  );
                }
                onChange(selectedDate);
              }}
              style={[styles.dayCell, isDisabled && styles.disabledDay]}
            >
              <View style={[
                styles.dayIndicator,
                isToday && { borderColor: theme.button, borderWidth: 1 },
                isSelected && { backgroundColor: theme.button },
              ]}>
                <Typography
                  text={date.getDate().toString()}
                  style={{ ...styles.dayLabel, color: isSelected ? theme.buttonText : theme.text }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
          {showTime ? (
            <View style={[styles.timePicker, { borderTopColor: theme.border }]}>
              <Typography text="Time" variant="caption" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={value ? `Change time, ${value.toLocaleTimeString()}` : 'Select a date first'}
                accessibilityState={{ disabled: !value }}
                disabled={!value}
                onPress={() => setTimePickerVisible(true)}
                style={[
                  styles.timeFieldButton,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  !value && styles.disabledDay,
                ]}
              >
                <Typography
                  text={value
                    ? value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
                    : 'Select a date first'}
                />
              </Pressable>
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.timeSelection}>
          <Typography text="Select time" variant="caption" />
          <DateTimePicker
            value={value ?? new Date()}
            mode="time"
            display={Platform.OS === 'android' ? 'clock' : 'spinner'}
            presentation={Platform.OS === 'android' ? 'dialog' : 'inline'}
            is24Hour
            onValueChange={(_event, selectedTime) => {
              const updatedDate = new Date(value ?? new Date());
              updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
              onChange(updatedDate);
              if (Platform.OS === 'android') setTimePickerVisible(false);
            }}
            onDismiss={() => setTimePickerVisible(false)}
            positiveButton={{ label: 'Done' }}
            negativeButton={{ label: 'Cancel' }}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setTimePickerVisible(false)}
              style={styles.timeDoneButton}
            >
              <Typography text="Done" style={{ color: theme.button }} />
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
};
