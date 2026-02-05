import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import data from '../../data/addressBook.json';
import SelectListModal from '../../components/SelectListModal';
import ScreenWrapper from '../../components/ScreenWrapper';
import { getAddresses, saveAddresses } from '../../utils/storage';

export default function AddressBook({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [query, setQuery] = useState('');
  const [collectionPicker, setCollectionPicker] = useState({ visible: false, addrId: null });
  const [deliveryPicker, setDeliveryPicker] = useState({ visible: false, addrId: null });

  // Load addresses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadStoredAddresses = async () => {
        try {
          const storedAddresses = await getAddresses();
          if (storedAddresses && storedAddresses.length > 0) {
            setAddresses(storedAddresses);
            console.log('📍 Loaded', storedAddresses.length, 'addresses from storage');
          } else {
            // Load default addresses from JSON if no stored addresses
            setAddresses(data.addresses);
            await saveAddresses(data.addresses);
            console.log('📍 Loaded default addresses from JSON');
          }
        } catch (error) {
          console.error('❌ Error loading addresses:', error);
          setAddresses(data.addresses);
        }
      };

      loadStoredAddresses();
    }, [])
  );

  // No longer needed - all address operations are handled directly in storage

  const filtered = useMemo(() => {
    if (!query) return addresses;
    return addresses.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.address.toLowerCase().includes(query.toLowerCase()));
  }, [query, addresses]);

  const setCurrent = async (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isCurrent: addr.id === id
    }));
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
    console.log('📍 Set current address:', id);
  };

  const editAddress = (address) => {
    console.log('✏️ Editing address:', address);

    // Parse the address to extract individual components
    const addressParts = address.address.split(', ');
    let completeAddress = addressParts[0] || '';
    let floor = '';
    let landmark = '';

    // Extract floor and landmark if they exist
    addressParts.forEach(part => {
      if (part.startsWith('Floor: ')) {
        floor = part.replace('Floor: ', '');
      } else if (part.startsWith('Near: ')) {
        landmark = part.replace('Near: ', '');
      } else if (part !== addressParts[0]) {
        completeAddress += ', ' + part;
      }
    });

    // Determine address type based on label
    let addressType = 'home';
    if (address.label.toLowerCase() === 'office') {
      addressType = 'office';
    } else if (address.label.toLowerCase() !== 'home') {
      addressType = 'other';
    }

    // Navigate to EnterCompleteAddress with pre-filled data
    navigation.navigate('EnterCompleteAddress', {
      editMode: true,
      addressData: {
        id: address.id,
        isCurrent: address.isCurrent,
        addressType: addressType,
        customLabel: address.customLabel || (addressType === 'other' ? address.label : ''),
        completeAddress: completeAddress,
        floor: floor,
        landmark: landmark,
        receiverName: address.receiverName || '',
        receiverPhone: address.phone ? address.phone.replace('+91 ', '') : '',
        collectionMethod: address.collectionMethod,
        deliveryMethod: address.deliveryMethod
      }
    });
  };

  const updateCollection = async (addrId, methodId) => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === addrId ? { ...addr, collectionMethod: methodId } : addr
    );
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const updateDelivery = async (addrId, methodId) => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === addrId ? { ...addr, deliveryMethod: methodId } : addr
    );
    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const deleteAddress = (addrId, addressLabel) => {
    // Prevent deleting if it's the current address
    const addressToDelete = addresses.find(a => a.id === addrId);
    if (addressToDelete?.isCurrent) {
      Alert.alert(
        'Cannot Delete',
        'You cannot delete your current address. Please select a different address as current first.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${addressLabel}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== addrId);
            setAddresses(updatedAddresses);
            await saveAddresses(updatedAddresses);
            console.log('🗑️ Address deleted:', addrId);

            // Show success message
            Alert.alert('✅ Deleted', 'Address deleted successfully!', [{ text: 'OK' }]);
          }
        }
      ]
    );
  };

  const collectionMap = useMemo(() => Object.fromEntries(data.collectionMethods.map(m => [m.id, m.label])), []);
  const deliveryMap = useMemo(() => Object.fromEntries(data.deliveryMethods.map(m => [m.id, m.label])), []);

  return (
    <ScreenWrapper navigation={navigation} route={route}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color="#111" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{data.addressBook.title}</Text>
            <View style={{ width: 22 }} />
          </View>

          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#9AA0A6" />
            <TextInput style={styles.searchInput} placeholder={data.searchPlaceholder} value={query} onChangeText={setQuery} placeholderTextColor="#9AA0A6" />
          </View>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map')}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="locate" size={18} color="#08A6B0" />
                <View>
                  <Text style={styles.cardTitle}>{data.useCurrent.title}</Text>
                  <Text style={styles.cardSub}>{data.useCurrent.address}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.addNew]} onPress={() => navigation.navigate('Map')}>
            <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
              <Ionicons name="add" size={18} color="#08A6B0" />
              <Text style={[styles.cardTitle, {color:'#08A6B0'}]}>{data.addNew.title}</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>{data.savedHeader}</Text>
          {filtered.map(addr => (
            <TouchableOpacity
              key={addr.id}
              style={[
                styles.addressCard,
                addr.isCurrent && styles.currentAddressCard
              ]}
              onPress={() => setCurrent(addr.id)}
              activeOpacity={0.7}
            >
              <View style={styles.addressHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons
                    name={addr.label.toLowerCase() === 'home' ? 'home' : addr.label.toLowerCase() === 'office' ? 'business' : 'location'}
                    size={18}
                    color={addr.isCurrent ? "#08A6B0" : "#9AA0A6"}
                  />
                  <Text style={[
                    styles.addressLabel,
                    addr.isCurrent && styles.currentAddressLabel
                  ]}>
                    {addr.label}
                  </Text>
                  {addr.isCurrent && <Text style={styles.youAreHere}>You are here</Text>}
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    editAddress(addr);
                  }}>
                    <Ionicons name="pencil" size={16} color="#08A6B0" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr.id, addr.label);
                  }}>
                    <Ionicons name="trash" size={16} color="#E85C5C" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[
                styles.addressSub,
                addr.isCurrent && styles.currentAddressSub
              ]}>
                {addr.address}
              </Text>
              <Text style={[
                styles.addressSub,
                addr.isCurrent && styles.currentAddressSub
              ]}>
                {`Phone no : ${addr.phone}`}
              </Text>
              <View style={styles.methodsRow}>
                <View style={styles.methodCol}>
                  <Text style={styles.methodLabel}>Collection Method</Text>
                  <TouchableOpacity style={[styles.methodPill, { backgroundColor: '#F3D7CE' }]} onPress={() => setCollectionPicker({ visible: true, addrId: addr.id })}>
                    <Ionicons name="cube" size={14} color="#8D5A4E" />
                    <Text style={[styles.methodPillText, { color: '#8D5A4E' }]}>{collectionMap[addr.collectionMethod]}</Text>
                    <Ionicons name="chevron-down" size={14} color="#8D5A4E" />

                  </TouchableOpacity>
                </View>
                <View style={styles.methodCol}>
                  <Text style={styles.methodLabel}>Delivery Method</Text>
                  <TouchableOpacity style={[styles.methodPill, { backgroundColor: '#CDEDEA' }]} onPress={() => setDeliveryPicker({ visible: true, addrId: addr.id })}>
                    <Ionicons name="person" size={14} color="#137D75" />
                    <Text style={[styles.methodPillText, { color: '#137D75' }]}>{deliveryMap[addr.deliveryMethod]}</Text>
                    <Ionicons name="chevron-down" size={14} color="#137D75" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Collection method picker */}
        <SelectListModal
          visible={collectionPicker.visible}
          title="Select Collection method"
          options={data.collectionMethods}
          selectedId={addresses.find(a => a.id === collectionPicker.addrId)?.collectionMethod}
          onClose={() => setCollectionPicker({ visible: false, addrId: null })}
          onSelect={(item) => updateCollection(collectionPicker.addrId, item.id)}
        />

        {/* Delivery method picker */}
        <SelectListModal
          visible={deliveryPicker.visible}
          title="Select Delivery method"
          options={data.deliveryMethods}
          selectedId={addresses.find(a => a.id === deliveryPicker.addrId)?.deliveryMethod}
          onClose={() => setDeliveryPicker({ visible: false, addrId: null })}
          onSelect={(item) => updateDelivery(deliveryPicker.addrId, item.id)}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  content: { padding: '4%', paddingBottom: '5%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: '3%' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 12, height: 44, gap: 8, marginBottom: '3%' },
  searchInput: { flex: 1, color: '#222' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: '3%', borderWidth: 1, borderColor: '#EEF1F4' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#08A6B0' },
  cardSub: { fontSize: 12, color: '#8A9299', marginTop: 2 },
  addNew: { backgroundColor: '#fff' },
  sectionHeader: { fontSize: 13, color: '#8A9299', marginVertical: '2%' },
  addressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: '3%', borderWidth: 1, borderColor: '#F0F2F4' },
  currentAddressCard: {
    backgroundColor: '#F0FDFF',
    borderColor: '#08A6B0',
    borderWidth: 2,
    shadowColor: '#08A6B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressLabel: { fontSize: 14, fontWeight: '700', color: '#222' },
  currentAddressLabel: { color: '#08A6B0' },
  youAreHere: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#E2F6E9', color: '#1D8E5B', borderRadius: 10, fontSize: 11, marginLeft: 6 },
  addressSub: { fontSize: 12, color: '#8A9299', marginTop: 4 },
  currentAddressSub: { color: '#666' },
  methodsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  methodCol: { flex: 1 },
  methodLabel: { fontSize: 12, color: '#111', marginBottom: 10, fontWeight: '700', marginTop: 10 },
  methodPill: { flexDirection: 'row', gap: 6, alignItems: 'center', height: 36, borderRadius: 10, paddingHorizontal: 10 },
  methodPillText: { fontSize: 12, fontWeight: '700' },
});


