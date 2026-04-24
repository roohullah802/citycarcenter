import Slider from "@react-native-community/slider";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { Modalize } from "react-native-modalize";

interface FilterModalProps {
  onClose: () => void;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const BottomSheetFilterModal = React.memo(
  forwardRef<Modalize, FilterModalProps>(
    ({ onClose, setPriceRange, priceRange }, ref) => {
      const [localPrice, setLocalPrice] =
        useState<[number, number]>(priceRange);

      // Sync local state when global prop changes
      useEffect(() => {
        setLocalPrice(priceRange);
      }, [priceRange]);

      const handleApplyFilters = useCallback(() => {
        setPriceRange(localPrice);
        onClose();
      }, [localPrice, onClose, setPriceRange]);

      const clearFilter = () => {
        const defaultRange: [number, number] = [1, 1000];
        setLocalPrice(defaultRange);
        setPriceRange(defaultRange);
      };

      return (
        <Modalize
          ref={ref}
          adjustToContentHeight
          modalStyle={styles.modal}
          handlePosition="inside"
          handleStyle={styles.modalHandle}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>Filter Price</Text>
              <TouchableOpacity onPress={clearFilter} activeOpacity={0.6}>
                <Text style={styles.clearText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Price Range Section */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Daily Rate</Text>
                <View style={styles.badge}>
                  <Text style={styles.rangeIndicator}>
                    Up to ${localPrice[1]}
                  </Text>
                </View>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={1000}
                step={10}
                minimumTrackTintColor="rgba(31, 48, 94, 0.88)"
                maximumTrackTintColor="#F1F5F9"
                thumbTintColor="rgba(31, 48, 94, 0.88)"
                value={localPrice[1]}
                onValueChange={(value) => setLocalPrice([1, value])}
              />

              <View style={styles.sliderLabels}>
                <Text style={styles.minMax}>$1</Text>
                <Text style={styles.minMax}>$1,000+</Text>
              </View>
            </View>

            <Text style={styles.helperText}>
              Adjust the slider to find vehicles within your daily budget.
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
              activeOpacity={0.9}
            >
              <Text style={styles.applyButtonText}>Apply Price Range</Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      );
    },
  ),
);

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginBottom: 20,
  },
  modalHandle: {
    backgroundColor: "#E2E8F0",
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
    letterSpacing: -0.5,
  },
  clearText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
  section: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  rangeIndicator: {
    fontSize: 15,
    fontWeight: "800",
    color: "rgba(31, 48, 94, 0.88)",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  minMax: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 32,
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: "rgba(31, 48, 94, 0.88)",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(31, 48, 94, 0.88)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default BottomSheetFilterModal;
