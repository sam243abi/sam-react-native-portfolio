import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartOverlay({ visible, onClose, data, onEditItem, onRemoveItem, onApplyCoupon, onSchedule, onUpdateQuantity }) {
  const [coupon, setCoupon] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  
  const currency = data?.summary?.currency || '₹';
  const summaryRows = data?.summary?.rows || [];
  
  // Exclude "Express Laundry" from displaying in the cart
  const items = (data?.items || []).filter(it => it.id !== 'express-laundry');
  const totalItems = items.length;

  const estimatedTotal = useMemo(() => {
    const itemsTotal = items.reduce((sum, it) => sum + (it.estimatedPrice || 0), 0);
    return itemsTotal;
  }, [items]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <View style={styles.fullsheet}>
          
          {/* 1. Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back" size={22} color="#111" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{data?.title || 'Cart'}</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* 2. Scrollable Content */}
          <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
            
            {/* Yellow Note Box */}
            <View style={{ backgroundColor: '#FFF9C4', padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#FBC02D' }}>
              <Text style={{ color: '#5D4037', fontSize: 13, lineHeight: 18 }}>
                Note: asjdnbaodufbsafiuabfuianbfoasufnasoifdnasoudnasodinasdoiasndosudbsaoufbasofuiabsfoiuasbfoaisfnbsaoifnbasofibasofiubasfoiasbfoiasfbasoifb
              </Text>
            </View>

            {items.map((it) => (
              <View key={it.id} style={styles.itemCard}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemService}>{it.service}</Text>
                  {!!it.unitPrice && <Text style={styles.itemUnitPrice}>{it.currency || currency}{it.unitPrice}</Text>}
                </View>
                <View style={styles.itemIconsRow}>
                  {(() => {
                    const isKgService = it.id === 'wash-fold' || it.id === 'wash-iron';
                    const piecesCount = Array.isArray(it.catalog)
                      ? Object.values(it.items || {}).reduce((sum, n) => sum + (n || 0), 0)
                      : 0;
                    const dynamicBadge = isKgService
                      ? (it.quantity ? `${it.quantity} kg` : null)
                      : (piecesCount > 0 ? `${piecesCount} pc` : null);
                    return null;
                  })()}
                  {it.icons?.map((icon, idx) => (
                    <Ionicons key={idx} name={icon} size={14} color="#6B6F76" style={{ marginRight: 6 }} />
                  ))}
                  {(() => {
                    const isKgService = it.id === 'wash-fold' || it.id === 'wash-iron';
                    const piecesCount = Array.isArray(it.catalog)
                      ? Object.values(it.items || {}).reduce((sum, n) => sum + (n || 0), 0)
                      : 0;
                    const dynamicBadge = isKgService
                      ? (it.quantity ? `${it.quantity} kg` : null)
                      : (piecesCount > 0 ? `${piecesCount} pc` : null);
                    const badgeText = it.badge || dynamicBadge;
                    return !!badgeText ? (<Text style={styles.badge}>{badgeText}</Text>) : null;
                  })()}
                </View>

                {(it.id === 'dry-clean' || it.id === 'iron' || it.id === 'duvets') ? null : (
                  <TouchableOpacity style={styles.itemPriceRow} onPress={() => {
                    setExpandedItems(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(it.id)) { newSet.delete(it.id); } else { newSet.add(it.id); }
                      return newSet;
                    });
                  }}>
                    <Text style={styles.estimatedLabel}>Estimated price</Text>
                    <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                      <Text style={styles.estimatedValue}>{it.currency || currency}{it.estimatedPrice}</Text>
                      <Ionicons name={expandedItems.has(it.id) ? 'chevron-up' : 'chevron-down'} size={16} color="#6B6F76" />
                    </View>
                  </TouchableOpacity>
                )}
                
                {(it.id !== 'dry-clean' && it.id !== 'iron' && it.id !== 'duvets') && expandedItems.has(it.id) && (
                  <View style={{ backgroundColor:'#F7F8FA', borderRadius:10, padding:10, marginTop:6 }}>
                    {(() => {
                      const quantity = it.quantity || 1;
                      const fromCatalog = Array.isArray(it.catalog) ? (it.catalog.map(row => {
                        const q = (it.items || {})[row.id] || 0;
                        return { label: `${row.title}${q > 1 ? ` x${q}` : ''}` , value: q * (row.price || 0) };
                      })) : [];
                      const fromProvided = (it.breakdown || []).map(b => {
                        if (quantity > 1 && ['Item price','Temperature','Eco-friendly detergent','Fabric softener'].includes(b.label)) {
                          return { ...b, label: `${b.label} x${quantity}` };
                        }
                        return b;
                      });
                      const rows = (it.breakdown ? fromProvided : fromCatalog).filter(b => (b.value || 0) > 0);
                      return rows.map((b, idx) => (
                        <View key={idx} style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                          <Text style={{ color:'#555' }}>{b.label}</Text>
                          <Text style={{ color:'#111', fontWeight:'600' }}>{(it.currency||currency)}{b.value}</Text>
                        </View>
                      ));
                    })()}
                    <View style={{ height:1, backgroundColor:'#E6E8EC', marginVertical:6 }} />
                    <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                      <Text style={{ color:'#222', fontWeight:'700' }}>Total</Text>
                      <Text style={{ color:'#05A37B', fontWeight:'800' }}>{(it.currency||currency)}{it.estimatedPrice}</Text>
                    </View>
                  </View>
                )}

                {/* Editable rows for itemized services */}
                {Array.isArray(it.catalog) && it.catalog.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    {(it.catalog || []).map((cat) => {
                      const qty = (it.items || {})[cat.id] || 0;
                      if (qty <= 0) return null;
                      return (
                        <View key={cat.id} style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:6 }}>
                          <Text style={{ color:'#333' }}>{cat.title}</Text>
                          <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={(e) => {
                                e.stopPropagation();
                                const nextQty = Math.max(0, qty - 1);
                                const nextItems = { ...(it.items || {}), [cat.id]: nextQty };
                                const nextTotal = (it.catalog || []).reduce((sum, row) => sum + ((nextItems[row.id] || 0) * (row.price || 0)), 0);
                                
                                // AUTO-REMOVE LOGIC: If total price becomes 0, remove the service
                                if (nextTotal <= 0) {
                                    onRemoveItem?.(it);
                                } else {
                                    onUpdateQuantity?.({ ...it, items: nextItems, estimatedPrice: nextTotal });
                                }
                              }}>
                                <Ionicons name="remove" size={14} color="#333" />
                            </TouchableOpacity>
                            <View ><Text style={styles.qtyVal}>{qty}</Text></View>
                            <TouchableOpacity style={styles.plusBtn} onPress={(e) => {
                              e.stopPropagation();
                              const nextQty = qty + 1;
                              const nextItems = { ...(it.items || {}), [cat.id]: nextQty };
                              const nextTotal = (it.catalog || []).reduce((sum, row) => sum + ((nextItems[row.id] || 0) * (row.price || 0)), 0);
                              onUpdateQuantity?.({ ...it, items: nextItems, estimatedPrice: nextTotal });
                            }}>
                              <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                    
                    {(it.id === 'dry-clean' || it.id === 'iron' || it.id === 'duvets') && (
                      <TouchableOpacity style={styles.itemPriceRow} onPress={() => {
                        setExpandedItems(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(it.id)) { newSet.delete(it.id); } else { newSet.add(it.id); }
                          return newSet;
                        });
                      }}>
                        <Text style={styles.estimatedLabel}>Estimated price</Text>
                        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                          <Text style={styles.estimatedValue}>{it.currency || currency}{it.estimatedPrice}</Text>
                          <Ionicons name={expandedItems.has(it.id) ? 'chevron-up' : 'chevron-down'} size={16} color="#6B6F76" />
                        </View>
                      </TouchableOpacity>
                    )}
                    
                    {(it.id === 'dry-clean' || it.id === 'iron' || it.id === 'duvets') && expandedItems.has(it.id) && (
                      <View style={{ backgroundColor:'#F7F8FA', borderRadius:10, padding:10, marginTop:6 }}>
                        {(() => {
                           const quantity = it.quantity || 1;
                           const fromCatalog = Array.isArray(it.catalog) ? it.catalog.map(row => {
                             const q = (it.items || {})[row.id] || 0;
                             return { label: `${row.title}${q > 1 ? ` x${q}` : ''}` , value: q * (row.price || 0) };
                           }) : [];
                           const fromProvided = (it.breakdown || []).map(b => ({
                             ...b, label: (quantity > 1 && ['Item price','Temperature'].includes(b.label)) ? `${b.label} x${quantity}` : b.label
                           }));
                           const rows = (it.breakdown ? fromProvided : fromCatalog).filter(b => (b.value || 0) > 0);
                           return rows.map((b, idx) => (
                             <View key={idx} style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                               <Text style={{ color:'#555' }}>{b.label}</Text>
                               <Text style={{ color:'#111', fontWeight:'600' }}>{currency}{b.value}</Text>
                             </View>
                           ));
                        })()}
                        <View style={{ height:1, backgroundColor:'#E6E8EC', marginVertical:6 }} />
                        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                          <Text style={{ color:'#222', fontWeight:'700' }}>Total</Text>
                          <Text style={{ color:'#05A37B', fontWeight:'800' }}>{currency}{it.estimatedPrice}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.itemActionsRow}>
                  <TouchableOpacity style={styles.editBtn} onPress={(e) => { e.stopPropagation(); onEditItem?.(it); }}>
                    <Ionicons name="create-outline" size={16} color="#08A6B0" />
                    <Text style={[styles.actionText, { color:'#08A6B0' }]}>Edit</Text>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity style={styles.removeBtn} onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert('Remove item','Are you sure you want to remove this service?',[
                      { text:'Cancel', style:'cancel' },
                      { text:'Delete', style:'destructive', onPress: () => onRemoveItem?.(it) }
                    ]);
                  }}>
                    <Ionicons name="trash-outline" size={16} color="#D25656" />
                    <Text style={[styles.actionText, { color:'#D25656' }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Coupon Box in ScrollView */}
            <View style={styles.couponCard}>
              <Text style={styles.couponLabel}>{data?.coupon?.label}</Text>
              <View style={styles.couponRow}>
                <TextInput style={styles.couponInput} placeholder={data?.coupon?.placeholder} value={coupon} onChangeText={setCoupon} placeholderTextColor="#9AA0A6" />
                <TouchableOpacity style={styles.applyBtn} onPress={() => onApplyCoupon?.(coupon)}>
                  <Text style={styles.applyText}>{data?.coupon?.apply || 'Apply'}</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>

          {/* 3. Fixed Bottom Block */}
          <View style={styles.fixedBottomBlock}>
            
            {/* Dropdown Summary */}
            {summaryExpanded && (
              <View style={[styles.summaryCard, { marginBottom: 12 }]}>
                <Text style={styles.summaryTitle}>{data?.summary?.title}</Text>
                <View style={{ marginTop: 8 }}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLeft}>Total Items</Text>
                    <Text style={styles.summaryRight}>{totalItems}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLeft}>Items Total</Text>
                    <Text style={styles.summaryRight}>{currency}{estimatedTotal}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.summaryRowTotal}>
              <TouchableOpacity 
                onPress={() => setSummaryExpanded(!summaryExpanded)} 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Text style={styles.summaryTotalLeft}>{data?.summary?.estimatedTotalLabel}</Text>
                <Ionicons name={summaryExpanded ? "chevron-down" : "chevron-up"} size={16} color="#111" />
              </TouchableOpacity>
              <Text style={styles.summaryTotalRight}>{currency}{estimatedTotal}</Text>
            </View>
            
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.scheduleBtn} onPress={() => onSchedule?.({ coupon, items, estimatedTotal })}>
                <Text style={styles.scheduleText}>{data?.schedule?.text || 'SCHEDULE'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlayContainer: { flex:1, backgroundColor:'#00000066', justifyContent:'flex-end' },
  fullsheet: { backgroundColor:'#f6f6f6', borderTopLeftRadius:16, borderTopRightRadius:16, height:'96%', flex:1 }, 
  

  header: { 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingHorizontal:16,
    marginTop:50, 
    paddingVertical:8, 
    backgroundColor:'#fff', 
    borderTopLeftRadius:16, 
    borderTopRightRadius:16 
  },
  headerTitle: {
    fontSize:16, 
    fontWeight:'600', 
    color:'#111' 
  },
  scrollableContent: { 
    flex: 1, 
    paddingHorizontal: 12, 
    paddingTop: 6 
  }, 
  itemCard: { 
    backgroundColor:'#fff',
    borderRadius:12, 
    padding:12, 
    marginBottom:12 
  },
  itemHeaderRow: { 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center' 
  },
  itemService: { 
    fontSize:14, 
    fontWeight:'600', 
    color:'#222' 
  },
  itemUnitPrice: { 
    color:'#08A6B0', 
    fontWeight:'600' 
  },
  itemIconsRow: { 
    flexDirection:'row', 
    alignItems:'center', 
    marginTop:8 
  },
  badge: { 
    marginLeft:8, 
    paddingHorizontal:8, 
    paddingVertical:2, 
    borderRadius:10, 
    backgroundColor:'#FFE4C8', 
    color:'#9A5B00', 
    fontSize:11 
  },
  itemPriceRow: { 
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center', 
    marginTop:10 },
  estimatedLabel: { 
    fontWeight:'700', 
    color:'#222' 
  },
  estimatedValue: { 
    color:'#08A6B0', 
    fontWeight:'700' 
  },
  itemActionsRow: { 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-around', 
    marginTop:12 
  },
  editBtn: { 
    flexDirection:'row', 
    alignItems:'center', 
    gap:6 
  },
  removeBtn: { 
    flexDirection:'row', 
    alignItems:'center', 
    gap:6 
  },
  actionText: { 
    fontWeight:'700' 
  },
  divider: { 
    width:1, 
    height:20, 
    backgroundColor:'#EFEFEF' 
  },
  fixedBottomBlock: { 
    backgroundColor:'#f6f6f6', 
    paddingHorizontal: 12, 
    paddingTop: 8, 
    borderTopColor: '#eee', 
    borderTopWidth: 1 
  },
  couponCard: { 
    backgroundColor:'#fff', 
    borderRadius:12, 
    padding:12, 
    marginBottom: 8 
  },
  couponLabel: { 
    fontWeight:'700', 
    color:'#222' 
  },
  couponRow: { 
    flexDirection:'row',
    gap:10, 
    marginTop:10 
  },
  couponInput: { 
    flex:1, 
    height:44, 
    borderRadius:22, 
    backgroundColor:'#F2F4F7', 
    paddingHorizontal:12, 
    color:'#222' 
  },
  applyBtn: { 
    width:110, 
    height:44, 
    borderRadius:22, 
    backgroundColor:'#08A6B0', 
    alignItems:'center', 
    justifyContent:'center' 
  },
  applyText: { 
    color:'#fff', 
    fontWeight:'700' 
  },
  qtyBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor:'#E6E8EC', 
    alignItems:'center', 
    justifyContent:'center' 
  },
  qtyVal: { 
    minWidth: 12, 
    textAlign:'center', 
    color:'#08A6B0', 
    fontWeight:'700' 
  },
  plusBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#08A6B0', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  summaryCard: { 
    backgroundColor:'#fff', 
    borderRadius:12, 
    padding:12,
    marginTop:4,
    marginBottom: 8 
  },
  summaryTitle: { 
    fontWeight:'700', 
    color:'#222' 
  },
  summaryRow: { 
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginTop:8 
  },
  summaryLeft: { 
    color:'#666' 
  },
  summaryRight: { 
    color:'#222', 
    fontWeight:'600' 
  },
  summaryRowTotal: { 
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginTop:14 
  },
  summaryTotalLeft: { 
    fontWeight:'700', 
    color:'#222' 
  },
  summaryTotalRight: { 
    color:'#08A6B0', 
    fontWeight:'800' 
  },
  bottomBar: { 
    paddingBottom:12, 
    paddingTop: 4, 
    backgroundColor:'transparent' 
  }, 
  scheduleBtn: { 
    height:48, 
    borderRadius:28, 
    backgroundColor:'#08A6B0', 
    alignItems:'center', 
    justifyContent:'center' 
  },
  scheduleText: { 
    color:'#fff', 
    fontWeight:'800', 
    letterSpacing:0.5 
  }
});
