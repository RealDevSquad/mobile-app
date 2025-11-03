import { theme } from '@/constants/theme';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FilterOption = {
  label: string;
  value: string;
};

type TaskRequestFiltersProps = {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  filterOptions: FilterOption[];
};

const getFilterColor = (value: string) => {
  switch (value) {
    case 'PENDING':
      return theme.colors.warning[500];
    case 'APPROVED':
      return theme.colors.success[500];
    case 'REJECTED':
      return theme.colors.error[500];
    default:
      return theme.colors.primary[600];
  }
};

export const TaskRequestFilters: React.FC<TaskRequestFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  filterOptions,
}) => {
  return (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {filterOptions.map((option) => {
          const isSelected = selectedFilter === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip,
                isSelected && [
                  styles.filterChipSelected,
                  { backgroundColor: getFilterColor(option.value) },
                ],
              ]}
              onPress={() => onFilterChange(option.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    paddingVertical: theme.spacing.md,
  },
  filterScrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    marginRight: theme.spacing.sm,
  },
  filterChipSelected: {
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  filterChipTextSelected: {
    color: theme.colors.text.inverted,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
