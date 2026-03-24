import React, { useState, useEffect } from 'react';
import { 
  Modal, View, TextInput, TouchableOpacity, StyleSheet, 
  Text, ScrollView, ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; 

const SearchOverlay = ({ visible, onClose, navigation }: any) => {
  const [titleSearch, setTitleSearch] = useState("");
  const [year, setYearId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Dummy data (Replace with your API calls: getYears, getAuthors, etc.)
  const years = ["2024", "2023", "2022"];
  const categories = [{id: 1, name: "Legal"}, {id: 2, name: "Corporate"}];
  const authors = [{id: 1, name: "John Doe"}];

  const handleSearch = () => {
    // Construct search query logic similar to your Next.js URLSearchParams
    onClose();
    navigation.navigate('Archive', { 
      search: titleSearch, 
      year, 
      category_id: categoryId, 
      author_id: authorId 
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlayContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          {/* Title Search */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Search here..."
              placeholderTextColor="#ccc"
              value={titleSearch}
              onChangeText={setTitleSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>or</Text>

          {/* Filters */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={year}
              onValueChange={(itemValue) => setYearId(itemValue)}
              style={styles.picker}
              dropdownIconColor="white"
            >
              <Picker.Item label="Select Year" value="" color="#000" />
              {years.map(y => <Picker.Item key={y} label={y} value={y} color="#000" />)}
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={categoryId}
              onValueChange={(val) => setCategoryId(val)}
              style={styles.picker}
              dropdownIconColor="white"
            >
              <Picker.Item label="Select Category" value="" color="#000" />
              {categories.map(c => <Picker.Item key={c.id} label={c.name} value={c.id.toString()} color="#000" />)}
            </Picker>
          </View>

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>SEARCH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
  closeButton: { position: 'absolute', top: 50, right: 20 },
  formContainer: { width: '100%' },
  searchBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 5, alignItems: 'center' },
  input: { flex: 1, color: 'white', fontSize: 20, height: 50 },
  orText: { color: '#ccc', textAlign: 'center', marginVertical: 20, fontSize: 16 },
  pickerWrapper: { borderWidth: 1, borderColor: '#555', marginBottom: 15, borderRadius: 5 },
  picker: { color: 'white', width: '100%' },
  searchBtn: { backgroundColor: '#c9060a', padding: 15, alignItems: 'center', marginTop: 10 },
  searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default SearchOverlay;