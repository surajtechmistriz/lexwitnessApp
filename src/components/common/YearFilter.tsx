import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
  onApply: () => void;
}

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onSelect,
  onApply,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* row layout */}
      <View style={styles.row}>

        {/* dropdown button */}
        <TouchableOpacity
          style={styles.dropdownBtn}
          onPress={() => setOpen(true)}
        >
          <Text>{selectedYear ?? 'Select Year'}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* filter button */}
        <TouchableOpacity
  style={styles.filterBtn}
  onPress={() => {
    onApply();       // apply filter
    setOpen(false);  //  close dropdown
  }}
>
  <Text style={styles.filterText}>Filter</Text>
</TouchableOpacity>

      </View>

      {/* modal dropdown */}
      <Modal visible={open} transparent animationType="fade">
        
        {/* overlay close */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          {/* dropdown box */}
          <View style={styles.dropdownBox}>
            <FlatList
              data={[null, ...years]}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text>
                    {item === null ? 'All Years' : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>

      </Modal>

    </View>
  );
};

export default YearFilter;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    
  },

  // row layout
  row: {
    flexDirection: 'row',
    gap: 10,
  },

  // dropdown button
  dropdownBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
     
  },

  // filter button
  filterBtn: {
    backgroundColor: '#c9060a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight:91,
        paddingBottom:40,
     marginTop:-37

        
  },

  // dropdown box
  dropdownBox: {
    backgroundColor: '#fff',
    // borderRadius: 6,
    maxHeight: 300,
   
  },

  // item
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});