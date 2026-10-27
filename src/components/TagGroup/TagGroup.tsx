import { Pressable, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../Typography/Typography';
import { styles } from './style';
// Use to display and select a set of tags or categories.
export const TagGroup = ({
  tags,
  selectedTags,
  onSelectionChange,
}: {
  tags: readonly string[];
  selectedTags: readonly string[];
  onSelectionChange: (selected: string[]) => void;
}) => {
  const theme = useTheme();

  const toggleTag = (tag: string) => {
    onSelectionChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((selected) => selected !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <View style={styles.container}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Pressable
            key={tag}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => toggleTag(tag)}
            style={[
              styles.tag,
              { backgroundColor: isSelected ? theme.button : theme.backgroundSelected },
            ]}
          >
            <Typography
              text={tag}
              variant="body"
              style={{ color: isSelected ? theme.buttonText : theme.text }}
            />
          </Pressable>
        );
      })}
    </View>
  );
};
