import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="(tabs)" />
      {/* Other screens */}
      <Stack.Screen name="screens/Others/BrandCards" />
      <Stack.Screen name="screens/Others/SearchCarCards" />
      <Stack.Screen name="screens/Others/CarCardsByBrand" />
      <Stack.Screen name="screens/Setting/PrivatePolicy" />
      <Stack.Screen name="screens/Setting/Report" />
      <Stack.Screen name="screens/Lease/ExtendLease" />
      <Stack.Screen name="screens/Others/CarLeaseDetails" />
      <Stack.Screen name="screens/Others/DateAndTime" />
      <Stack.Screen name="screens/Lease/LeaseDetails" />
      <Stack.Screen name="screens/Payments/PaymentDetails" />
      <Stack.Screen name="screens/Payments/PaymentSuccess" />
      <Stack.Screen name="screens/Auth/SocialAuth" />
      <Stack.Screen name="screens/Others/CarImages" />
      <Stack.Screen name="screens/Setting/DocumentUploadScreen" />
      <Stack.Screen name="screens/Setting/DocumentSubmittedScreen" />
    </Stack>
  );
}
