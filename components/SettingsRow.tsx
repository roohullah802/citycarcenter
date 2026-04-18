import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";

type SettingsRowProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <Icon name={icon} size={22} color="#444" />
      <Text style={styles.rowLabel} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
    </View>
    <Icon name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: RFValue(14),
    paddingVertical: RFValue(14),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowLabel: {
    fontSize: RFValue(13),
    color: "black",
    marginLeft: RFValue(12),
    flexShrink: 1,
    fontFamily: "demiBold",
  },
});
