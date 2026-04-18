import { capitalText } from "@/folder/capitalText";
import { formatDate } from "@/folder/formatDate";
import { DetailsRateOption } from "@/folder/rateOptions";
import { useLeaseById } from "@/hooks/useFetchLease";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const LeaseDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const { data, isLoading, isError } = useLeaseById(id as string);

  // Safely extract nested data
  const leaseDetails = data?.details?.[0];
  const carDetails = leaseDetails?.carDetails?.[0];

  const days = useMemo(() => {
    if (leaseDetails?.startDate && leaseDetails?.endDate) {
      const start = new Date(leaseDetails.startDate).getTime();
      const end = new Date(leaseDetails.endDate).getTime();
      const diff = end - start;
      return Math.round(diff / (24 * 60 * 60 * 1000));
    }
    return 0;
  }, [leaseDetails?.startDate, leaseDetails?.endDate]);

  const rateOptionsDetails: DetailsRateOption[] = [
    {
      label: "Initial Miles:",
      value: carDetails?.initialMileage ?? "0",
    },
    {
      label: "Miles Allowed:",
      value: carDetails?.allowedMilleage ?? "0",
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1F305E" />
      </SafeAreaView>
    );
  }

  if (isError || !leaseDetails) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Icon name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>Failed to load lease details</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="chevron-back" size={24} color="#1F305E" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Lease Details</Text>

            <View style={styles.menuWrapper}>
              <TouchableOpacity onPress={() => setMenuVisible((p) => !p)}>
                <Icon name="ellipsis-horizontal" size={24} color="#000" />
              </TouchableOpacity>

              {menuVisible && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push({
                        pathname: "/screens/Payments/PaymentDetails",
                        params: { id },
                      });
                    }}
                  >
                    <Icon name="card-outline" size={16} color="#3f3f3fff" />
                    <Text style={styles.dropdownText}>Payment Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Lease Info */}
            <Text style={styles.sectionTitle}>Lease Info:</Text>
            <InfoRow
              label="Status:"
              value={capitalText(leaseDetails?.status || "N/A")}
              valueStyle={{
                color: leaseDetails?.status === "active" ? "green" : "red",
              }}
            />
            <InfoRow label="Lease Type:" value="Limited Miles Lease" />
            <InfoRow label="Daily Miles:" value="2000" />
            <InfoRow label="Duration:" value={`${days} days`} />
            <InfoRow
              label="Lease Start Date:"
              value={formatDate(leaseDetails?.startDate)}
            />
            <InfoRow
              label="Lease End Date:"
              value={formatDate(leaseDetails?.endDate)}
            />

            {/* Miles Info */}
            <Text style={styles.sectionTitle}>Miles Tracking:</Text>
            <View style={styles.rateOptionsContainer}>
              {rateOptionsDetails.map((option, index) => (
                <View key={index} style={styles.rateCard}>
                  <Text style={styles.rateLabel}>{option.label}</Text>
                  <Text style={styles.rateValue}>{option.value}</Text>
                </View>
              ))}
            </View>

            {/* Car Info */}
            <Text style={styles.sectionTitle}>Car Info:</Text>
            <InfoRow label="Brand:" value={capitalText(carDetails?.brand)} />
            <InfoRow
              label="Model:"
              value={capitalText(carDetails?.modelName)}
            />
            <InfoRow
              label="Price Per Day:"
              value={`$${carDetails?.pricePerDay}`}
            />
            <InfoRow
              label="Current Odometer:"
              value={`${carDetails?.initialMileage} mi`}
            />

            {/* Contact Info */}
            <Text style={styles.sectionTitle}>Contact Support:</Text>
            <View style={styles.contactContainer}>
              <View style={styles.contactRow}>
                <Icon name="call" size={20} color="#1F305E" />
                <Text style={styles.contactText}>+92 345 67673338</Text>
              </View>
              <View style={[styles.contactRow, { marginTop: 12 }]}>
                <Icon name="mail" size={20} color="#1F305E" />
                <Text style={styles.contactText}>
                  citycarcenterarizona@gmail.com
                </Text>
              </View>
            </View>

            {/* Extend Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/screens/Lease/ExtendLease",
                  params: { id: leaseDetails?._id },
                })
              }
            >
              <Text style={styles.buttonText}>Extend Lease Duration</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, valueStyle }: any) => (
  <View style={styles.infoRowContainer}>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={[styles.priceValue, valueStyle]}>{value}</Text>
    </View>
    <View style={styles.line} />
  </View>
);

export default LeaseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: RFValue(15),
    paddingBottom: RFValue(30),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(15),
    height: RFValue(50),
    zIndex: 10,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "bold",
    color: "#3f3f3fff",
  },
  menuWrapper: {
    width: 40,
    alignItems: "flex-end",
  },
  dropdownMenu: {
    position: "absolute",
    top: RFValue(30),
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 5 },
    }),
    borderWidth: 1,
    borderColor: "#f0f0f0",
    minWidth: RFValue(150),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(15),
  },
  dropdownText: {
    fontFamily: "demiBold",
    fontSize: RFValue(12),
    color: "#3f3f3fff",
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: "bold",
    fontSize: RFValue(13),
    marginTop: RFValue(20),
    marginBottom: RFValue(12),
    color: "#1F305E",
  },
  infoRowContainer: {
    width: "100%",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  priceLabel: {
    fontSize: RFValue(11),
    fontFamily: "medium",
    color: "#666",
  },
  priceValue: {
    fontSize: RFValue(11),
    fontFamily: "bold",
    color: "#3f3f3fff",
  },
  line: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: RFValue(10),
  },
  rateOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rateCard: {
    flex: 0.48,
    backgroundColor: "#f9f9f9",
    padding: RFValue(12),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  rateLabel: {
    fontSize: RFValue(9),
    color: "#888",
    fontFamily: "medium",
  },
  rateValue: {
    fontSize: RFValue(14),
    color: "#1F305E",
    fontFamily: "bold",
    marginTop: 4,
  },
  contactContainer: {
    backgroundColor: "#f5f7fa",
    padding: RFValue(15),
    borderRadius: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: RFValue(11),
    fontFamily: "medium",
    color: "#3f3f3fff",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#1F305E",
    paddingVertical: RFValue(14),
    borderRadius: 12,
    marginTop: RFValue(30),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: RFValue(12),
    color: "#666",
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
  },
  retryText: {
    color: "#1F305E",
    fontFamily: "bold",
  },
});
