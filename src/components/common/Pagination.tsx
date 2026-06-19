import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../redux/useTheme';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  loading = false,
  onPageChange,
}: PaginationProps) {
  const { colors, isDark } = useTheme();
  
  if (lastPage <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(lastPage, currentPage + 1);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastPage - 1) pages.push("...");
    if (end < lastPage) pages.push(lastPage);

    return pages;
  };

  const pages = getPages();

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        disabled={loading || currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[
          styles.arrowBox,
          { backgroundColor: colors.card },
          currentPage === 1 && styles.disabledArrow
        ]}
      >
        <View style={[
          styles.chevron, 
          styles.chevronLeft, 
          { borderColor: currentPage === 1 ? colors.textMuted : colors.text },
          currentPage === 1 && styles.disabledChevron
        ]} />
      </TouchableOpacity>

      {/* Page Numbers */}
      <View style={styles.pagesRow}>
        {pages.map((page, index) => (
          <View key={index}>
            {page === "..." ? (
              <Text style={[styles.ellipsis, { color: colors.textMuted }]}>...</Text>
            ) : (
              <TouchableOpacity
                disabled={loading}
                onPress={() => onPageChange(page as number)}
                style={[
                  styles.pageBtn,
                  { 
                    backgroundColor: currentPage === page ? colors.primary : colors.card,
                    borderColor: currentPage === page ? colors.primary : colors.border,
                  },
                  currentPage === page && styles.activePageBtn
                ]}
              >
                <Text style={[
                  styles.pageText,
                  { color: currentPage === page ? '#fff' : colors.textSecondary },
                  currentPage === page && styles.activePageText
                ]}>
                  {page}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        disabled={loading || currentPage === lastPage}
        onPress={() => onPageChange(currentPage + 1)}
        style={[
          styles.arrowBox,
          { backgroundColor: colors.card },
          currentPage === lastPage && styles.disabledArrow
        ]}
      >
        <View style={[
          styles.chevron, 
          styles.chevronRight, 
          { borderColor: currentPage === lastPage ? colors.textMuted : colors.text },
          currentPage === lastPage && styles.disabledChevron
        ]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    gap: 10,
  },
  pagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  activePageBtn: {
    ...Platform.select({
      ios: {
        shadowColor: '#c9060a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activePageText: {
    color: '#fff',
  },
  ellipsis: {
    paddingHorizontal: 4,
    fontSize: 16,
  },
  arrowBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledArrow: {
    opacity: 0.5,
  },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  chevronLeft: {
    transform: [{ rotate: '-135deg' }],
    marginLeft: 3,
  },
  chevronRight: {
    transform: [{ rotate: '45deg' }],
    marginRight: 3,
  },
  disabledChevron: {
    opacity: 0.3,
  }
});