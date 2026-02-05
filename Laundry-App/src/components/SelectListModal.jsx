import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SelectListModal({ visible, title, options = [], selectedId, onClose, onSelect }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Pressable background closes modal when touched outside */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color="#666" /></TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => { onSelect?.(item); onClose?.(); }}>
                <Ionicons name={item.icon || 'ellipse-outline'} size={18} color="#333" />
                <Text style={styles.rowText}>{item.label}</Text>
                {selectedId === item.id && <Ionicons name="checkmark" size={18} color="#08A6B0" />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    flex:1, 
    backgroundColor:'#00000066', 
    justifyContent:'flex-end', 
    alignItems:'center',
    paddingBottom: 5
  },
  sheet: { 
    width:'100%', 
    maxHeight:'70%',
    backgroundColor:'#fff', 
    borderTopLeftRadius:16, 
    borderTopRightRadius:16,
    overflow:'hidden' 
  },
  header: { 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingHorizontal:16, 
    paddingVertical:12 
  },
  title: { 
    fontSize:16, 
    fontWeight:'600', 
    color:'#111' 
  },
  row: { 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingHorizontal:16, 
    paddingVertical:14 
  },
  rowText: { 
    flex:1, 
    marginLeft:10, 
    color:'#222' 
  },
  sep: { 
    height:1, 
    backgroundColor:'#F0F2F4'
  }
});


