import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Keyboard,
  BackHandler,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

import { getAuthor } from '../../services/api/author';
import { getMenu } from '../../services/api/category';
import { getYears } from '../../services/api/years';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../redux/hooks/useTheme';

//  DEFINE TYPE LOCALLY
type RootStackParamList = {
  Archive: {
    search?: string;
    year?: string;
    category_id?: string;
    author_id?: string;
    page?: number;
    mode?: string;
  };
  // Add other screens as needed
};

type Author = { id: number; name: string };
type Category = { id: number; name: string };

type Props = {
  visible: boolean;
  onClose?: () => void;
};

const SearchOverlay: React.FC<Props> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Form States
  const [searchText, setSearchText] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  // App States
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState('');

  // 1. Clear error when user changes any input
  useEffect(() => {
    if (error) setError('');
  }, [searchText, selectedYear, selectedCategory, selectedAuthor]);

  // 2. Animation Logic
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setError(''); // Reset error on close
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorRes, categoryRes, yearRes] = await Promise.all([
          getAuthor(),
          getMenu(),
          getYears(),
        ]);
        setAuthors(authorRes.data || []);
        setCategories(categoryRes || []);
        setYears(yearRes.data || []);
      } catch (err) {
        console.log('Error fetching search data:', err);
      }
    };
    fetchData();
  }, []);

  // Keyboard & Back Button Handlers
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          onClose?.();
          return true;
        }
        return false;
      },
    );
    return () => {
      showSub.remove();
      hideSub.remove();
      backHandler.remove();
    };
  }, [visible, onClose]);

  // ------FIXED NAVIGATION------

  const handleSearch = () => {
    const params: any = { page: 1 };
    const hasSearch = searchText.trim().length > 0;
    const hasFilters = selectedYear || selectedCategory || selectedAuthor;

    // VALIDATION: Prevent mixing text search and dropdown filters
    if (hasSearch && hasFilters) {
      setError('Please select only one: Search text OR Filters.');
      return;
    }

    if (!hasSearch && !hasFilters) {
      setError('Please enter a keyword or select a filter.');
      return;
    }

    if (hasSearch) {
      params.search = searchText.trim();
      params.mode = 'search';
      if (/^\d{4}$/.test(searchText.trim())) params.year = searchText.trim();
    } else {
      if (selectedYear) params.year = selectedYear;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedAuthor) params.author_id = selectedAuthor;
    }

    onClose?.();

    navigation.navigate('Archive', params);
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlayContainer,
          {
            opacity: fadeAnim,
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.98)'
              : 'rgba(20, 20, 20, 0.98)',
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            onClose?.();
          }}
        />

        <Animated.View
          style={[styles.contentWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          {!keyboardVisible && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={35}
                color={isDark ? '#fff' : 'white'}
              />
            </TouchableOpacity>
          )}

          <View style={styles.formContainer}>
            {/* ERROR MESSAGE DISPLAYED ABOVE SEARCH FIELD */}
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#ff4d4d" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View
              style={[
                styles.searchBar,
                error ? styles.searchBarError : null,
                { borderColor: error ? '#ff4d4d' : isDark ? '#666' : '#555' },
              ]}
            >
              <TextInput
                style={[styles.input, { color: isDark ? '#fff' : 'white' }]}
                placeholder="Search here..."
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.orText, { color: isDark ? '#888' : '#777' }]}>
              or
            </Text>

            {/* PICKERS */}
            <View
              style={[
                styles.pickerWrapper,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: isDark ? '#555' : '#444',
                },
              ]}
            >
              <Picker
                selectedValue={selectedYear}
                style={[styles.picker, { color: isDark ? '#bbb2b2' : 'white' }]}
                dropdownIconColor={isDark ? '#fff' : 'white'}
                onValueChange={v => setSelectedYear(String(v))}
              >
                <Picker.Item
                  label="Select Year"
                  value=""
                  color={isDark ? '#888' : '#888'}
                />
                {years.map(y => (
                  <Picker.Item
                    key={y}
                    label={String(y)}
                    value={String(y)}
                    color={isDark ? '#000' : '#000'}
                  />
                ))}
              </Picker>
            </View>

            <View
              style={[
                styles.pickerWrapper,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: isDark ? '#555' : '#444',
                },
              ]}
            >
              <Picker
                selectedValue={selectedCategory}
                style={[styles.picker, { color: isDark ? '#bbb2b2' : 'white' }]}
                dropdownIconColor={isDark ? '#fff' : 'white'}
                onValueChange={v => setSelectedCategory(String(v))}
              >
                <Picker.Item
                  label="Select Category"
                  value=""
                  color={isDark ? '#888' : '#888'}
                />
                {categories.map(c => (
                  <Picker.Item
                    key={c.id}
                    label={c.name}
                    value={String(c.id)}
                    color={isDark ? '#000' : '#000'}
                  />
                ))}
              </Picker>
            </View>

            <View
              style={[
                styles.pickerWrapper,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: isDark ? '#555' : '#444',
                },
              ]}
            >
              <Picker
                selectedValue={selectedAuthor}
                style={[styles.picker, { color: isDark ? '#bbb2b2' : 'white' }]}
                dropdownIconColor={isDark ? '#fff' : 'white'}
                onValueChange={v => setSelectedAuthor(String(v))}
              >
                <Picker.Item
                  label="Select Author"
                  value=""
                  color={isDark ? '#888' : '#888'}
                />
                {authors.map(a => (
                  <Picker.Item
                    key={a.id}
                    label={a.name}
                    value={String(a.id)}
                    color={isDark ? '#000' : '#000'}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.searchBtn, { backgroundColor: colors.primary }]}
              onPress={handleSearch}
            >
              <Text style={styles.searchBtnText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  contentWrapper: {
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '600',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    paddingBottom: 5,
    alignItems: 'center',
  },
  searchBarError: {
    borderColor: '#ff4d4d',
  },
  input: {
    flex: 1,
    fontSize: 20,
    height: 50,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  searchBtn: {
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 8,
    elevation: 3,
  },
  searchBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
});

export default SearchOverlay;
