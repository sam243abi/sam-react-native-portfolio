import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SelectListModal from '../../components/SelectListModal';
import addressData from '../../data/addressBook.json';

export default function EnterCompleteAddress({ navigation, route }) {
  const { selectedLocation, editMode, addressData: editAddressData } = route.params || {};

  // Initialize state with edit data if in edit mode
  const [addressType, setAddressType] = useState(
    editMode ? editAddressData?.addressType || 'home' : 'home'
  );
  const [completeAddress, setCompleteAddress] = useState(
    editMode ? editAddressData?.completeAddress || '' : selectedLocation?.address || ''
  );
  const [floor, setFloor] = useState(
    editMode ? editAddressData?.floor || '' : ''
  );
  const [landmark, setLandmark] = useState(
    editMode ? editAddressData?.landmark || '' : ''
  );
  const [receiverName, setReceiverName] = useState(
    editMode ? editAddressData?.receiverName || '' : ''
  );
  const [receiverPhone, setReceiverPhone] = useState(
    editMode ? editAddressData?.receiverPhone || '' : ''
  );
  const [collectionMethod, setCollectionMethod] = useState(
    editMode ? editAddressData?.collectionMethod || 'reception' : 'reception'
  );
  const [deliveryMethod, setDeliveryMethod] = useState(
    editMode ? editAddressData?.deliveryMethod || 'in_person' : 'in_person'
  );
  const [customLabel, setCustomLabel] = useState(
    editMode ? editAddressData?.customLabel || '' : ''
  );
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);

  const addressTypes = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'office', label: 'Office', icon: 'business' },
    { id: 'other', label: 'Other', icon: 'location-on' }
  ];

  const getCollectionMethodLabel = () => {
    const method = addressData.collectionMethods.find(m => m.id === collectionMethod);
    return method ? method.label : 'Reception';
  };

  const getDeliveryMethodLabel = () => {
    const method = addressData.deliveryMethods.find(m => m.id === deliveryMethod);
    return method ? method.label : 'In Person';
  };

  const handleSaveAddress = async () => {
    console.log('🔄 Save Address button clicked');
    console.log('📝 Form validation - Address:', completeAddress.trim(), 'Name:', receiverName.trim());

    if (!completeAddress.trim() || !receiverName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Complete address and Receiver name)');
      return;
    }

    // Validate custom label for "Other" address type
    if (addressType === 'other' && !customLabel.trim()) {
      Alert.alert('Error', 'Please enter a custom label for this address');
      return;
    }

    const addressObject = {
      id: editMode ? editAddressData.id : Date.now().toString(),
      label: addressType === 'other' ? (customLabel || 'Other') : (addressTypes.find(t => t.id === addressType)?.label || 'Home'),
      isCurrent: editMode ? editAddressData.isCurrent : false, // Preserve current status when editing
      address: `${completeAddress}${floor ? `, Floor: ${floor}` : ''}${landmark ? `, Near: ${landmark}` : ''}`,
      phone: receiverPhone ? `+91 ${receiverPhone}` : '+91 0000000000',
      collectionMethod: collectionMethod,
      deliveryMethod: deliveryMethod,
      receiverName: receiverName,
      customLabel: addressType === 'other' ? customLabel : undefined
    };

    try {
      // Import storage functions
      const { getAddresses, saveAddresses } = require('../../utils/storage');

      // Get current addresses
      const currentAddresses = await getAddresses() || [];
      console.log('� Currvent addresses count:', currentAddresses.length);

      let updatedAddresses;

      if (editMode) {
        console.log('✏️ Updating existing address:', addressObject);

        // Update existing address in the array
        updatedAddresses = currentAddresses.map(addr =>
          addr.id === addressObject.id ? addressObject : addr
        );
        console.log('📍 Address updated in array');
      } else {
        console.log('💾 Saving new address:', addressObject);

        // Add new address to the array
        updatedAddresses = [...currentAddresses, addressObject];
        console.log('📍 New address added to array');
      }

      console.log('📍 Updated addresses count:', updatedAddresses.length);

      // Save to storage
      await saveAddresses(updatedAddresses);
      console.log('✅ Address saved directly to storage');

      // Show success message
      Alert.alert(
        '✅ Success',
        editMode ? 'Address updated successfully!' : 'Address saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to AddressBook
              navigation.navigate('AddressBook');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editMode ? 'Edit address' : 'Enter complete address'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Save address as */}
        <Text style={styles.sectionTitle}>Save address as</Text>
        <View style={styles.addressTypeRow}>
          {addressTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.addressTypeButton,
                addressType === type.id && styles.addressTypeButtonActive
              ]}
              onPress={() => setAddressType(type.id)}
            >
              <MaterialIcons
                name={type.icon}
                size={18}
                color={addressType === type.id ? '#FF6B35' : '#999'}
              />
              <Text style={[
                styles.addressTypeText,
                addressType === type.id && styles.addressTypeTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Address Fields */}
        {/* Custom label input for "Other" address type */}
        {addressType === 'other' && (
          <TextInput
            style={styles.input}
            placeholder="Eg: Relatives house"
            placeholderTextColor="#000"
            value={customLabel}
            onChangeText={setCustomLabel}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Complete address"
          placeholderTextColor="#000"
          value={completeAddress}
          onChangeText={setCompleteAddress}
          multiline
          numberOfLines={2}
        />

        <TextInput
          style={styles.input}
          placeholder="Floor (optional)"
          placeholderTextColor="#000"
          value={floor}
          onChangeText={setFloor}
        />

        <TextInput
          style={styles.input}
          placeholder="Nearby landmark (optional)"
          placeholderTextColor="#000"
          value={landmark}
          onChangeText={setLandmark}
        />

        {/* Receiver Details */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Add Receiver's Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Receiver's name"
          placeholderTextColor="#000"
          value={receiverName}
          onChangeText={setReceiverName}
        />

        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Receiver's phone (optional)"
            placeholderTextColor="#000"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Collection and Delivery Methods */}
        <View style={styles.methodsRow}>
          <View style={styles.methodColumn}>
            <Text style={styles.methodTitle}>Collection Method</Text>
            <TouchableOpacity
              style={styles.methodButton}
              onPress={() => setShowCollectionPicker(true)}
            >
              <MaterialIcons name="business" size={18} color="#8D5A4E" />
              <Text style={styles.methodButtonText}>{getCollectionMethodLabel()}</Text>
              <Ionicons name="chevron-down" size={16} color="#8D5A4E" />
            </TouchableOpacity>
          </View>

          <View style={styles.methodColumn}>
            <Text style={styles.methodTitle}>Delivery Method</Text>
            <TouchableOpacity
              style={styles.methodButtonDelivery}
              onPress={() => setShowDeliveryPicker(true)}
            >
              <MaterialIcons name="person" size={18} color="#137D75" />
              <Text style={styles.methodButtonTextDelivery}>{getDeliveryMethodLabel()}</Text>
              <Ionicons name="chevron-down" size={16} color="#137D75" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>
            {editMode ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Collection Method Picker */}
      <SelectListModal
        visible={showCollectionPicker}
        title="Select Collection method"
        options={addressData.collectionMethods}
        selectedId={collectionMethod}
        onClose={() => setShowCollectionPicker(false)}
        onSelect={(item) => {
          setCollectionMethod(item.id);
          setShowCollectionPicker(false);
        }}
      />

      {/* Delivery Method Picker */}
      <SelectListModal
        visible={showDeliveryPicker}
        title="Select Delivery method"
        options={addressData.deliveryMethods}
        selectedId={deliveryMethod}
        onClose={() => setShowDeliveryPicker(false)}
        onSelect={(item) => {
          setDeliveryMethod(item.id);
          setShowDeliveryPicker(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: '5%',
    paddingBottom: '5.5%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: '1%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: '6%',
  },
  scrollContent: {
    paddingTop: '5%',
    paddingBottom: '10%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: '5%',
    marginTop: 0,
  },
  addressTypeRow: {
    flexDirection: 'row',
    marginBottom: '6%',
    gap: 8,
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  addressTypeButtonActive: {
    backgroundColor: '#FFE5D9',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  addressTypeText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  addressTypeTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: '3%',
    color: '#333333',
    textAlignVertical: 'top',
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: '3%',
    gap: 0,
  },
  countryCode: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: '4%',
    paddingVertical: '4%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRightWidth: 0,
    justifyContent: 'center',
    minWidth: '18%',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 0,
    color: '#333333',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: '8%',
    marginTop: '4%',
  },
  methodColumn: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: '2%',
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5D9',
    paddingHorizontal: '7%',
    paddingVertical: '7%',
    borderRadius: 10,
    gap: 6,
  },
  methodButtonDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5D9',
    paddingHorizontal: '7%',
    paddingVertical: '7%',
    borderRadius: 10,
    gap: 6,
  },
  methodButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#8D5A4E',
  },
  methodButtonTextDelivery: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#137D75',
  },
  saveButton: {
    backgroundColor: '#00B2AC',
    paddingVertical: '4%',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: '6%',
    marginHorizontal: 0,
    shadowColor: '#00B2AC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',

    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});