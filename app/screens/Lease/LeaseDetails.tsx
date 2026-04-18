import { rateOptionsDetails } from "@/folder/rateOptions";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const LeaseDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [lease, setLease] = useState<any>({
    status: "active",
  });
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    if (lease?.startDate && lease?.endDate) {
      const start = new Date(lease.startDate).getTime();
      const end = new Date(lease.endDate).getTime();
      const diff = end - start;
      const calculatedDays = Math.round(diff / (24 * 60 * 60 * 1000));
      setDays(calculatedDays);
    }
  }, [lease?.startDate, lease?.endDate]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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
                    <Text style={styles.dropdownText}>Payment Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Lease Info */}
          <Text style={styles.sectionTitle}>Lease Info:</Text>
          <InfoRow
            label="Status:"
            value={lease.status}
            valueStyle={[
              styles.statusActive,
              lease.status === "active"
                ? { color: "green" }
                : lease.status === "expired"
                  ? { color: "red" }
                  : {},
            ]}
          />
          <InfoRow label="Lease Type:" value="Limited Miles Lease" />
          <InfoRow label="Daily Miles:" value="2000" />
          <InfoRow label="Duration:" value={`${days || "N/A"} days`} />
          <InfoRow label="Lease Start Date:" value={"00//00/00"} />
          <InfoRow label="Lease End Date:" value={"00/00/00"} />

          {/* Miles Info */}
          <Text style={styles.sectionTitle}>Miles:</Text>
          <View style={styles.rateOptions}>
            {rateOptionsDetails.map((option, index) => (
              <View key={index} style={styles.rateCard}>
                <Text style={styles.rateLabel}>{option.label}</Text>
                <Text style={styles.rateValue}>{option.value}</Text>
              </View>
            ))}
          </View>

          {/* Car Info */}
          <Text style={styles.sectionTitle}>Car Info:</Text>
          <InfoRow label="Brand:" value={"bmw"} />
          <InfoRow label="Car:" value={"bmw cc2"} />
          <InfoRow label="Price Per Day:" value={"12"} />
          <InfoRow label="Miles:" value={"2222"} />

          {/* Contact Info */}
          <Text style={styles.sectionTitle}>Contact Us:</Text>
          <View style={styles.contactRow}>
            <Icon name="call" size={22} color="#1F305E" />
            <Text style={styles.contactText}>+9234567673338</Text>
          </View>
          <View style={[styles.contactRow, styles.contactRowMargin]}>
            <Icon name="mail" size={22} color="#1F305E" />
            <Text style={styles.contactText}>
              Citycarcenterarizona@gmail.com
            </Text>
          </View>

          {/* Extend Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/screens/Lease/ExtendLease",
                params: { id: lease?._id },
              })
            }
          >
            <Text style={styles.buttonText}>Extend Lease</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const InfoRow = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: any;
  valueStyle?: any;
}) => (
  <>
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={[styles.priceValue, valueStyle]}>{value}</Text>
    </View>
    <View style={styles.line} />
  </>
);

export default LeaseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(15),
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 10 : 30,
  },
  scrollContent: {
    padding: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: RFValue(10),
    marginTop: 10,
  },
  backButton: {
    paddingRight: RFValue(10),
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontFamily: "bold",
    color: "#3f3f3fff",
  },
  menuWrapper: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    top: RFValue(28),
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    minWidth: RFValue(120),
  },
  dropdownItem: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    color: "#3f3f3fff",
  },
  dropdownText: {
    fontFamily: "demiBold",
    fontSize: RFValue(11),
    color: "#3f3f3fff",
  },
  sectionTitle: {
    fontFamily: "bold",
    fontSize: RFValue(12),
    marginTop: RFValue(20),
    marginBottom: RFValue(10),
    color: "#3f3f3fff",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFValue(10),
  },
  priceLabel: {
    fontSize: RFValue(10),
    fontFamily: "demiBold",
    color: "#3f3f3fff",
  },
  priceValue: {
    fontSize: RFValue(10),
    fontFamily: "demiBold",
    color: "#3f3f3fff",
  },
  statusActive: {
    color: "green",
  },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    marginVertical: RFValue(8),
  },
  rateOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(10),
  },
  rateCard: {
    flex: 1,
    marginHorizontal: RFValue(5),
    backgroundColor: "#eef5ff",
    borderRadius: RFValue(10),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(8),
    alignItems: "center",
    justifyContent: "center",
  },
  rateLabel: {
    fontSize: RFValue(10),
    color: "#3f3f3fff",
    textAlign: "center",
    marginBottom: RFValue(4),
    fontFamily: "demiBold",
  },
  rateValue: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#3f3f3fff",
    fontFamily: "demiBold",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactRowMargin: {
    marginTop: RFValue(10),
  },
  contactText: {
    color: "#3f3f3fff",
    fontSize: RFValue(10),
    fontFamily: "demiBold",
  },
  button: {
    backgroundColor: "#73C2FB",
    paddingVertical: RFValue(14),
    borderRadius: RFValue(10),
    alignItems: "center",
    marginTop: RFValue(30),
    marginBottom: RFValue(20),
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontWeight: "500",
    fontFamily: "demiBold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontFamily: "medium",
  },
});
