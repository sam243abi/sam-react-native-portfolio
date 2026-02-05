import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import mapsConfig from '../data/mapsConfig.json';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MapAddressPicker({ onAddressChange, style }) {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    area: 'Select Location',
    city: 'Bangalore, Karnataka',
    street: '',
    neighbourhood: '',
  });

  // Get locations and config from JSON
  const { locations, mapTexts, mapTheme, mapConfig } = mapsConfig;

  // Initialize map and get current location
  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      // Set initial region from config
      const initialRegion = {
        latitude: mapConfig.initialRegion.latitude,
        longitude: mapConfig.initialRegion.longitude,
        latitudeDelta: mapConfig.initialRegion.latitudeDelta,
        longitudeDelta: mapConfig.initialRegion.longitudeDelta,
      };
      setMapRegion(initialRegion);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        // Use default location from config
        setSelectedCoordinate({
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        });
        return;
      }

      // Get current location
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const currentCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentCoords);
        setSelectedCoordinate(currentCoords);

        // Update map region to current location
        setMapRegion({
          ...initialRegion,
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
        });

        // Get address for current location
        reverseGeocode(currentCoords);
      } catch (locationError) {
        console.log('Error getting current location:', locationError);
        // Use default location
        setSelectedCoordinate({
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        });
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      // Fallback to default region
      const fallbackRegion = {
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setMapRegion(fallbackRegion);
      setSelectedCoordinate({
        latitude: fallbackRegion.latitude,
        longitude: fallbackRegion.longitude,
      });
    }
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (coordinate) => {
    try {
      setIsLoadingLocation(true);
      const result = await Location.reverseGeocodeAsync(coordinate);

      if (result && result.length > 0) {
        const address = result[0];
        const formattedAddress = {
          area: address.name || address.street || 'Selected Location',
          city: `${address.city || address.subregion || ''}, ${address.region || address.country || ''}`.replace(', ,', ',').trim(),
          street: `${address.streetNumber || ''} ${address.street || ''}`.trim(),
          neighbourhood: address.district || address.subregion || address.city || '',
          coordinates: coordinate
        };

        setCurrentAddress(formattedAddress);
        onAddressChange?.(formattedAddress);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback address
      const fallbackAddress = {
        area: 'Selected Location',
        city: 'Bangalore, Karnataka',
        street: 'Custom Location',
        neighbourhood: 'Bangalore',
        coordinates: coordinate
      };
      setCurrentAddress(fallbackAddress);
      onAddressChange?.(fallbackAddress);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle predefined location marker press
  const handleLocationPress = (location) => {
    console.log('🎯 Predefined location selected:', location);

    setSelectedLocationId(location.id);
    const coordinate = {
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
    };
    setSelectedCoordinate(coordinate);

    const formattedAddress = {
      area: location.area,
      city: location.city,
      street: location.fullAddress,
      neighbourhood: location.name,
      coordinates: coordinate,
      amenities: location.amenities,
    };

    setCurrentAddress(formattedAddress);
    onAddressChange?.(formattedAddress);
  };

  // Handle map press (user taps on map)
  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    console.log('🗺️ Map tapped at coordinate:', coordinate);

    setSelectedLocationId(null); // Deselect predefined locations
    setSelectedCoordinate(coordinate);

    // Get address for the selected coordinate
    reverseGeocode(coordinate);
  };

  // Handle current location button press
  const handleCurrentLocationPress = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please enable location permissions to use current location feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coordinate);
      setSelectedCoordinate(coordinate);
      setSelectedLocationId(null);

      // Update map region to current location
      setMapRegion({
        ...mapRegion,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      // Get address for current location
      reverseGeocode(coordinate);

    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Get active locations from JSON
  const interactiveLocations = locations.filter(loc => loc.isActive);

  if (!mapRegion) {
    return (
      <View style={[styles.container, style, styles.loadingContainer]}>
        <Ionicons name="map" size={48} color="#08A6B0" />
        <Text style={styles.loadingText}>Loading Google Maps...</Text>
        <Text style={styles.loadingSubText}>Make sure you have a valid API key</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Google Maps */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* Predefined Location Markers */}
        {interactiveLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.coordinates.latitude,
              longitude: location.coordinates.longitude,
            }}
            onPress={() => handleLocationPress(location)}
          >
            <View style={[
              styles.markerContainer,
              selectedLocationId === location.id && styles.markerContainerSelected
            ]}>
              <View style={[
                styles.markerDot,
                selectedLocationId === location.id && styles.markerDotSelected
              ]} />
              <View style={[
                styles.markerLabel,
                selectedLocationId === location.id && styles.markerLabelSelected
              ]}>
                <Text style={[
                  styles.markerText,
                  selectedLocationId === location.id && styles.markerTextSelected
                ]}>
                  {location.name}
                </Text>
              </View>
            </View>
          </Marker>
        ))}

        {/* Selected Location Marker */}
        {selectedCoordinate && (
          <Marker
            coordinate={selectedCoordinate}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.selectedMarker}>
              <Ionicons name="location" size={40} color="#FF6B35" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Location Info Bubble */}
 

      {/* Quick Select Buttons */}
      <View style={styles.quickSelectContainer}>
        {interactiveLocations.slice(0, 3).map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.quickSelectButton,
              selectedLocationId === location.id && styles.quickSelectButtonSelected
            ]}
            onPress={() => handleLocationPress(location)}
          >
            <Text style={[
              styles.quickSelectText,
              selectedLocationId === location.id && styles.quickSelectTextSelected
            ]}>
              {location.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocationPress}
        disabled={isLoadingLocation}
      >
        {isLoadingLocation ? (
          <Ionicons name="refresh" size={20} color="#007AFF" />
        ) : (
          <Ionicons name="locate" size={20} color="#007AFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 16,
  },
  loadingSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  // Marker styles
  markerContainer: {
    alignItems: 'center',
  },
  markerContainerSelected: {
    zIndex: 1000,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: mapsConfig.mapTheme.markerColor,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerDotSelected: {
    backgroundColor: mapsConfig.mapTheme.selectedMarkerColor,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  markerLabel: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerLabelSelected: {
    backgroundColor: mapsConfig.mapTheme.selectedMarkerColor,
  },
  markerText: {
    fontSize: 10,
    color: mapsConfig.mapTheme.textColor,
    fontWeight: '500',
  },
  markerTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // UI overlay styles
  locationBubble: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 300,
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '600',
    color: mapsConfig.mapTheme.textColor,
    textAlign: 'center',
  },
  bubbleSubText: {
    fontSize: 12,
    color: mapsConfig.mapTheme.lightTextColor,
    textAlign: 'center',
    marginTop: 4,
  },
  quickSelectContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 300,
  },
  quickSelectButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  quickSelectButtonSelected: {
    backgroundColor: mapsConfig.mapTheme.selectedMarkerColor,
  },
  quickSelectText: {
    fontSize: 12,
    color: mapsConfig.mapTheme.markerColor,
    fontWeight: '500',
  },
  quickSelectTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 300,
  },
});