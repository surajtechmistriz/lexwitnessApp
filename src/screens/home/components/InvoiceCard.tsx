import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { downloadInvoicePdf } from "../../Invoice/invoiceDownload";
import { useTheme } from "../../../redux/useTheme";

export default function InvoiceCard({ item }) {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const isPending = item.status === "PENDING";
  const isActive = item.status === "ACTIVE";

  const subId = item.transaction?.subscription_id || item.id;

  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadInvoicePdf(subId);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = () => {
    if (isActive) return { bg: "#e6f9f0", text: "#0f5132", label: "Active" };
    if (isPending) return { bg: "#fff7ed", text: "#9a3412", label: "Pending" };
    return { bg: colors.border, text: colors.textMuted, label: item.status };
  };

  const getPurchaseTypeStyle = () => {
    switch (item.purchase_type) {
      case "NEW":
        return { bg: "#e0f2fe", text: "#075985" };
      case "RENEW":
        return { bg: "#dcfce7", text: "#166534" };
      case "UPGRADE":
        return { bg: "#fef3c7", text: "#92400e" };
      default:
        return { bg: colors.border, text: colors.textMuted };
    }
  };

  const status = getStatusStyles();
  const purchase = getPurchaseTypeStyle();

  return (
    <View style={[styles.card, { 
      backgroundColor: colors.card,
      shadowColor: isDark ? '#000' : '#000',
    }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.planName, { color: colors.text }]}>
            {item.plan?.name} Plan
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {item.start_date} → {item.end_date}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* AMOUNT ROW */}
      <View style={styles.row}>
        <View>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Total Amount
          </Text>
          <Text style={[styles.amount, { color: colors.primary }]}>
            ₹{item.total_amount}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Tax
          </Text>
          <Text style={[styles.subText, { color: colors.text }]}>
            ₹{item.tax_amount}
          </Text>
        </View>
      </View>

      {/* PURCHASE TYPE */}
      <View style={styles.purchaseRow}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Purchase Type
        </Text>

        <View
          style={[
            styles.purchaseBadge,
            { backgroundColor: purchase.bg },
          ]}
        >
          <Text
            style={[
              styles.purchaseText,
              { color: purchase.text },
            ]}
          >
            {item.purchase_type}
          </Text>
        </View>
      </View>

      {/* ACTIVE INFO */}
      {isActive && (
        <View style={[styles.infoBoxActive, { backgroundColor: "#e6f9f0" }]}>
          <Text style={[styles.infoTextActive, { color: "#0f5132" }]}>
            ● Active subscription
          </Text>
        </View>
      )}

      {/* UPCOMING */}
      {item.next_subscription_id && (
        <View style={[styles.infoBoxUpcoming, { backgroundColor: "#eff6ff" }]}>
          <Text style={[styles.infoTextUpcoming, { color: "#1e40af" }]}>
            Next plan scheduled
          </Text>
        </View>
      )}

      {/* DOWNLOAD */}
      <TouchableOpacity
        onPress={handleDownload}
        disabled={loading}
        style={[
          styles.downloadBtn,
          { borderColor: colors.primary },
          loading && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={[styles.downloadBtnText, { color: colors.primary }]}>
            Download Invoice
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
  },

  dateText: {
    fontSize: 13,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    marginBottom: 2,
  },

  amount: {
    fontSize: 20,
    fontWeight: "800",
    paddingTop: 2,
  },

  subText: {
    fontSize: 14,
    fontWeight: "600",
  },

  infoBoxActive: {
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },

  infoTextActive: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoBoxUpcoming: {
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },

  infoTextUpcoming: {
    fontSize: 12,
    fontWeight: "600",
  },

  downloadBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  downloadBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },

  purchaseRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  purchaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  purchaseText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});