import { useState } from 'react';
import { Text, View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { styles } from './style';

type CalendarProps = {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
};

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const sameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const dayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

// Use to select a date from a month view.
export const Calendar = ({ value, onChange, minDate, maxDate }: CalendarProps) => {
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
    <View style={styles.calendar}>
      <View style={styles.header}>
        <PressableFeedback
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => changeMonth(-1)}
          style={styles.monthButton}
        >
          <Text style={styles.monthButtonLabel}>‹</Text>
        </PressableFeedback>
        <Text accessibilityLiveRegion="polite" style={styles.monthLabel}>
          {visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </Text>
        <PressableFeedback
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => changeMonth(1)}
          style={styles.monthButton}
        >
          <Text style={styles.monthButtonLabel}>›</Text>
        </PressableFeedback>
      </View>

      <View style={styles.grid}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
        {cells.map((date, index) => {
          if (!date) return <View key={`empty-${index}`} style={styles.dayCell} />;

          const isSelected = value ? sameDay(value, date) : false;
          const isToday = sameDay(new Date(), date);
          const timestamp = dayStart(date);
          const isDisabled =
            (minDate !== undefined && timestamp < dayStart(minDate)) ||
            (maxDate !== undefined && timestamp > dayStart(maxDate));

          return (
            <PressableFeedback
              key={date.toISOString()}
              accessibilityRole="button"
              accessibilityLabel={date.toLocaleDateString()}
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              isDisabled={isDisabled}
              onPress={() => onChange(date)}
              style={[
                styles.dayCell,
                isToday && styles.today,
                isSelected && styles.selectedDay,
                isDisabled && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.selectedDayLabel,
                  isDisabled && styles.disabledDayLabel,
                ]}
              >
                {date.getDate()}
              </Text>
            </PressableFeedback>
          );
        })}
      </View>
    </View>
  );
};
