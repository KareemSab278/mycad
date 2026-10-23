import { ScrollView, View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { Typography } from '../Typography/Typography';
import { styles } from './style';
export type TabOption<T extends string = string> = {
  label: string;
  value: T;
};

type TabsProps<T extends string> = {
  items: readonly TabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

// Use for switching between related content panels.
export const Tabs = <T extends string,>({
  items,
  value,
  onValueChange,
}: TabsProps<T>) => {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <ScrollView
          horizontal
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
          accessibilityRole="tablist"
        >
          {items.map((item) => {
            const selected = item.value === value;
            return (
              <PressableFeedback
                key={item.value}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => onValueChange(item.value)}
                style={[styles.tab, selected && styles.selectedTab]}
              >
                <Typography text={item.label} variant='body' style={selected ? styles.selectedLabel : undefined} />
              </PressableFeedback>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
