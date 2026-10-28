import { Portal } from 'heroui-native';
import { useId } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../Typography/Typography';
import { styles } from './style';
export type TabOption<T extends string = string> = {
  label: string;
  value: T;
};

export const TABS_HEIGHT = 50;
export const TABS_TOP_GAP = 8;

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const id = useId();

  return (
    <Portal name={`tabs-${id}`}>
      <View pointerEvents="box-none" style={[styles.overlay, { top: insets.top + TABS_TOP_GAP }]}>
        <View style={styles.container}>
          <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
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
                  <Pressable
                    key={item.value}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    aria-selected={selected}
                    onPress={() => onValueChange(item.value)}
                    style={[
                      styles.tab,
                      selected && [styles.selectedTab, { backgroundColor: theme.button }],
                    ]}
                  >
                    <Typography
                      text={item.label.trim()}
                      variant="body"
                      style={{
                        ...(selected ? styles.selectedLabel : undefined),
                        color: selected ? theme.buttonText : theme.text,
                      }}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </Portal>
  );
};
