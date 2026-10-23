import { View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
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
          <PressableFeedback
            key={tag}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => toggleTag(tag)}
            style={[styles.tag, isSelected && styles.selectedTag]}
          >
            <Typography text={tag} variant='body' />
          </PressableFeedback>
        );
      })}
    </View>
  );
};
