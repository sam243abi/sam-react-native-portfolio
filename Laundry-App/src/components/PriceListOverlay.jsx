import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const washIcon = require('../assets/images/washIcon.png');

export default function PriceListOverlay({ visible, onClose, data, onAddToCart, onSchedule, editMode = false, editData = null, onSaveChanges }) {
  const [quantitiesByItem, setQuantitiesByItem] = useState(editMode && editData ? editData.items : {});
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState('');

  // Reset state when overlay opens with edit data
  React.useEffect(() => {
    if (visible) {
      console.log('PriceListOverlay opened - editMode:', editMode, 'editData:', editData);
      if (editMode && editData) {
        console.log('Setting edit data items:', editData.items);
        setQuantitiesByItem(editData.items || {});
      } else {
        console.log('Setting default empty items');
        setQuantitiesByItem({});
      }
      setSelectedFilter('All');
    }
  }, [visible, editMode, editData]);

  const inc = (id) => {
    setQuantitiesByItem(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const dec = (id) => {
    setQuantitiesByItem(prev => {
      const next = Math.max(0, (prev[id] || 0) - 1);
      return { ...prev, [id]: next };
    });
  };

  const total = useMemo(() => {
    const items = data?.items || [];
    return items.reduce((sum, it) => sum + (quantitiesByItem[it.id] || 0) * (it.price || 0), 0);
  }, [quantitiesByItem, data]);

  const currency = data?.currency || '₹';

  const getFilteredItems = (items) => {
    if (selectedFilter === 'All') return items;
    return items.filter(item => item.category === selectedFilter);
  };

  const showInfo = (content) => {
    setInfoContent(content);
    setShowInfoModal(true);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.overlayContainer}>
          {/* Pressable background closes modal when touched outside */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          
          <View style={styles.overlayContent}>
          {/* Header with close button */}
          <View style={styles.header}>
          <View style={styles.CloseOut}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
      </View>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Title Card */}
            <View style={styles.titleCard}>
              <Text style={styles.serviceTitle}>{data?.title?.replace(' Price List', '') || 'Service'}</Text>
              <View style={styles.tagContainer}>
                <View style={[styles.tag, { backgroundColor: data?.id === 'ironing' ? '#D4A574' : '#B794D4' }]}>
                  <Text style={styles.tagText}>{data?.title?.replace(' Price List', '').toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.serviceDescription}>
                {data?.additionalNote?.text || 'Sed dictum dictum tortor. Aenean non nulla sed sem euismod vehicula. Donec a tincidunt neque.'}
              </Text>
            </View>

            {/* Price List Card */}
            <View style={styles.priceListCard}>
              <View style={styles.priceListHeader}>
                <Text style={styles.priceListTitle}>Price List</Text>
                <Text style={styles.priceListSubtitle}>{data?.subtitle || 'Price per item'}</Text>
              </View>

              {/* Filter tabs */}
              {data?.filters && (
                <View style={styles.filterTabs}>
                  {data.filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterTab,
                        selectedFilter === filter && styles.filterTabActive
                      ]}
                      onPress={() => setSelectedFilter(filter)}
                    >
                      <Text style={[
                        styles.filterTabText,
                        selectedFilter === filter && styles.filterTabTextActive
                      ]}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Items */}
              {getFilteredItems(data?.items || []).map((it) => {
                const currentQuantity = quantitiesByItem[it.id] || 0;
                const itemTotalPrice = currentQuantity * (it.price || 0);

                return (
                  <View key={it.id} style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                      <View style={styles.itemIcon}>
                        <Image source={washIcon} style={styles.itemIconImage} />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{it.title}</Text>
                        <Text style={styles.itemPrice}>{currency}{it.price}{it.unit || ''}</Text>
                      </View>
                    </View>
                    <View style={styles.itemRight}>
                      {currentQuantity > 0 && (
                        <Text style={styles.itemTotalPrice}>{currency}{itemTotalPrice}</Text>
                      )}
                      {currentQuantity > 0 && (
                        <TouchableOpacity onPress={() => dec(it.id)} style={styles.qtyBtn}>
                          <Ionicons name="remove" size={14} color="#fff" />
                        </TouchableOpacity>
                      )}
                      {currentQuantity > 0 && (
                        <Text style={styles.qtyVal}>{currentQuantity}</Text>
                      )}
                      <TouchableOpacity onPress={() => inc(it.id)} style={styles.plusBtn}>
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Additional Note Card */}
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Additional Note</Text>
              <Text style={styles.noteText}>
                {data?.additionalNote?.text || 'Sed dictum dictum tortor. Aenean non nulla sed sem euismod vehicula. Donec a tincidunt neque.'}
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalValue}>{currency} {total}</Text>
            </View>
            

            
            {editMode ? (
              <TouchableOpacity
                style={[styles.actionsButton, { 
                  backgroundColor: '#08A6B0', 
                  width: '100%',
                  minHeight: 50,
                  marginTop: 10,
                  shadowColor: '#08A6B0',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }]}
                onPress={() => onSaveChanges?.({
                  ...editData,
                  items: quantitiesByItem,
                  estimatedPrice: total
                })}
              >
                <Text style={[styles.actionButtonText, { fontSize: 16, fontWeight: '700' }]}>SAVE CHANGES</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#08A6B0' }]}
                  onPress={() => onAddToCart?.({ items: quantitiesByItem, total })}
                >
                  <Text style={styles.actionButtonText}>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F28B66' }]}
                  onPress={() => onSchedule?.({ items: quantitiesByItem, total })}
                >
                  <Text style={styles.actionButtonText}>SCHEDULE NOW</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>

    {/* Info Modal */}
    <Modal visible={showInfoModal} transparent animationType="fade">
      <View style={styles.infoModalOverlay}>
        <View style={styles.infoModalContent}>
          <Text style={styles.infoModalText}>{infoContent}</Text>
          <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.infoModalCloseButton}>
            <Text style={styles.infoModalCloseText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlayContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end' 
  },
  overlayContent: { 
    backgroundColor: '#F5F5F5', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    maxHeight: '85%',
    minHeight: '70%',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  CloseOut: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', top: -130 },
  header: { 
    alignItems: 'flex-end', 
    paddingHorizontal: 20, 
    paddingBottom: 10 ,
    alignSelf: 'center',
  },
  closeButton: { padding: 8 },
  scroll: { 
    flex: 1,
    paddingHorizontal: 20 
  },
  titleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  priceListCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  priceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  priceListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  priceListSubtitle: {
    fontSize: 14,
    color: '#999'
  },
  filterTabs: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 16 
  },
  filterTab: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#f0f0f0' 
  },
  filterTabActive: { 
    backgroundColor: '#F28B66' 
  },
  filterTabText: { 
    fontSize: 12, 
    color: '#666',
    fontWeight: '500'
  },
  filterTabTextActive: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  itemIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2
  },
  itemPrice: {
    fontSize: 14,
    color: '#666'
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#08A6B0',
    minWidth: 60,
    textAlign: 'right'
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6E8EC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyVal: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#08A6B0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40, // Extra bottom padding for safe area
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 'auto', // Push to bottom
    flexShrink: 0 // Don't shrink this section
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#08A6B0'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionsButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',top:-0
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  infoModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  infoModalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    margin: 20, 
    maxWidth: '80%' 
  },
  infoModalText: { 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  infoModalCloseButton: { 
    backgroundColor: '#08A6B0', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8, 
    alignSelf: 'center' 
  },
  infoModalCloseText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 14 
  }
});