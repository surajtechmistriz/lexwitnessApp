import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

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
        style={[styles.arrowBox, currentPage === 1 && styles.disabledArrow]}
      >
        <View style={[styles.chevron, styles.chevronLeft, currentPage === 1 && styles.disabledChevron]} />
      </TouchableOpacity>

      {/* Page Numbers */}
      <View style={styles.pagesRow}>
        {pages.map((page, index) => (
          <View key={index}>
            {page === "..." ? (
              <Text style={styles.ellipsis}>...</Text>
            ) : (
              <TouchableOpacity
                disabled={loading}
                onPress={() => onPageChange(page as number)}
                style={[
                  styles.pageBtn,
                  currentPage === page && styles.activePageBtn
                ]}
              >
                <Text style={[
                  styles.pageText,
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
        style={[styles.arrowBox, currentPage === lastPage && styles.disabledArrow]}
      >
        <View style={[styles.chevron, styles.chevronRight, currentPage === lastPage && styles.disabledChevron]} />
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  activePageBtn: {
    backgroundColor: '#c9060a',
    borderColor: '#c9060a',
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
    color: '#444',
  },
  activePageText: {
    color: '#fff',
  },
  ellipsis: {
    paddingHorizontal: 4,
    color: '#aaa',
    fontSize: 16,
  },
  arrowBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledArrow: {
    backgroundColor: '#f9f9f9',
    opacity: 0.5,
  },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#333',
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
    borderColor: '#ccc',
  }
});