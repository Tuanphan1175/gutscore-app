import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';

interface ScoreCardProps {
  label: string;
  score: number;
  color?: string;
}

export function ScoreCard({ label, score, color }: ScoreCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.score, color ? { color } : null]}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  score: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
});