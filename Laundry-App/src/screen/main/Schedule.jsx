import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Schedule = ({ navigation, route }) => {
  const [selectedPickupDate, setSelectedPickupDate] = useState(null);
  const [selectedPickupTime, setSelectedPickupTime] = useState(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);

  const serviceType = route?.params?.serviceType || 'regular';

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const timeSlots = [
    { id: '09:00', label: '09:00 am', hour: 9, disabled: false },
    { id: '10:00', label: '10:00 am', hour: 10, disabled: false },
    { id: '11:00', label: '11:00 am', hour: 11, disabled: false },
    { id: '01:00', label: '01:00 pm', hour: 13, disabled: false },
    { id: '02:00', label: '02:00 pm', hour: 14, disabled: false },
    { id: '03:00', label: '03:00 pm', hour: 15, disabled: false },
    { id: '04:00', label: '04:00 pm', hour: 16, disabled: false },
    { id: '05:00', label: '05:00 pm', hour: 17, disabled: false },
    { id: '06:00', label: '06:00 pm', hour: 18, disabled: false },
  ];

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isTimeDisabled = (timeSlot, date) => {
    if (isToday(date)) {
      const currentTime = currentHour * 60 + currentMinute;
      const slotTime = timeSlot.hour * 60;
      return slotTime <= currentTime;
    }
    return false;
  };

  // --- MAIN CHANGE STARTS HERE ---
  const [disabledDeliveryDates, setDisabledDeliveryDates] = useState([]);
  const [disabledDeliveryTimes, setDisabledDeliveryTimes] = useState([]);
  // --- MAIN CHANGE ENDS HERE ---

  const handlePickupSelection = (date, time) => {
    setSelectedPickupDate(date);
    setSelectedPickupTime(time);

    let deliveryDate = new Date(date);
    let deliveryTime = null;

    const currentTimeIndex = timeSlots.findIndex(slot => slot.id === time.id);
    const nextTimeIndex = (currentTimeIndex + 1) % timeSlots.length;

    if (serviceType === '99-mins-wash') {
      deliveryDate = date;
      deliveryTime = timeSlots[nextTimeIndex];
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      deliveryTime = timeSlots[nextTimeIndex];
    }

    setSelectedDeliveryDate(deliveryDate);
    setSelectedDeliveryTime(deliveryTime);

    // --- AUTO DISABLE LOGIC ADDED HERE ---
    const disabledDates = dates.filter(d => d < deliveryDate);
    setDisabledDeliveryDates(disabledDates.map(d => d.toDateString()));

    const disabledTimes = timeSlots
      .filter((_, idx) => idx < nextTimeIndex)
      .map(slot => slot.id);
    setDisabledDeliveryTimes(disabledTimes);
    // --- END AUTO DISABLE LOGIC ---
  };

  const handleDeliveryDateSelection = (date) => {
    setSelectedDeliveryDate(date);
    if (selectedPickupDate && isToday(date) && isToday(selectedPickupDate)) {
      const pickupTimeIndex = timeSlots.findIndex(slot => slot.id === selectedPickupTime?.id);
      const nextTimeIndex = (pickupTimeIndex + 1) % timeSlots.length;
      setSelectedDeliveryTime(timeSlots[nextTimeIndex]);
    }
  };

  const handleDeliveryTimeSelection = (time) => {
    setSelectedDeliveryTime(time);
  };

  const isDeliveryTimeValid = (time, date) => {
    if (selectedPickupDate && selectedPickupTime) {
      if (isToday(date) && isToday(selectedPickupDate)) {
        const pickupTimeIndex = timeSlots.findIndex(slot => slot.id === selectedPickupTime.id);
        const deliveryTimeIndex = timeSlots.findIndex(slot => slot.id === time.id);
        return deliveryTimeIndex > pickupTimeIndex;
      }
    }
    return true;
  };

  const isDeliveryDateDisabled = (date) => {
    if (disabledDeliveryDates.includes(date.toDateString())) return true; // 👈 Added check

    if (serviceType === '99-mins-wash') {
      if (selectedPickupDate) {
        return date.toDateString() !== selectedPickupDate.toDateString();
      }
      return isPastDate(date);
    } else {
      return isPastDate(date);
    }
  };

  const isDeliveryTimeDisabled = (time) => {
    if (disabledDeliveryTimes.includes(time.id)) return true; // 👈 Added check
    return false;
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: days[date.getDay()],
      date: date.getDate()
    };
  };

  const handleCheckout = () => {
    console.log('Schedule selected:', {
      pickup: { date: selectedPickupDate, time: selectedPickupTime },
      delivery: { date: selectedDeliveryDate, time: selectedDeliveryTime }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
          
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
       
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pickup Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map((date, index) => {
              const { day, date: dateNum } = formatDate(date);
              const isSelected = selectedPickupDate && date.toDateString() === selectedPickupDate.toDateString();
              const isDisabled = isPastDate(date);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateTile,
                    isSelected && styles.dateTileSelected,
                    isDisabled && styles.dateTileDisabled
                  ]}
                  onPress={() => !isDisabled && setSelectedPickupDate(date)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.dateDay,
                    isSelected && styles.dateDaySelected,
                    isDisabled && styles.dateDayDisabled
                  ]}>
                    {day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    isSelected && styles.dateNumberSelected,
                    isDisabled && styles.dateNumberDisabled
                  ]}>
                    {dateNum}
                  </Text>
                  {isToday(date) && (
                    <View style={styles.todayTag}>
                      <Text style={styles.todayText}>Today</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Pickup Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedPickupTime && selectedPickupTime.id === time.id;
              const isDisabled = selectedPickupDate ? isTimeDisabled(time, selectedPickupDate) : false;
              return (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotSelected,
                    isDisabled && styles.timeSlotDisabled
                  ]}
                  onPress={() => !isDisabled && selectedPickupDate && handlePickupSelection(selectedPickupDate, time)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.timeSlotText,
                    isSelected && styles.timeSlotTextSelected,
                    isDisabled && styles.timeSlotTextDisabled
                  ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Delivery Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map((date, index) => {
              const { day, date: dateNum } = formatDate(date);
              const isSelected = selectedDeliveryDate && date.toDateString() === selectedDeliveryDate.toDateString();
              const isDisabled = isDeliveryDateDisabled(date);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateTile,
                    isSelected && styles.dateTileSelected,
                    isDisabled && styles.dateTileDisabled
                  ]}
                  onPress={() => !isDisabled && handleDeliveryDateSelection(date)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.dateDay,
                    isSelected && styles.dateDaySelected,
                    isDisabled && styles.dateDayDisabled
                  ]}>
                    {day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    isSelected && styles.dateNumberSelected,
                    isDisabled && styles.dateNumberDisabled
                  ]}>
                    {dateNum}
                  </Text>
                  {isToday(date) && (
                    <View style={styles.todayTag}>
                      <Text style={styles.todayText}>Today</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedDeliveryTime && selectedDeliveryTime.id === time.id;
              const isDisabled =
                selectedDeliveryDate
                  ? isTimeDisabled(time, selectedDeliveryDate) ||
                    !isDeliveryTimeValid(time, selectedDeliveryDate) ||
                    isDeliveryTimeDisabled(time)
                  : false;
              return (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotSelected,
                    isDisabled && styles.timeSlotDisabled
                  ]}
                  onPress={() => !isDisabled && selectedDeliveryDate && handleDeliveryTimeSelection(time)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.timeSlotText,
                    isSelected && styles.timeSlotTextSelected,
                    isDisabled && styles.timeSlotTextDisabled
                  ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={!selectedPickupDate || !selectedPickupTime || !selectedDeliveryDate || !selectedDeliveryTime}
        >
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  content: { flex: 1, paddingHorizontal: 16 },
  section: { marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  dateScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  dateTile: {
    alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, marginRight: 12, marginTop: 10,
    borderRadius: 24, backgroundColor: '#f8f8f8', minWidth: 60,
  },
  dateTileSelected: { backgroundColor: '#F28B66' },
  dateTileDisabled: { backgroundColor: '#f0f0f0', opacity: 0.5 },
  dateDay: { fontSize: 12, color: '#666', marginBottom: 4 },
  dateDaySelected: { color: '#fff' },
  dateDayDisabled: { color: '#ccc' },
  dateNumber: { fontSize: 16, fontWeight: '600', color: '#333' },
  dateNumberSelected: { color: '#fff' },
  dateNumberDisabled: { color: '#ccc' },
  todayTag: {
    position: 'relative', top: -50, right: 2,
    backgroundColor: '#08A6B0', paddingHorizontal: 3, paddingVertical: 3, borderRadius: 8,
  },
  todayText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeSlot: {
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24,
    backgroundColor: '#f8f8f8', minWidth: (width - 60) / 3, alignItems: 'center',
  },
  timeSlotSelected: { backgroundColor: '#F28B66' },
  timeSlotDisabled: { backgroundColor: '#f0f0f0', opacity: 1.9 },
  timeSlotText: { fontSize: 14, color: '#666' },
  timeSlotTextSelected: { color: '#fff', fontWeight: '600' },
  timeSlotTextDisabled: { color: '#ccc' },
  bottomContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  checkoutButton: { backgroundColor: '#08A6B0', paddingVertical: 16, borderRadius: 24, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Schedule;
