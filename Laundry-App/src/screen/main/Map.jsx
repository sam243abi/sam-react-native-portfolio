import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import MapAddressPicker from '../../components/MapAddressPicker';
import mapsConfig from '../../data/mapsConfig.json';

// Get data from JSON with fallback
const data = {
  title: "Add address",
  searchPlaceholder: mapsConfig.mapTexts?.searchPlaceholder || "Search for a new area, locality",
  bubbleText: mapsConfig.mapTexts?.deliveryMessage || "Your order will be delivered here. Move pin to your exact location",
  deliverTitle: "Delivering your laundry to",
  cta: mapsConfig.mapTexts?.addMoreDetails || "ADD MORE ADDRESS DETAILS",
  completeTitle: "Enter complete address",
  saveAs: "Save address as",
  tags: [
    { id: "home", label: "Home", icon: "home" },
    { id: "office", label: "Office", icon: "business" },
    { id: "other", label: "Other", icon: "ellipse-outline" }
  ],
  fields: {
    complete: "Complete address",
    floor: "Floor (optional)",
    landmark: "Nearby landmark (optional)",
    receiverName: "Receiver's name",
    phonePrefix: "+91",
    receiverPhone: "Receiver's phone (optional)"
  },
  save: "SAVE ADDRESS"
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Map({ navigation, route }) {
  const initialAddr = route?.params?.prefill || {};
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState({
    area: 'Select Location',
    city: 'Bangalore, Karnataka',
    ...initialAddr,
  });
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);

  const handleAddressChange = (addr) => {
    console.log('🗺️ Address changed:', addr);
    setIsAddressUpdating(true);
    
    // Format the address to match the image design
    const formattedAddr = {
      area: addr.area || addr.neighbourhood || 'Select Location',
      city: addr.city || 'Bangalore, Karnataka',
      street: addr.street || '',
      neighbourhood: addr.neighbourhood || addr.area,
      coordinates: addr.coordinates || null,
      amenities: addr.amenities || [],
      ...addr
    };
    
    console.log('📍 Formatted address:', formattedAddr);
    
    // Simulate real-time update with slight delay for smooth UX
    setTimeout(() => {
      setPicked(formattedAddr);
      setIsAddressUpdating(false);
    }, 200);
  };

  const openComplete = () => {
    // Navigate to EnterCompleteAddress with the selected location data
    navigation.navigate('EnterCompleteAddress', {
      selectedLocation: {
        address: `${picked.area}, ${picked.city}`,
        area: picked.area,
        city: picked.city,
        street: picked.street,
        neighbourhood: picked.neighbourhood,
        coordinates: picked.coordinates,
        amenities: picked.amenities
      }
    });
  };

  const saveAddress = (full) => {
    console.log('🗺️ Map screen: Saving address and navigating to AddressBook');
    // Navigate back to AddressBook with the new address
    navigation.navigate('AddressBook', { newAddress: full });
  };

  return (
    <ScreenWrapper navigation={navigation} route={route}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapAddressPicker onAddressChange={handleAddressChange} style={styles.map} />
          
          {/* Search Bar Overlay */}
          <View style={styles.searchOverlay}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9AA0A6" />
              <TextInput 
                value={search} 
                onChangeText={setSearch} 
                style={styles.searchInput} 
                placeholder={data.searchPlaceholder} 
                placeholderTextColor="#9AA0A6" 
              />
            </View>
            
            {/* Search Suggestions */}
            {search.length > 0 && (
              <View style={styles.searchSuggestions}>
                {mapsConfig.searchSuggestions
                  .filter(suggestion => 
                    suggestion.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSearch('');
                        // Simulate selecting this area
                        const mockAddress = {
                          area: suggestion.split(',')[0],
                          city: suggestion,
                          street: `Selected from search: ${suggestion}`,
                          neighbourhood: suggestion.split(',')[0]
                        };
                        handleAddressChange(mockAddress);
                      }}
                    >
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )}
          </View>
        </View>

        {/* Bottom Address Panel */}
        <View style={styles.bottomPanel}>
          <Text style={styles.deliverTitle}>{data.deliverTitle}</Text>
          <View style={[styles.addressCard, isAddressUpdating && styles.addressCardUpdating]}>
            <View style={styles.addressIcon}>
              <Ionicons 
                name="locate" 
                size={20} 
                color={isAddressUpdating ? "#FF6B35" : "#08A6B0"} 
              />
            </View>
            <View style={styles.addressText}>
              <Text style={styles.addressMain}>
                {picked.area || 'Select Location'}
              </Text>
              <Text style={styles.addressSub}>
                {picked.city || 'Bangalore, Karnataka'}
              </Text>
              {picked.street && picked.street !== picked.area && (
                <Text style={styles.addressDetail}>
                  {picked.street}
                </Text>
              )}
              {picked.amenities && picked.amenities.length > 0 && (
                <Text style={styles.amenitiesText}>
                  🏢 {picked.amenities.join(' • ')}
                </Text>
              )}
              {isAddressUpdating && (
                <Text style={styles.updatingText}>📍 Updating location...</Text>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.addDetailsButton, isAddressUpdating && styles.addDetailsButtonDisabled]} 
            onPress={openComplete}
            disabled={isAddressUpdating}
          >
            <Text style={styles.addDetailsText}>{data.cta}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  
  // Search bar styles
  searchOverlay: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  
  // Map container styles
  mapContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: 0,
  },
  map: {
    width: screenWidth,
    height: screenHeight * 0.7, // Increased to accommodate search bar inside
  },
  
  // Bottom panel styles
  bottomPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  deliverTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 13,
    marginBottom: 6,
  },
  addressIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
  },
  addressMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  addressSub: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  addressDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontStyle: 'italic',
  },
  addressCardUpdating: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  updatingText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '500',
    marginTop: 4,
  },
  addDetailsButtonDisabled: {
    opacity: 0.6,
  },
  amenitiesText: {
    fontSize: 11,
    color: '#08A6B0',
    marginTop: 2,
    fontWeight: '500',
  },
  
  // Search suggestions styles
  searchSuggestions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  addDetailsButton: {
    backgroundColor: '#08A6B0',
    borderRadius: 25,
    paddingVertical:12,
    alignItems: 'center',
    shadowColor: '#08A6B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});