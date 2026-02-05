import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

import globalStyles, { COLORS, DIMENSIONS } from '../../styles/globalStyles';
import ordersData from '../../data/orders.json';

export default function OrderList() {
  const navigation = useNavigation();
  const orders = ordersData.orders || [];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem}> 
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={styles.statusContainer}>
          <MaterialIcons name="check-circle" size={20} color="green" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.black} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.containerGray}>
      <View style={globalStyles.headerWithHeight}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={globalStyles.headerTitleLarge}>Orders List</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
  {/* Bottom Navigation */}
        <BottomNavigation navigation={navigation} currentRoute="OrderList" />

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: DIMENSIONS.spacing.md,
    paddingBottom: DIMENSIONS.bottomNavHeight + DIMENSIONS.spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.small,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DIMENSIONS.spacing.md,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
});