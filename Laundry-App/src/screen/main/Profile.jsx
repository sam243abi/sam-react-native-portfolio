import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, 
    SafeAreaView, KeyboardAvoidingView, Platform, Modal, FlatList, 
    Pressable, ScrollView, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import GlobalButton from '../../components/GlobalButton';
import globalStyles, { COLORS, DIMENSIONS } from '../../styles/globalStyles';
import profileScreenData from '../../data/profileScreen.json';

// --- MODULAR FIREBASE IMPORTS FOR 2026 ---
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { 
    getFirestore, doc, getDoc, setDoc, serverTimestamp,
    query, where, collection, getDocs 
} from '@react-native-firebase/firestore';

const Profile = () => {
    const navigation = useNavigation();
    
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    
    // UI States
    const [showPicker, setShowPicker] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [isSaving, setIsSaving] = useState(false); 

    // --- 1. LOGIC: SKIP PROFILE IF ALREADY EXISTS ---
    useEffect(() => {
        const checkExistingProfile = async () => {
            try {
                const user = getAuth().currentUser;
                if (!user) {
                    navigation.replace('PhoneVerification');
                    return;
                }
                const db = getFirestore(getApp(), 'wash-app-db');
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    navigation.replace('Dashboard');
                } else {
                    setLoading(false); 
                }
            } catch (error) {
                console.error("Firebase Check Error:", error);
                setLoading(false);
            }
        };
        checkExistingProfile();
    }, []);

    // --- 2. LOGIC: EMAIL FORMAT VALIDATOR ---
    const validateEmailFormat = (emailStr) => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return reg.test(emailStr.trim());
    };

    // Calendar States & Logic
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth()); 
    const [calSelectedDay, setCalSelectedDay] = useState(today.getDate()); 
    const [showMonthList, setShowMonthList] = useState(false);
    const [showYearList, setShowYearList] = useState(false);
    const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i); 

    const getDaysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();
    const getFirstWeekday = (year, monthIndex) => new Date(year, monthIndex, 1).getDay(); 

    const handlePrevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } 
        else { setCalMonth(m => m - 1); }
    };

    const handleNextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } 
        else { setCalMonth(m => m + 1); }
    };

    const confirmCalendarSelection = () => {
        if (!calSelectedDay) return;
        const mm = String(calMonth + 1).padStart(2, '0');
        const dd = String(calSelectedDay).padStart(2, '0');
        setDob(`${calYear}-${mm}-${dd}`);
        setShowPicker(false);
    };

    // --- 3. LOGIC: SAVE TO FIREBASE WITH UNIQUE EMAIL CHECK ---
    const handleNext = async () => {
        // Validation
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            Alert.alert("Required", "Please fill in your name and email.");
            return;
        }

        if (!validateEmailFormat(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address (e.g. name@domain.com)");
            return;
        }

        setIsSaving(true);
        try {
            const user = getAuth().currentUser;
            const db = getFirestore(getApp(), 'wash-app-db');

            // UNIQUE EMAIL CHECK
            const emailQuery = query(
                collection(db, 'users'), 
                where('email', '==', email.trim().toLowerCase())
            );
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                // If found, check if it belongs to someone else
                const isTaken = querySnapshot.docs.some(doc => doc.id !== user.uid);
                if (isTaken) {
                    Alert.alert("Error", "This email is already registered with another phone number.");
                    setIsSaving(false);
                    return; 
                }
            }

            const userData = {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                gender: gender,
                dob: dob,
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
            console.log("Profile successfully saved to wash-app-db");
            
            // App.jsx will automatically see the change and show Dashboard!

        } catch (error) {
            console.error("Save Error:", error);
            Alert.alert("Error", "Could not save your profile. Please check your internet.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={globalStyles.safeArea} pointerEvents="box-none">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={globalStyles.container}
                pointerEvents="box-none"
            >
                <View style={globalStyles.backgroundWrapper} pointerEvents="none">
                    <View style={globalStyles.blueCurve} />
                </View>

                <View style={globalStyles.contentWrapper} pointerEvents="box-none">
                    <View style={styles.headerContent}>
                        <Text style={globalStyles.headerText1}>{profileScreenData.profileScreen.titles.header1}</Text>
                        <Text style={globalStyles.headerText2}>{profileScreenData.profileScreen.titles.header2}</Text>
                    </View>

                    <View style={styles.bodyContainer}>
                        <View style={styles.rowInputs}>
                            <View style={[globalStyles.inputWrapper, styles.halfInput]}>
                                <TextInput
                                    placeholder={profileScreenData.profileScreen.placeholders.firstName}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    style={globalStyles.inputFlex}
                                    placeholderTextColor={COLORS.text.placeholder}
                                />
                            </View>
                            <View style={[globalStyles.inputWrapper, styles.halfInput, styles.leftGap]}>
                                <TextInput
                                    placeholder={profileScreenData.profileScreen.placeholders.lastName}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    style={globalStyles.inputFlex}
                                    placeholderTextColor={COLORS.text.placeholder}
                                />
                            </View>
                        </View>

                        <View style={globalStyles.inputWrapper}>
                            <TextInput
                                placeholder={profileScreenData.profileScreen.placeholders.email}
                                value={email}
                                onChangeText={setEmail}
                                style={globalStyles.inputFlex}
                                placeholderTextColor={COLORS.text.placeholder}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <MaterialIcons name="email" size={24} color={COLORS.text.muted} />
                        </View>

                        <TouchableOpacity 
                            onPress={() => setShowGenderDropdown(prev => !prev)} 
                            style={globalStyles.inputWrapper}
                            activeOpacity={0.8}
                        >
                            <TextInput
                                placeholder={profileScreenData.profileScreen.placeholders.gender}
                                value={gender}
                                style={globalStyles.inputFlex}
                                editable={false}
                                placeholderTextColor={COLORS.text.placeholder}
                            />
                            <MaterialIcons name="arrow-drop-down" size={28} color={COLORS.text.muted} />
                        </TouchableOpacity>
                        {showGenderDropdown && (
                            <View style={styles.dropdownContainer}>
                                {['Male', 'Female', 'Others'].map(option => (
                                    <TouchableOpacity key={option} style={styles.dropdownItem} onPress={() => { setGender(option); setShowGenderDropdown(false); }}>
                                        <Text style={styles.dropdownText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity onPress={() => setShowPicker(true)} style={globalStyles.inputWrapper}>
                            <TextInput
                                placeholder={profileScreenData.profileScreen.placeholders.dob}
                                value={dob}
                                style={globalStyles.inputFlex}
                                editable={false}
                                placeholderTextColor={COLORS.text.placeholder}
                            />
                            <MaterialIcons name="calendar-today" size={24} color={COLORS.text.muted} />
                        </TouchableOpacity>

                        {/* Calendar Modal */}
                        <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
                            <View style={styles.modalOverlay}>
                                <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowPicker(false)} />
                                <View style={styles.pickerSheet}>
                                    <View style={styles.calendarHeader}>
                                        <TouchableOpacity onPress={handlePrevMonth}><MaterialIcons name="chevron-left" size={28} color={COLORS.text.secondary} /></TouchableOpacity>
                                        <View style={styles.headerSelectors}>
                                            <TouchableOpacity style={styles.headerButton} onPress={() => { setShowMonthList(prev => !prev); setShowYearList(false); }}>
                                                <Text style={styles.calendarHeaderText}>{monthNames[calMonth]}</Text>
                                                <MaterialIcons name="arrow-drop-down" size={22} color={COLORS.text.secondary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.headerButton, styles.headerYear]} onPress={() => { setShowYearList(prev => !prev); setShowMonthList(false); }}>
                                                <Text style={styles.calendarHeaderText}>{calYear}</Text>
                                                <MaterialIcons name="arrow-drop-down" size={22} color={COLORS.text.secondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity onPress={handleNextMonth}><MaterialIcons name="chevron-right" size={28} color={COLORS.text.secondary} /></TouchableOpacity>
                                    </View>
                                    {showMonthList && (
                                        <View style={styles.selectList}>
                                            <View style={styles.selectListRow}>
                                                {monthNames.map((m, idx) => (
                                                    <TouchableOpacity key={m} style={[styles.selectItem, idx === calMonth && styles.selectItemActive]} onPress={() => { setCalMonth(idx); setShowMonthList(false); }}>
                                                        <Text style={[styles.selectItemText, idx === calMonth && styles.selectItemTextActive]}>{m.substring(0,3)}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                    {showYearList && (
                                        <View style={[styles.selectList, styles.yearListContainer]}>
                                            <ScrollView style={{ maxHeight: 200 }}><View style={styles.yearGrid}>{years.map((y) => (
                                                <TouchableOpacity key={y} style={[styles.yearCell, y === calYear && styles.selectItemActive]} onPress={() => { setCalYear(y); setShowYearList(false); }}><Text style={[styles.selectItemText, y === calYear && styles.selectItemTextActive]}>{y}</Text></TouchableOpacity>
                                            ))}</View></ScrollView>
                                        </View>
                                    )}
                                    <View style={styles.weekRow}>{['S','M','T','W','T','F','S'].map(d => <Text key={d} style={styles.weekLabel}>{d}</Text>)}</View>
                                    <View style={styles.daysGrid}>
                                        {Array.from({ length: getFirstWeekday(calYear, calMonth) }).map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
                                        {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                                            const day = i + 1;
                                            const isSelected = calSelectedDay === day;
                                            return (
                                                <TouchableOpacity key={`day-${day}`} style={[styles.dayCell, isSelected && styles.daySelected]} onPress={() => setCalSelectedDay(day)}>
                                                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    <View style={styles.calendarActions}>
                                        <TouchableOpacity style={[styles.doneButton, styles.cancelButton]} onPress={() => setShowPicker(false)}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.doneButton} onPress={confirmCalendarSelection}><Text style={styles.doneButtonText}>Done</Text></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <View style={styles.bottomContainer}>
                <GlobalButton title={isSaving ? "Saving..." : profileScreenData.profileScreen.buttons.next} onPress={handleNext} />
                <TouchableOpacity onPress={() => navigation.navigate('PhoneVerification')}><Text style={globalStyles.goBackText}>{profileScreenData.profileScreen.buttons.goBack}</Text></TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    headerContent: {
        alignItems: 'center',
        marginBottom: DIMENSIONS.spacing.xxl,
    },
    bodyContainer: {
        flex: 1,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center', 
        width: '100%', 
        top:40,
    },
    rowInputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    halfInput: {
        width: '48%',
    },
    leftGap: {
        marginLeft: DIMENSIONS.spacing.sm,
    },
    bottomContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        alignItems: 'center',
        paddingHorizontal: DIMENSIONS.spacing.sm,
        zIndex: 100,
        elevation: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    pickerSheet: {
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 12,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerSelectors: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    headerYear: {
        marginLeft: 8,
    },
    calendarHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        paddingHorizontal: 6,
    },
    weekLabel: {
        width: (Dimensions.get('window').width - 48) / 7,
        textAlign: 'center',
        color: COLORS.text.muted,
        fontSize: 12,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 6,
    },
    dayCell: {
        width: (Dimensions.get('window').width - 48) / 7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 6,
    },
    daySelected: {
        backgroundColor: '#E3F2FD',
    },
    dayText: {
        color: COLORS.text.secondary,
        fontSize: 14,
    },
    dayTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    calendarActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 8,
    },
    selectList: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        padding: 8,
        marginBottom: 8,
    },
    yearListContainer: {
        maxHeight: 200,
    },
    selectListRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'space-between',
    },
    selectItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        width: (Dimensions.get('window').width - 48 - 24) / 4,
        alignItems: 'center',
        marginBottom: 6,
    },
    selectItemActive: {
        backgroundColor: '#E3F2FD',
    },
    selectItemText: {
        color: COLORS.text.secondary,
        fontSize: 13,
    },
    selectItemTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    yearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    yearCell: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        width: (Dimensions.get('window').width - 48 - 24) / 3,
        alignItems: 'center',
        marginBottom: 6,
    },
    cancelButton: {
        backgroundColor: COLORS.border.light,
    },
    cancelButtonText: {
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
    doneButton: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: DIMENSIONS.borderRadius.small,
        marginTop: 8,
        marginBottom: 10,
    },
    doneButtonText: {
        color: COLORS.white,
        fontWeight: '600',
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: COLORS.border.light,
        borderRadius: DIMENSIONS.borderRadius.medium,
        backgroundColor: COLORS.white,
        width: DIMENSIONS.buttonWidth,
        alignSelf: 'center',
        marginTop: 6,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    dropdownText: {
        fontSize: 14,
        color: COLORS.text.secondary,
    },
});

export default Profile;
