import { Portal } from 'heroui-native';
import type { ComponentRef } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
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

export const Tabs = <T extends string,>({
  items,
  value,
  onValueChange,
}: TabsProps<T>) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const id = useId();

  const scrollViewRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const hasMoreTabs = contentWidth > containerWidth && containerWidth > 0;
  
  useEffect(() => {
    if (!hasMoreTabs || hasAnimated) return;

    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: Math.min(100, contentWidth - containerWidth),
        animated: true
      });

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: 0,
          animated: true,
        });
      }, 300);

      setHasAnimated(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [hasMoreTabs, hasAnimated, contentWidth, containerWidth]);

  return (
    <Portal name={`tabs-${id}`}>
      <View
        pointerEvents="box-none"
        style={[styles.overlay, { top: insets.top + TABS_TOP_GAP }]}
      >
        <View style={styles.container}>
          <View
            style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}
          >
            <ScrollView
              ref={scrollViewRef}
              horizontal
              style={styles.scrollView}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabList}
              accessibilityRole="tablist"
              onContentSizeChange={(width) => setContentWidth(width)}
              onLayout={(event) =>
                setContainerWidth(event.nativeEvent.layout.width)
              }
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
                      selected && [
                        styles.selectedTab,
                        { backgroundColor: theme.button },
                      ],
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
