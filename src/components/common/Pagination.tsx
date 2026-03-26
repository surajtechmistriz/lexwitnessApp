import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
    const start = Math.max(1, currentPage - 1); // Reduced range for mobile screens
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
      <Text style={styles.label}>Pages:</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Previous Button */}
        {currentPage > 1 && (
          <TouchableOpacity
            disabled={loading}
            onPress={() => onPageChange(currentPage - 1)}
            style={styles.pageBox}
          >
            <Text style={styles.arrowText}>«</Text>
          </TouchableOpacity>
        )}

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <View key={index} style={styles.itemWrapper}>
            {page === "..." ? (
              <Text style={styles.ellipsis}>...</Text>
            ) : (
              <TouchableOpacity
                disabled={loading}
                onPress={() => onPageChange(page as number)}
                style={[
                  styles.pageBox,
                  currentPage === page && styles.activePageBox
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

        {/* Next Button */}
        {currentPage < lastPage && (
          <TouchableOpacity
            disabled={loading}
            onPress={() => onPageChange(currentPage + 1)}
            style={styles.pageBox}
          >
            <Text style={styles.arrowText}>»</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollContent: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageBox: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activePageBox: {
    backgroundColor: '#c9060a',
    borderColor: '#c9060a',
  },
  pageText: {
    fontSize: 13,
    color: '#333',
  },
  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  arrowText: {
    fontSize: 18,
    color: '#333',
    marginTop: -2, // Visual alignment
  },
  ellipsis: {
    paddingHorizontal: 5,
    color: '#999',
  },
});