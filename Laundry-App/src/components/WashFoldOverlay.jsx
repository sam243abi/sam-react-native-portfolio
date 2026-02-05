import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    StyleSheet as RNStyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WashFoldOverlay({ visible, onClose, data, onAddToCart, onSchedule, editMode = false, editData = null, onSaveChanges }) {
    const [quantity, setQuantity] = useState(editMode && editData ? editData.quantity : (data?.quantity?.default || 1));
    const [temperature, setTemperature] = useState(editMode && editData ? editData.temperature : 'normal');
    const [addOns, setAddOns] = useState(editMode && editData ? editData.addOns : []);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoContent, setInfoContent] = useState('');



    // Reset state when overlay opens with edit data
    React.useEffect(() => {
        if (visible) {
            console.log('WashFoldOverlay opened - editMode:', editMode, 'editData:', editData);
            if (editMode && editData) {
                console.log('Setting edit data:', editData.quantity, editData.temperature, editData.addOns);
                setQuantity(editData.quantity || 1);
                setTemperature(editData.temperature || 'normal');
                setAddOns(editData.addOns || []);
            } else {
                console.log('Setting default data');
                setQuantity(data?.quantity?.default || 1);
                setTemperature('normal');
                setAddOns([]);
            }
        }
    }, [visible, editMode, editData, data]);

    const toggleAddOn = (id) => {
        setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };


    const inc = () => setQuantity(q => Math.min(q + 1, data?.quantity?.max || 10));
    const dec = () => setQuantity(q => Math.max(q - 1, data?.quantity?.min || 1));

    const total = useMemo(() => {
        const base = (data?.basePrice || 0) * quantity;
        const tempExtra = (data?.washingTemperature?.options || []).find(o => o.id === temperature)?.price || 0;
        const addOnExtra = (data?.addOns?.options || []).reduce((sum, o) => sum + (addOns.includes(o.id) ? o.price : 0), 0);
        return base + (tempExtra * quantity) + (addOnExtra * quantity);
    }, [data, quantity, temperature, addOns]);

    const currency = data?.currency || '₹';
    const washFold = data.washFoldCard;

    const showInfo = (content) => {
        setInfoContent(content);
        setShowInfoModal(true);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlayContainer}>
                {/* Pressable background closes modal when touched outside */}
                <Pressable style={RNStyleSheet.absoluteFill} onPress={onClose} />

                <View style={styles.overlayContent}>
                    <View style={styles.overlayHeader}>
                        <View style={styles.headerTitleRow}></View>
                        <View style={styles.CloseOut}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.overlayScrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.overlaySection}>
                            <View style={styles.noteCard}>
                                <View style={styles.optionItem}>
                                    <Text style={styles.Desctitle}>{washFold.title}</Text>
                                </View>
                                <View style={styles.optionItem}>
                                    <View style={styles.tagsContainer}>
                                        {washFold.tags.map((tag, index) => (
                                            <View key={index} style={[styles.tag, { backgroundColor: tag.color }]}>
                                                <Text style={styles.tagText}>{tag.label}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <Text style={{ color: '#333', paddingTop: 10 }}>{data?.additionalNote?.text || ''}</Text>
                            </View>
                        </View>


                        <View style={styles.quantityCard}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Quantity</Text>
                                <Text style={styles.perText}>{data.per}</Text>
                            </View>
                            <View style={styles.serviceItem}>
                                <View><Image source={require('../assets/images/shirt.png')} style={{ width: 38, height: 38, marginRight: 5, marginLeft: 0 }} /></View>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{data?.title}</Text>
                                    <Text style={styles.servicePrice}>{currency}{data?.basePrice}{data?.unit}</Text>
                                </View>
                                <Text style={styles.currentPrice}>{currency}{(data?.basePrice || 0) * quantity}</Text>
                                <View style={styles.quantitySelector}>
                                    {quantity <= (data?.quantity?.min || 1) ? (
                                        <TouchableOpacity style={styles.quantityButton} onPress={inc}>
                                            <Ionicons name="add" size={16} color={'#08A6B0'} />
                                        </TouchableOpacity>
                                    ) : (
                                        <>
                                            <TouchableOpacity style={styles.quantityButton} onPress={dec}>
                                                <Ionicons name="remove" size={16} color={'#08A6B0'} />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityText}>{quantity}</Text>
                                            <TouchableOpacity
                                                style={[styles.quantityButton, quantity >= (data?.quantity?.max || 10) && styles.quantityButtonDisabled]}
                                                onPress={inc}
                                                disabled={quantity >= (data?.quantity?.max || 10)}
                                            >
                                                <Ionicons name="add" size={16} color={quantity >= (data?.quantity?.max || 10) ? '#ccc' : '#08A6B0'} />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Temperature Section */}
                        <View style={styles.overlaySection}>
                            <View style={styles.optionsCard}>
                                <View style={styles.sectionTitleRow}>
                                    <Text style={styles.sectionTitle}>{data?.washingTemperature?.title}</Text>
                                    <TouchableOpacity
                                        onPress={() => showInfo('Choose the washing temperature based on your fabric type. Hot water for whites, cold for colors.')}
                                        style={styles.infoButton}
                                    >
                                        <Ionicons name="information-circle-outline" size={16} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.horizontalOptions}>
                                    {(data?.washingTemperature?.options || []).map((option, index) => (
                                        <TouchableOpacity key={option.id} style={styles.horizontalOptionItem} onPress={() => setTemperature(option.id)}>
                                            <View style={styles.optionLeft}>
                                                <View style={[styles.radioButton, temperature === option.id && styles.radioButtonSelected]}>
                                                    {temperature === option.id && (<Ionicons name="checkmark" size={16} color="#fff" />)}
                                                </View>
                                                <Text style={styles.optionLabel}>{option.label} </Text>

                                                {/* 1. Temperature PNG: Only for the second data item (index 1) */}
                                                 {/* {index === 1 && (
                                                  <Image source={require('../assets/images/temperature.png')} style={{ width: 16, height: 16, marginRight: 4, right: 80 }} /> 
                                                )} */}
                                            </View>
                                            {index === 1 && (
                                                <Text style={[
                                                    styles.optionPrice,
                                                    temperature !== option.id && styles.optionPriceUnselected // <--- NEW CONDITION
                                                ]}>
                                                    +{currency}{option.price}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Add-ons Section */}
                        <View style={styles.overlaySection}>
                            <View style={styles.optionsCard}>
                                <View style={styles.sectionTitleRow}>
                                    <Text style={styles.sectionTitle}>{data?.addOns?.title}</Text>
                                    <TouchableOpacity
                                        onPress={() => showInfo('Add-ons enhance your laundry experience. Eco-friendly detergent is gentle on fabrics, fabric softener makes clothes softer.')}
                                        style={styles.infoButton}
                                    >
                                        <Ionicons name="information-circle-outline" size={16} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                {(data?.addOns?.options || []).map((addOn, index) => (
                                    <TouchableOpacity key={addOn.id} style={styles.optionItem} onPress={() => toggleAddOn(addOn.id)}>
                                        <View style={styles.optionLeft}>

                                            {/* 2. Eco PNG: Only for the first data item (index 0) */}


                                            <View style={[styles.checkbox, addOns.includes(addOn.id) && styles.checkboxSelected]}>
                                                {addOns.includes(addOn.id) && (<Ionicons name="checkmark" size={16} color="#fff" />)}
                                            </View>

                                            <Text style={styles.optionLabel}>{addOn.label}</Text>

                                            {/* 3. Softner PNG: Only for the second data item (index 1) */}
                                            {/* {index === 0 && (
                                                <Image source={require('../assets/images/Eco.png')} style={{ width: 16, height: 16, marginRight: 4, right: 125 }} />
                                            )}*/}
                                            {/* {index === 1 && (

                                                <Image source={require('../assets/images/Softner.png')} style={{ width: 16, height: 16, marginLeft: 4, right: 175 }} />
                                            )}*/}

                                        </View>
                                        <Text style={[
                                            styles.addOnPrice,
                                            !addOns.includes(addOn.id) && styles.addOnPriceUnselected // <--- NEW CONDITION
                                        ]}>
                                            +{currency}{addOn.price}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Note Section */}
                        <View style={styles.overlaySection}>
                            <View style={styles.noteCard}>
                                <Text style={styles.sectionTitle}>{data?.additionalNote?.title}</Text>
                                <Text style={{ color: '#333', paddingTop: 30 }}>{data?.additionalNote?.text || ''}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.overlayBottom}>
                        <View style={styles.priceRow}>
                            <Text style={styles.estimatedPriceText}>{data?.estimatedPrice?.title || 'Estimated price'}</Text>
                            <Text style={styles.totalPrice}>{currency}{total}</Text>
                        </View>
                        

                        
                        {editMode ? (
                            <TouchableOpacity
                                style={[styles.actionsButton, { 
                                    backgroundColor: '#08A6B0', 
                                    width: '100%',
                                    minHeight: 50,
                                    marginTop: 10
                                }]}
                                onPress={() => onSaveChanges?.({
                                    ...editData,
                                    quantity,
                                    temperature,
                                    addOns,
                                    unitPrice: data?.basePrice,
                                    estimatedPrice: total,
                                    icons: [
                                        ...(temperature !== 'normal' ? ['flame'] : []),
                                        ...(addOns.includes('eco-detergent') ? ['leaf'] : []),
                                        ...(addOns.includes('fabric-softener') ? ['flower'] : []),
                                    ],
                                    breakdown: [
                                        { label: 'Item price', value: (data?.basePrice || 0) * quantity },
                                        ...(temperature !== 'normal' ? [{ label: 'Temperature', value: ((data?.washingTemperature?.options || []).find(o => o.id === temperature)?.price || 0) * quantity }] : []),
                                        ...(addOns.includes('eco-detergent') ? [{ label: 'Eco-friendly detergent', value: ((data?.addOns?.options || []).find(o => o.id === 'eco-detergent')?.price || 0) * quantity }] : []),
                                        ...(addOns.includes('fabric-softener') ? [{ label: 'Fabric softener', value: ((data?.addOns?.options || []).find(o => o.id === 'fabric-softener')?.price || 0) * quantity }] : []),
                                    ],
                                    currency
                                })}
                            >
                                <Text style={[styles.actionButtonText, { fontSize: 16, fontWeight: '700' }]}>SAVE CHANGES</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: data?.actions?.addToCart?.color || '#08A6B0' }]}
                                    onPress={() => onAddToCart?.({
                                        service: data?.title,
                                        quantity,
                                        temperature,
                                        addOns,
                                        unitPrice: data?.basePrice,
                                        estimatedPrice: total,
                                        icons: [
                                            ...(temperature !== 'normal' ? ['flame'] : []),
                                            ...(addOns.includes('eco-detergent') ? ['leaf'] : []),
                                            ...(addOns.includes('fabric-softener') ? ['flower'] : []),
                                        ],
                                        breakdown: [
                                            { label: 'Item price', value: (data?.basePrice || 0) * quantity },
                                            ...(temperature !== 'normal' ? [{ label: 'Temperature', value: ((data?.washingTemperature?.options || []).find(o => o.id === temperature)?.price || 0) * quantity }] : []),
                                            ...(addOns.includes('eco-detergent') ? [{ label: 'Eco-friendly detergent', value: ((data?.addOns?.options || []).find(o => o.id === 'eco-detergent')?.price || 0) * quantity }] : []),
                                            ...(addOns.includes('fabric-softener') ? [{ label: 'Fabric softener', value: ((data?.addOns?.options || []).find(o => o.id === 'fabric-softener')?.price || 0) * quantity }] : []),
                                        ],
                                        currency
                                    })}
                                >
                                    <Text style={styles.actionButtonText}>{data?.actions?.addToCart?.text || 'ADD TO CART'}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: data?.actions?.schedule?.color || '#F28B66' }]}
                                    onPress={() => onSchedule?.({
                                        service: data?.title,
                                        quantity,
                                        temperature,
                                        addOns,
                                        estimatedPrice: total,
                                        breakdown: [
                                            { label: 'Item price', value: (data?.basePrice || 0) * quantity },
                                            ...(temperature !== 'normal' ? [{ label: 'Temperature', value: ((data?.washingTemperature?.options || []).find(o => o.id === temperature)?.price || 0) * quantity }] : []),
                                            ...(addOns.includes('eco-detergent') ? [{ label: 'Eco-friendly detergent', value: ((data?.addOns?.options || []).find(o => o.id === 'eco-detergent')?.price || 0) * quantity }] : []),
                                            ...(addOns.includes('fabric-softener') ? [{ label: 'Fabric softener', value: ((data?.addOns?.options || []).find(o => o.id === 'fabric-softener')?.price || 0) * quantity }] : []),
                                        ],
                                        currency
                                    })}
                                >
                                    <Text style={styles.actionButtonText}>{data?.actions?.schedule?.text || 'SCHEDULE NOW'}</Text>
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
    overlayContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    overlayContent: { backgroundColor: '#F5F5F5', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%', minHeight: '70%', },
    overlayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', },
    overlayTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
    infoButton: { padding: 4 },
    CloseOut: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', top: -130 },
    closeButton: { padding: 8 },
    overlayScrollView: { flex: 1, paddingHorizontal: 20, marginTop: -40 },
    overlaySection: { marginVertical: 16 },
    Desctitle: { fontSize: 16, fontWeight: '600', color: '#2B2E2D', marginTop: -8 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    perText: { fontSize: 12, color: '#6F6F6F', fontWeight: '400', right: 20 },
    quantityCard: { backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3},
    serviceItem: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    serviceIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f8ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    serviceInfo: { flex: 1, marginRight: 12 },
    serviceName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
    servicePrice: { fontSize: 14, color: '#666' },
    currentPrice: { fontSize: 16, fontWeight: '600', color: '#08A6B0', marginRight: 12 },
    quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    quantityButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f8ff', alignItems: 'center', justifyContent: 'center' },
    quantityButtonDisabled: { backgroundColor: '#f5f5f5' },
    quantityText: { fontSize: 18, fontWeight: '600', color: '#333', minWidth: 30, textAlign: 'center' },
    optionsCard: {backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3 },
    horizontalOptions: { flexDirection: 'row', gap: 16 },
    horizontalOptionItem: { flex: 1 },
    optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    radioButtonSelected: { backgroundColor: '#08A6B0', borderColor: '#08A6B0' },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    checkboxSelected: { backgroundColor: '#08A6B0', borderColor: '#08A6B0' },
    optionLabel: { fontSize: 16, color: '#333', flex: 1 },
    addOnPrice: { fontSize: 14, color: '#08A6B0', fontWeight: '600' },
    addOnPriceUnselected: { color: '#666' },
    optionPriceUnselected: { color: '#666', left: 135, top: -18 },
    optionPrice: { fontSize: 14, color: '#08A6B0', fontWeight: '600', left: 135, top: -18 },
    noteCard: { backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3 },
    overlayBottom: { 
        padding: 20, 
        paddingBottom: 40, // Extra bottom padding for safe area
        borderTopWidth: 1, 
        borderTopColor: '#f0f0f0', 
        backgroundColor: '#fff' 
    },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    estimatedPriceText: { fontSize: 16, color: '#666' },
    totalPrice: { fontSize: 20, fontWeight: '700', color: '#08A6B0' },
    actionButton: { flex: 1, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    actionsButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',top:0
  },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    infoModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    infoModalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, margin: 20, maxWidth: '80%' },
    infoModalText: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 16 },
    infoModalCloseButton: { backgroundColor: '#08A6B0', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'center' },
    infoModalCloseText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0,
        marginBottom: -10,
    },
    tag: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 2,
        marginTop: -7
    },
    tagText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500'
    },
});