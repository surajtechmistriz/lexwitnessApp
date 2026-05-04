import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Keyboard,
  Platform,
  BackHandler,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

import { getAuthor } from '../../services/api/author';
import { getMenu } from '../../services/api/category';
import { getYears } from '../../services/api/years';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Author = { id: number; name: string };
type Category = { id: number; name: string };

type Props = {
  visible: boolean;
  onClose?: () => void;
};

const SearchOverlay: React.FC<Props> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
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
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]).start();
    } else {
      setError(''); // Reset error on close
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
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
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) { onClose?.(); return true; }
      return false;
    });
    return () => { showSub.remove(); hideSub.remove(); backHandler.remove(); };
  }, [visible, onClose]);

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
    navigation.navigate('Home', {
  screen: 'Archive',
  params,
})
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.overlayContainer, { opacity: fadeAnim }]}>
        
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={() => { Keyboard.dismiss(); onClose?.(); }} 
        />

        <Animated.View style={[styles.contentWrapper, { transform: [{ scale: scaleAnim }] }]}>
          {!keyboardVisible && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={35} color="white" />
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

            <View style={[styles.searchBar, error ? styles.searchBarError : null]}>
              <TextInput
                style={styles.input}
                placeholder="Search here..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or</Text>

            {/* PICKERS */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedYear}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={v => setSelectedYear(String(v))}
              >
                <Picker.Item label="Select Year" value="" color="#888" />
                {years.map(y => <Picker.Item key={y} label={String(y)} value={String(y)} color="#000" />)}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={v => setSelectedCategory(String(v))}
              >
                <Picker.Item label="Select Category" value="" color="#888" />
                {categories.map(c => <Picker.Item key={c.id} label={c.name} value={String(c.id)} color="#000" />)}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedAuthor}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={v => setSelectedAuthor(String(v))}
              >
                <Picker.Item label="Select Author" value="" color="#888" />
                {authors.map(a => <Picker.Item key={a.id} label={a.name} value={String(a.id)} color="#000" />)}
              </Picker>
            </View>

            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
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
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
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
    borderColor: '#555',
    paddingBottom: 5,
    alignItems: 'center',
  },
  searchBarError: {
    borderColor: '#ff4d4d',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    height: 50,
  },
  orText: {
    color: '#777',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    width: '100%',
  },
  searchBtn: {
    backgroundColor: '#c9060a',
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