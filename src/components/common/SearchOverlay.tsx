import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Keyboard,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

import { getAuthor } from '../../services/api/author';
import { getMenu } from '../../services/api/category';
import { getYears } from '../../services/api/years';

type Author = { id: number; name: string };
type Category = { id: number; name: string };

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SearchOverlay: React.FC<Props> = ({ visible, onClose }) => {
  // Picker states
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  // Data states
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Fetch initial data
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

  // Keyboard listeners
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSearch = () => {
    const payload = {
      year: selectedYear,
      category: selectedCategory,
      author: selectedAuthor,
    };
    console.log('Search Payload:', payload);
    // TODO: call API or navigate with filters
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true} // Important for Android
    >
      <View style={styles.overlayContainer}>
        {/* Close Button */}
        {!keyboardVisible && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={35} color="white" />
          </TouchableOpacity>
        )}

        <View style={styles.formContainer}>
          {/* Search Input */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Search here..."
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>or</Text>

          {/* Year Picker */}
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

          {/* Category Picker */}
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

          {/* Author Picker */}
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

          {/* Search Button */}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>SEARCH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(38,37,37,0.95)',
    justifyContent: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
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