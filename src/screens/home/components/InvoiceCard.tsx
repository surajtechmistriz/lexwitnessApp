import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { downloadInvoicePdf } from "../../Invoice/invoiceDownload";

export default function InvoiceCard({ item }) {
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
    return { bg: "#f3f4f6", text: "#4b5563", label: item.status };
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
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  const status = getStatusStyles();
  const purchase = getPurchaseTypeStyle();

  return (
    <View style={styles.card}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.planName}>{item.plan?.name} Plan</Text>
          <Text style={styles.dateText}>
            {item.start_date} → {item.end_date}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* AMOUNT ROW */}
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.amount}>₹{item.total_amount}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.subText}>₹{item.tax_amount}</Text>
        </View>
      </View>

      {/* PURCHASE TYPE (🔥 IMPROVED) */}
      <View style={styles.purchaseRow}>
        <Text style={styles.label}>Purchase Type</Text>

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
        <View style={styles.infoBoxActive}>
          <Text style={styles.infoTextActive}>
            ● Active subscription
          </Text>
        </View>
      )}

      {/* UPCOMING */}
      {item.next_subscription_id && (
        <View style={styles.infoBoxUpcoming}>
          <Text style={styles.infoTextUpcoming}>
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
          loading && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#c9060a" />
        ) : (
          <Text style={styles.downloadBtnText}>
            Download Invoice
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
/* ---------------- STYLES ---------------- */

const BRAND_RED = "#c9060a";
const DARK_TEXT = "#333333";
const GRAY_TEXT = "#666666";
const LIGHT_GRAY = "#f3f4f6";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
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
    color: DARK_TEXT,
  },

  dateText: {
    fontSize: 13,
    color: GRAY_TEXT,
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
    backgroundColor: LIGHT_GRAY,
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 2,
  },
  amount: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_RED,
    paddingTop: 2,
    
  },
  purchase: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginTop: 2,
  },

  type: {
    fontSize: 12,
    fontWeight: "800",
    color: BRAND_RED,
  },

  subText: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_TEXT,
  },

  infoBoxActive: {
    backgroundColor: "#e6f9f0",
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },

  infoTextActive: {
    color: "#0f5132",
    fontSize: 12,
    fontWeight: "600",
  },

  infoBoxUpcoming: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },

  infoTextUpcoming: {
    color: "#1e40af",
    fontSize: 12,
    fontWeight: "600",
  },

  downloadBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: BRAND_RED,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  downloadBtnText: {
    color: BRAND_RED,
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