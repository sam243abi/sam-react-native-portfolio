import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const washIcon = require('../assets/images/washIcon.png');

export default function SimpleServiceOverlay({ visible, onClose, data, onAddToCart, onSchedule, editMode = false, editData = null, onSaveChanges }) {
  const [quantity, setQuantity] = useState(editMode && editData ? editData.quantity : 1);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState('');

  // Reset state when overlay opens with edit data
  React.useEffect(() => {
    if (visible) {
      console.log('SimpleServiceOverlay opened - editMode:', editMode, 'editData:', editData);
      if (editMode && editData) {
        console.log('Setting edit data quantity:', editData.quantity);
        setQuantity(editData.quantity || 1);
      } else {
        console.log('Setting default quantity');
        setQuantity(1);
      }
    }
  }, [visible, editMode, editData]);

  const inc = () => setQuantity(q => Math.min(q + 1, data?.quantity?.max || 50));
  const dec = () => setQuantity(q => Math.max(q - 1, data?.quantity?.min || 1));

  const total = useMemo(() => {
    const basePrice = data?.items?.[0]?.price || 0;
    return basePrice * quantity;
  }, [quantity, data]);

  const currency = data?.currency || '₹';
  const serviceItem = data?.items?.[0] || {};
  const washFoldCard = data?.washFoldCard || {};

  const showInfo = (content) => {
    setInfoContent(content);
    setShowInfoModal(true);
  };

  return (
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
              <Text style={styles.serviceTitle}>{washFoldCard.title || data?.title}</Text>
              <View style={styles.tagContainer}>
                {washFoldCard.tags?.map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: tag.color }]}>
                    <Text style={styles.tagText}>{tag.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.serviceDescription}>
                {washFoldCard.description || data?.additionalNote?.text || 'Sed dictum dictum tortor. Aenean non nulla sed sem euismod vehicula. Donec a tincidunt neque.'}
              </Text>
            </View>

            {/* Quantity Card */}
            <View style={styles.quantityCard}>
              <View style={styles.quantityHeader}>
                <Text style={styles.quantityTitle}>Quantity</Text>
                <Text style={styles.quantitySubtitle}>{data?.subtitle || 'Price per item'}</Text>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemIcon}>
                    <Image source={washIcon} style={styles.itemIconImage} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{serviceItem.title}</Text>
                    <Text style={styles.itemPrice}>{currency}{serviceItem.price}{serviceItem.unit || ''}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemTotalPrice}>{currency}{total}</Text>
                  {quantity > 1 && (
                    <TouchableOpacity onPress={dec} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={14} color="#fff" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.qtyVal}>{quantity}</Text>
                  <TouchableOpacity onPress={inc} style={styles.plusBtn}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
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
              <Text style={styles.totalLabel}>Estimated price</Text>
              <Text style={styles.totalValue}>{currency} {total}</Text>
            </View>
            
            {editMode ? (
              <TouchableOpacity
                style={[styles.actionsButton, { backgroundColor: '#08A6B0', width: '100%' }]}
                onPress={() => onSaveChanges?.({
                  ...editData,
                  quantity,
                  estimatedPrice: total,
                  unitPrice: serviceItem.price
                })}
              >
                <Text style={styles.actionButtonText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#08A6B0' }]}
                  onPress={() => onAddToCart?.({
                    service: data?.title,
                    quantity,
                    unitPrice: serviceItem.price,
                    estimatedPrice: total,
                    currency,
                    breakdown: [
                      { label: 'Item price', value: total }
                    ]
                  })}
                >
                  <Text style={styles.actionButtonText}>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F28B66' }]}
                  onPress={() => onSchedule?.({
                    service: data?.title,
                    quantity,
                    estimatedPrice: total,
                    breakdown: [
                      { label: 'Item price', value: total }
                    ],
                    currency
                  })}
                >
                  <Text style={styles.actionButtonText}>SCHEDULE NOW</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

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
    </Modal>
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
    maxHeight: '90%',
    minHeight:'70%',
    paddingTop: 10
  },
  header: { 
    alignItems: 'flex-end', 
    paddingHorizontal: 20, 
    paddingBottom: 10 ,
    alignSelf: 'center',
  },
  CloseOut: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', top: -130 },
  closeButton: { padding: 8 },
  scroll: { 
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
  quantityCard: {
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
  quantityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  quantitySubtitle: {
    fontSize: 14,
    color: '#999'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    borderTopColor: '#f0f0f0'
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
    justifyContent: 'center',top:0
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