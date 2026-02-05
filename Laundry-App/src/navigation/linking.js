

const config = {
  screens: {
    Login: 'login',
    PhoneVerification: 'phone-verification',
    OTP: 'otp',
    Profile: 'profile',
    Delivery: 'delivery',
    LoginOtp: 'login-otp',
    Dashboard: 'dashboard',
    Service: 'service',
    CollectionDelivery: 'collection-delivery',
    OrderList: 'order-list',
    ProfileList: 'profile-list',
    AddressBook: 'address-book',
  },
};

const linking = {
  prefixes: ['laundryapp://'],
  config,
};

export default linking;