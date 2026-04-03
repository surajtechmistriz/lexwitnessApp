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
  Animated, // 1. Import Animated
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
  
  // 2. Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.8)).current; 

  const [searchText, setSearchText] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // 3. Trigger Animation on visibility change
  useEffect(() => {
    if (visible) {
      // Opening: Fade in and Scale to 1
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
      // Closing: Fade out and Scale back down
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

  // Fetch Data logic remains same...
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
      } catch (error) {
        console.log('Error fetching search data:', error);
      }
    };
    fetchData();
  }, []);

  // Keyboard and BackHandler logic remains same...
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose && onClose();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible]);

  const handleSearch = () => {
    const params: any = { page: 1 };
    if (searchText.trim()) {
      params.search = searchText.trim();
      params.mode = 'search';
      if (/^\d{4}$/.test(searchText.trim())) params.year = searchText.trim();
    }
    if (selectedYear) params.year = selectedYear;
    if (selectedCategory) params.category_id = selectedCategory;
    if (selectedAuthor) params.author_id = selectedAuthor;

    onClose && onClose();
    navigation.navigate('Archive', params);
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={() => onClose && onClose()}
    >
      {/* 4. Use Animated.View for the Overlay Background */}
      <Animated.View style={[styles.overlayContainer, { opacity: fadeAnim }]}>
        
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            onClose && onClose();
          }}
        />

        {/* 5. Use Animated.View for Content Scaling */}
        <Animated.View 
            style={[
                styles.contentWrapper, 
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
          {!keyboardVisible && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => onClose && onClose()}
            >
              <Ionicons name="close" size={35} color="white" />
            </TouchableOpacity>
          )}

          <View style={styles.formContainer}>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Search here..."
                placeholderTextColor="#ccc"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or</Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedYear}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={value => setSelectedYear(String(value))}
              >
                <Picker.Item label="Select Year" value="" color="#000" />
                {years.map(y => (
                  <Picker.Item key={y} label={String(y)} value={String(y)} color="#000" />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={value => setSelectedCategory(String(value))}
              >
                <Picker.Item label="Select Category" value="" color="#000" />
                {categories.map(c => (
                  <Picker.Item key={c.id} label={c.name} value={String(c.id)} color="#000" />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedAuthor}
                style={styles.picker}
                dropdownIconColor="white"
                onValueChange={value => setSelectedAuthor(String(value))}
              >
                <Picker.Item label="Select Author" value="" color="#000" />
                {authors.map(a => (
                  <Picker.Item key={a.id} label={a.name} value={String(a.id)} color="#000" />
                ))}
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
    backgroundColor: 'rgba(38,37,37,0.98)', // Slightly darker for focus
    justifyContent: 'center',
    padding: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20, // Adjusted for internal wrapper
    right: 0,
    zIndex: 10,
  },
  formContainer: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    height: 50,
  },
  orText: {
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    width: '100%',
  },
  searchBtn: {
    backgroundColor: '#c9060a',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  searchBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchOverlay;