import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Button } from './button';

interface QuestionCardProps {
  question: string;
  options: { value: number; label: string }[];
  selectedValue?: number;
  onSelect: (value: number) => void;
}

export function QuestionCard({ question, options, selectedValue, onSelect }: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.options}>
        {options.map((option, index) => (
          <Button
            key={index}
            title={option.label}
            onPress={() => onSelect(option.value)}
            variant={selectedValue === option.value ? 'primary' : 'outline'}
            style={styles.optionButton}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 26,
  },
  options: {
    gap: SPACING.sm,
  },
  optionButton: {
    marginBottom: SPACING.xs,
  },
});