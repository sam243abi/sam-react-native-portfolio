import React, { useState, useMemo, useEffect, useRef } from 'react';
import {View,Text,TouchableOpacity,ScrollView,SafeAreaView,StyleSheet,Image,Modal,TextInput,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { COLORS } from '../../styles/globalStyles';
import servicesData from '../../data/services.json';
import appConfigData from '../../data/appConfig.json';
import dashboardData from '../../data/dashboard.json';
import washIronServiceData from '../../data/washIronService.json';
import washFoldServiceData from '../../data/washFoldService.json';
import ironingServiceData from '../../data/ironingService.json';
import dryCleanServiceData from '../../data/dryCleanService.json';
import dryCleanWashFoldServiceData from '../../data/dryCleanWashFoldService.json';
import starchingServiceData from '../../data/starchingService.json';
import stainRemovalServiceData from '../../data/stainRemovalService.json';
import shoeCleaningServiceData from '../../data/shoeCleaningService.json';
import HelmetCleaningServiceData from '../../data/HelmetCleaning.json';
import duvetsServiceData from '../../data/duvetsService.json';
import PriceListOverlay from '../../components/PriceListOverlay';
import WashIronOverlay from '../../components/WashIronOverlay';
import WashFoldOverlay from '../../components/WashFoldOverlay';
import DryCleanWashFoldOverlay from '../../components/DryCleanWashFoldOverlay';
import SimpleServiceOverlay from '../../components/SimpleServiceOverlay';
import CartOverlay from '../../components/CartOverlay';
import cartData from '../../data/cart.json';
import addressData from '../../data/addressBook.json';
import BottomNavigation from '../../components/BottomNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { loadAddressesStart, loadAddressesSuccess } from '../../redux/slices/addressSlice';
import { getAddresses, saveAddresses } from '../../utils/storage';

const IMAGE_ASSETS = {
  'Profile-Image.png': require('../../assets/images/Profile-Image.png'),
  'DryCleaning.png': require('../../assets/images/DryCleaning.png'),
  'WashFold.png': require('../../assets/images/WashFold.png'),
  'ironing.png': require('../../assets/images/ironing.png'),
  'WashIron.png': require('../../assets/images/WashIron.png'),
  'Duvets.png': require('../../assets/images/Duvets.png'),
  'StainRemoval.png': require('../../assets/images/StainRemoval.png'),
  'washIcon.png': require('../../assets/images/washIcon.png'),
  '99mins.png': require('../../assets/images/99mins.png'),
  'Illustration.png': require('../../assets/images/Illustration.png'),
  'Eco.png': require('../../assets/images/Eco.png'),
  'laundry-placeholder.png': require('../../assets/images/laundry-placeholder.png'),
};

const resolveImageSource = (value) => {
  if (!value) return null;
  if (typeof value === 'string' && /^https?:\/\//.test(value)) {
    return { uri: value };
  }
  const fileName = typeof value === 'string' ? value.split('/').pop() : value;
  return IMAGE_ASSETS[fileName] || null;
};

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const [address, setAddress] = useState('Select Location');
  const [showWashIronOverlay, setShowWashIronOverlay] = useState(false);
  const [showWashFoldOverlay, setShowWashFoldOverlay] = useState(false);
  const [showIroningOverlay, setShowIroningOverlay] = useState(false);
  const [showDryCleanOverlay, setShowDryCleanOverlay] = useState(false);
  const [showDryCleanWashFoldOverlay, setShowDryCleanWashFoldOverlay] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingWashIronItem, setEditingWashIronItem] = useState(null);
  const [editingIroningItem, setEditingIroningItem] = useState(null);
  const [editingDryCleanItem, setEditingDryCleanItem] = useState(null);
  const [editingDryCleanWashFoldItem, setEditingDryCleanWashFoldItem] = useState(null);
  const [showStarchingOverlay, setShowStarchingOverlay] = useState(false);
  const [showStainRemovalOverlay, setShowStainRemovalOverlay] = useState(false);
  const [showShoeCleaningOverlay, setShowShoeCleaningOverlay] = useState(false);
  const [showHelmetCleaningOverlay, setShowHelmetCleaningOverlay] = useState(false);
  const [showDuvetsOverlay, setShowDuvetsOverlay] = useState(false);
  const [editingStarchingItem, setEditingStarchingItem] = useState(null);
  const [editingStainRemovalItem, setEditingStainRemovalItem] = useState(null);
  const [editingShoeCleaningItem, setEditingShoeCleaningItem] = useState(null);
  const [editingHelmetCleaningItem, setEditingHelmetCleaningItem] = useState(null);
  const [editingDuvetsItem, setEditingDuvetsItem] = useState(null);
  const hasLoadedAddresses = useRef(false);

  useEffect(() => {
    if (!hasLoadedAddresses.current) {
      const loadStoredAddresses = async () => {
        dispatch(loadAddressesStart());
        try {
          const storedAddresses = await getAddresses();
          if (storedAddresses && storedAddresses.length > 0) {
            dispatch(loadAddressesSuccess(storedAddresses));
          } else {
            dispatch(loadAddressesSuccess(addressData.addresses));
            await saveAddresses(addressData.addresses);
          }
        } catch (error) {
          dispatch(loadAddressesSuccess(addressData.addresses));
        }
      };
      loadStoredAddresses();
      hasLoadedAddresses.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const currentAddress = addresses.find(addr => addr.isCurrent);
      setAddress(currentAddress ? currentAddress.label : addresses[0].label || 'Home');
    }
  }, [addresses]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return appConfigData.greetings.morning;
    if (hour < 18) return appConfigData.greetings.afternoon;
    return appConfigData.greetings.evening;
  }, []);

  const handleWashIronPress = () => setShowWashIronOverlay(true);
  const handleWashFoldPress = () => setShowWashFoldOverlay(true);
  const handleIroningPress = () => setShowIroningOverlay(true);
  const handleDryCleanPress = () => setShowDryCleanOverlay(true);
  const handleDryCleanWashFoldPress = () => setShowDryCleanWashFoldOverlay(true);
  const handleStarchingPress = () => setShowStarchingOverlay(true);
  const handleStainRemovalPress = () => setShowStainRemovalOverlay(true);
  const handleShoeCleaningPress = () => setShowShoeCleaningOverlay(true);
  const handleHelmetCleaningPress = () => setShowHelmetCleaningOverlay(true);
  const handleDuvetsPress = () => setShowDuvetsOverlay(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRowInPage}>
          <View style={styles.avatarWithText}>
            {resolveImageSource(dashboardData.header.profileImageUri) ? (
              <Image source={resolveImageSource(dashboardData.header.profileImageUri)} style={styles.profileAvatar} />
            ) : (
              <View style={styles.profileAvatarPlaceholder} />
            )}
            <View>
              <Text style={styles.topGreeting}>{greeting}</Text>
              <Text style={styles.topUsername}>{appConfigData.user.defaultName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.locationPill} activeOpacity={0.8} onPress={() => navigation.navigate('AddressBook')}>
            <Ionicons name={dashboardData.header.locationIcon} size={24} color={COLORS.text.primary} />
            <Text style={styles.locationText}>{address}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { backgroundColor: dashboardData.hero.backgroundColor }]}>
          <View style={[styles.heroIconWrap, { backgroundColor: dashboardData.hero.iconBackgroundColor }]}>
            {resolveImageSource(dashboardData.hero.imageUri) ? (
              <Image source={resolveImageSource(dashboardData.hero.imageUri)} style={styles.heroIconImage} />
            ) : (
              <Ionicons name={dashboardData.hero.icon} size={35} color={COLORS.white} />
            )}
          </View>
          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle}>{dashboardData.hero.title}</Text>
            <Text style={styles.heroSubtitle}>{dashboardData.hero.subtitle}</Text>
          </View>
        </View>

        {/* Promos */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Promo</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promosScrollContainer} style={styles.promosScroll}>
          {dashboardData.promos.map((p) => (
            <View key={p.id} style={styles.promoCardWrapper}>
              <View style={[styles.promoCard, { backgroundColor: p.colors[0] }]}>
                <View style={styles.promoBadge}>
                  <Ionicons name="flash" size={10} color="#fff" style={styles.flashIcon} />
                  <Text style={styles.promoBadgeText}>{p.badge}</Text>
                </View>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSubtitle}>{p.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <Text style={styles.servicesTitle}>{dashboardData.servicesGrid.title}</Text>
        <View style={styles.servicesGrid}>
          {dashboardData.servicesGrid.items.map((item, idx) => {
            const svc = servicesData.services.find((s) => s.id === item.serviceId) || {};
            const serviceHandlers = {
              '99-mins-wash': handleDryCleanWashFoldPress,
              'wash-iron': handleWashIronPress,
              'wash': handleWashFoldPress,
              'iron': handleIroningPress,
              'dry-clean': handleDryCleanPress,
              'duvets': handleDuvetsPress,
              'starching': handleStarchingPress,
              'stain-removal': handleStainRemovalPress,
              'shoe-cleaning': handleShoeCleaningPress,
              'helmet-cleaning': handleHelmetCleaningPress,
            };
            const handlePress = serviceHandlers[item.serviceId] || (() => navigation.navigate(svc.route || 'Service'));
            return (
              <TouchableOpacity key={idx} style={styles.serviceTile} activeOpacity={0.85} onPress={handlePress}>
                <Image source={resolveImageSource(item.images[0])} style={item.imageStyle === 'contained' ? styles.serviceTile99MinsImage : styles.serviceTileImageReal} />
                <Text style={styles.serviceTileLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBannerCard}>
            {/* Info banner content preserved from Part 2 */}
            <View style={styles.infoBannerLeft}>
                <Text style={styles.infoBannerTitle}>Not sure how much you have?</Text>
                <Text style={styles.infoBannerSubtitle}>One load of 6kg is about:</Text>
            </View>
        </View>
      </ScrollView>

      {/* Floating Cart Banner */}
      {cartItems.length > 0 && (
        <View style={styles.viewCartContainer}>
          <TouchableOpacity style={styles.viewCartPill} activeOpacity={0.9} onPress={() => setShowCartOverlay(true)}>
            <View style={styles.viewCartContent}>
              <Text style={styles.viewCartText}>{dashboardData.cartBanner.buttonText}</Text>
              <Text style={styles.viewCartCount}>{cartItems.length} items</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      <BottomNavigation navigation={navigation} currentRoute="Dashboard" />

      {/* SERVICE OVERLAYS WITH PERSISTENCE LOGIC */}

      <WashIronOverlay
        visible={showWashIronOverlay}
        onClose={() => { setShowWashIronOverlay(false); setEditingWashIronItem(null); }}
        data={washIronServiceData.serviceDetails}
        editMode={!!editingWashIronItem || cartItems.some(ci => ci.id === 'wash-iron')}
        editData={editingWashIronItem || cartItems.find(ci => ci.id === 'wash-iron')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'wash-iron');
            return [...others, { id: 'wash-iron', ...item }];
          }); setShowWashIronOverlay(false);
        }}
        onSchedule={() => { setShowWashIronOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowWashIronOverlay(false);
          setEditingWashIronItem(null);
        }}
      />

      <WashFoldOverlay
        visible={showWashFoldOverlay}
        onClose={() => { setShowWashFoldOverlay(false); setEditingItem(null); }}
        data={washFoldServiceData.serviceDetails}
        editMode={!!editingItem || cartItems.some(ci => ci.id === 'wash-fold')}
        editData={editingItem || cartItems.find(ci => ci.id === 'wash-fold')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'wash-fold');
            return [...others, { id: 'wash-fold', ...item }];
          }); setShowWashFoldOverlay(false);
        }}
        onSchedule={() => { setShowWashFoldOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowWashFoldOverlay(false);
          setEditingItem(null);
        }}
      />

      <PriceListOverlay
        visible={showIroningOverlay}
        onClose={() => { setShowIroningOverlay(false); setEditingIroningItem(null); }}
        data={ironingServiceData.serviceDetails}
        editMode={!!editingIroningItem || cartItems.some(ci => ci.id === 'iron')}
        editData={editingIroningItem || cartItems.find(ci => ci.id === 'iron')}
        onAddToCart={({ items, total }) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'iron');
            return [...others, { id: 'iron', service: ironingServiceData.serviceDetails.title, estimatedPrice: total, items, catalog: ironingServiceData.serviceDetails.items }];
          }); setShowIroningOverlay(false);
        }}
        onSchedule={() => { setShowIroningOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowIroningOverlay(false);
          setEditingIroningItem(null);
        }}
      />

      <PriceListOverlay
        visible={showDryCleanOverlay}
        onClose={() => { setShowDryCleanOverlay(false); setEditingDryCleanItem(null); }}
        data={dryCleanServiceData.serviceDetails}
        editMode={!!editingDryCleanItem || cartItems.some(ci => ci.id === 'dry-clean')}
        editData={editingDryCleanItem || cartItems.find(ci => ci.id === 'dry-clean')}
        onAddToCart={({ items, total }) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'dry-clean');
            return [...others, { id: 'dry-clean', service: dryCleanServiceData.serviceDetails.title, estimatedPrice: total, items, catalog: dryCleanServiceData.serviceDetails.items }];
          }); setShowDryCleanOverlay(false);
        }}
        onSchedule={() => { setShowDryCleanOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowDryCleanOverlay(false);
          setEditingDryCleanItem(null);
        }}
      />

      <DryCleanWashFoldOverlay
        visible={showDryCleanWashFoldOverlay}
        onClose={() => { setShowDryCleanWashFoldOverlay(false); setEditingDryCleanWashFoldItem(null); }}
        data={dryCleanWashFoldServiceData.serviceDetails}
        editMode={!!editingDryCleanWashFoldItem || cartItems.some(ci => ci.id === '99-mins-wash')}
        editData={editingDryCleanWashFoldItem || cartItems.find(ci => ci.id === '99-mins-wash')}
        onAddToCart={({ items, total }) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== '99-mins-wash');
            return [...others, { id: '99-mins-wash', service: dryCleanWashFoldServiceData.serviceDetails.title, estimatedPrice: total, items, catalog: dryCleanWashFoldServiceData.serviceDetails.sections }];
          }); setShowDryCleanWashFoldOverlay(false);
        }}
        onSchedule={() => { setShowDryCleanWashFoldOverlay(false); navigation.navigate('Schedule', { serviceType: '99-mins-wash' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowDryCleanWashFoldOverlay(false);
          setEditingDryCleanWashFoldItem(null);
        }}
      />

      <SimpleServiceOverlay
        visible={showStarchingOverlay}
        onClose={() => { setShowStarchingOverlay(false); setEditingStarchingItem(null); }}
        data={starchingServiceData.serviceDetails}
        editMode={!!editingStarchingItem || cartItems.some(ci => ci.id === 'starching')}
        editData={editingStarchingItem || cartItems.find(ci => ci.id === 'starching')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'starching');
            return [...others, { id: 'starching', ...item }];
          }); setShowStarchingOverlay(false);
        }}
        onSchedule={() => { setShowStarchingOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowStarchingOverlay(false);
          setEditingStarchingItem(null);
        }}
      />

      <SimpleServiceOverlay
        visible={showStainRemovalOverlay}
        onClose={() => { setShowStainRemovalOverlay(false); setEditingStainRemovalItem(null); }}
        data={stainRemovalServiceData.serviceDetails}
        editMode={!!editingStainRemovalItem || cartItems.some(ci => ci.id === 'stain-removal')}
        editData={editingStainRemovalItem || cartItems.find(ci => ci.id === 'stain-removal')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'stain-removal');
            return [...others, { id: 'stain-removal', ...item }];
          }); setShowStainRemovalOverlay(false);
        }}
        onSchedule={() => { setShowStainRemovalOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowStainRemovalOverlay(false);
          setEditingStainRemovalItem(null);
        }}
      />

      <SimpleServiceOverlay
        visible={showShoeCleaningOverlay}
        onClose={() => { setShowShoeCleaningOverlay(false); setEditingShoeCleaningItem(null); }}
        data={shoeCleaningServiceData.serviceDetails}
        editMode={!!editingShoeCleaningItem || cartItems.some(ci => ci.id === 'shoe-cleaning')}
        editData={editingShoeCleaningItem || cartItems.find(ci => ci.id === 'shoe-cleaning')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'shoe-cleaning');
            return [...others, { id: 'shoe-cleaning', ...item }];
          }); setShowShoeCleaningOverlay(false);
        }}
        onSchedule={() => { setShowShoeCleaningOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowShoeCleaningOverlay(false);
          setEditingShoeCleaningItem(null);
        }}
      />

      <SimpleServiceOverlay
        visible={showHelmetCleaningOverlay}
        onClose={() => { setShowHelmetCleaningOverlay(false); setEditingHelmetCleaningItem(null); }}
        data={HelmetCleaningServiceData.serviceDetails}
        editMode={!!editingHelmetCleaningItem || cartItems.some(ci => ci.id === 'Helmet-cleaning')}
        editData={editingHelmetCleaningItem || cartItems.find(ci => ci.id === 'Helmet-cleaning')}
        onAddToCart={(item) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'Helmet-cleaning');
            return [...others, { id: 'Helmet-cleaning', ...item }];
          }); setShowHelmetCleaningOverlay(false);
        }}
        onSchedule={() => { setShowHelmetCleaningOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowHelmetCleaningOverlay(false);
          setEditingHelmetCleaningItem(null);
        }}
      />

      <PriceListOverlay
        visible={showDuvetsOverlay}
        onClose={() => { setShowDuvetsOverlay(false); setEditingDuvetsItem(null); }}
        data={duvetsServiceData.serviceDetails}
        editMode={!!editingDuvetsItem || cartItems.some(ci => ci.id === 'duvets')}
        editData={editingDuvetsItem || cartItems.find(ci => ci.id === 'duvets')}
        onAddToCart={({ items, total }) => {
          setCartItems(prev => {
            const others = prev.filter(p => p.id !== 'duvets');
            return [...others, { id: 'duvets', service: duvetsServiceData.serviceDetails.title, estimatedPrice: total, items, catalog: duvetsServiceData.serviceDetails.items }];
          }); setShowDuvetsOverlay(false);
        }}
        onSchedule={() => { setShowDuvetsOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
        onSaveChanges={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
          setShowDuvetsOverlay(false);
          setEditingDuvetsItem(null);
        }}
      />

      <CartOverlay
        visible={showCartOverlay}
        onClose={() => setShowCartOverlay(false)}
        data={{ ...cartData, items: cartItems }}
        onEditItem={(item) => {
          if (item.id === 'wash-fold') { setEditingItem(item); setShowCartOverlay(false); setShowWashFoldOverlay(true); }
          else if (item.id === 'wash-iron') { setEditingWashIronItem(item); setShowCartOverlay(false); setShowWashIronOverlay(true); }
          else if (item.id === 'iron') { setEditingIroningItem(item); setShowCartOverlay(false); setShowIroningOverlay(true); }
          else if (item.id === 'dry-clean') { setEditingDryCleanItem(item); setShowCartOverlay(false); setShowDryCleanOverlay(true); }
          else if (item.id === '99-mins-wash') { setEditingDryCleanWashFoldItem(item); setShowCartOverlay(false); setShowDryCleanWashFoldOverlay(true); }
          else if (item.id === 'starching') { setEditingStarchingItem(item); setShowCartOverlay(false); setShowStarchingOverlay(true); }
          else if (item.id === 'stain-removal') { setEditingStainRemovalItem(item); setShowCartOverlay(false); setShowStainRemovalOverlay(true); }
          else if (item.id === 'shoe-cleaning') { setEditingShoeCleaningItem(item); setShowCartOverlay(false); setShowShoeCleaningOverlay(true); }
          else if (item.id === 'Helmet-cleaning') { setEditingHelmetCleaningItem(item); setShowCartOverlay(false); setShowHelmetCleaningOverlay(true); }
          else if (item.id === 'duvets') { setEditingDuvetsItem(item); setShowCartOverlay(false); setShowDuvetsOverlay(true); }
          else { setCartItems(prev => prev.map(ci => ci.id === item.id ? item : ci)); }
        }}
        onUpdateQuantity={(updatedItem) => {
          setCartItems(prev => prev.map(ci => ci.id === updatedItem.id ? updatedItem : ci));
        }}
        onRemoveItem={(item) => setCartItems(prev => prev.filter(ci => ci.id !== item.id))}
        onApplyCoupon={(code) => console.log('Apply coupon', code)}
        onSchedule={(payload) => { setShowCartOverlay(false); navigation.navigate('Schedule', { serviceType: 'regular' }); }}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    ...globalStyles.containerGray,
  },
  avatarWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topGreeting: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  topUsername: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '400',
  },
  scrollContent: {
    paddingBottom: 90,
    paddingTop: '2%',
    top:20
  },
  topRowInPage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '4%',
    marginTop: '3%',
  },
  heroCard: {
    backgroundColor: '#08A6B0',
    marginHorizontal: '4%',
    marginTop: '5%',
    borderRadius: 16,
    paddingVertical: '4%',
    paddingHorizontal: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  heroIconWrap: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
  },
  heroIconImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  heroTexts: {
    flex: 1,
    paddingRight: '2%',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginTop: '2%',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    marginHorizontal: '4%',
    marginTop: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginTop: '2%',
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    marginTop: '-3%',
  },
  promosScroll: {
    marginTop: '2.5%',
  },
  promosScrollContainer: {
    paddingHorizontal: '4%',
    gap: 10,
  },
  promoCardWrapper: {
    width: 265,
  },
  promoCard: {
    borderRadius: 12,
    padding: 14,
    height: 110,
    width: 260,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
    width: 90,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flashIcon: {
    marginRight: 0,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
  },
  servicesTitle: {
    marginHorizontal: '4%',
    marginTop: '4.5%',
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: '1.2%',
  },
  servicesGrid: {
    marginHorizontal: '4%',
    marginTop: '2.5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceTile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTileImage: {
    width: '30%',
    height: '30%',
    borderRadius: 45,
    backgroundColor: '#E9F3FF',
    marginBottom: 10,

  },
  serviceTileImageReal: {
    width: 60,
    height: 60,
    borderRadius: 40,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  serviceTileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  serviceTile99MinsImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  serviceTileLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  fullWidthServiceTile: {
    width: '93%',
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthServiceTileImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  fullWidthServiceTileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    marginRight: 20,
  },
  fullWidthServiceTileLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    right: -30,
  },
  infoBannerCard: {
    backgroundColor: '#FFDFD0',
    marginHorizontal: '4%',
    marginTop: '15%',
    marginBottom: '5%',
    borderRadius: 20,
    paddingTop: '5%',
    paddingBottom: '6%',
    paddingHorizontal: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 220,
    position: 'relative',
  },
  infoBannerLeft: {
    paddingRight: '30%',
  },
  infoBannerRight: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    width: '25%',
    height: '90%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  infoBannerClothesImage: {
    width: '100%',
    height: '100%',
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: '2%',
    lineHeight: 24,
    flexShrink: 0,
  },
  infoBannerSubtitle: {
    fontSize: 13,
    color: '#999999',
    marginBottom: '4%',
    lineHeight: 18,
  },
  infoBannerItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
    flexWrap: 'nowrap',
  },
  infoBannerPill: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4DBABA',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  infoBannerPillText: {
    fontSize: 13,
    color: '#4DBABA',
    fontWeight: '600',
  },
  infoBannerPlus: {
    fontSize: 16,
    color: '#4DBABA',
    fontWeight: '700',
    marginRight: 8,
  },
  infoBannerExtraTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
    marginTop: '4%',
    marginBottom: '2%',
    lineHeight: 20,
  },
  infoBannerExtraText: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 17,
  },
  bannerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: 210,
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  viewCartPill: {
    backgroundColor: '#08A6B0',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    width: 160,
    top: 5,
  },
  viewCartContent: {
    alignItems: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    left: 10,
  },
  viewCartCount: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
    marginTop: 2,
  },
  viewCartArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 42,
    backgroundColor: '#0A929B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9F3FF',
    marginRight: 8,
  },

  // Overlay Styles
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  overlayScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overlaySection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quantityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: '#666',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#08A6B0',
    marginRight: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  horizontalOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  horizontalOptionItem: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: '#08A6B0',
    borderColor: '#08A6B0',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#08A6B0',
    borderColor: '#08A6B0',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionIcon: {
    marginLeft: 8,
  },
  addOnPrice: {
    fontSize: 14,
    color: '#08A6B0',
    fontWeight: '600',
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  noteInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  overlayBottom: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  estimatedPriceText: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#08A6B0',
  },
  actionButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Dashboard;