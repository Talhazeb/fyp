import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 20,
    padding: 20,
    border: 1,
    borderColor: "#000000",
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 14,
    color: "#666666",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#000000",
    borderTopWidth: 1,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

function InvoicePDF() {
  const data = JSON.parse(localStorage.getItem("invoiceMedicine"));

  let name = [];
  let price = [];
  let total = 0;
  const [products, setProduct] = React.useState([]);
  for (let i = 0; i < data.length; i++) {
    name.push(data[i].name);
    price.push(data[i].price["actualPrice"]);
    products.push({
      name: data[i].name,
      price: data[i].price["actualPrice"],
    });
  }
  for (let i = 0; i < price.length; i++) {
    total += parseFloat(price[i]);
  }

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.header}>
              <Image
                src="https://i.ibb.co/3fHcdxD/logo.png"
                style={styles.logo}
              />
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.heading}>Invoice</Text>
                <Text style={styles.subheading}>
                  {new Date().toDateString()}
                </Text>
                <Text style={styles.subheading}>
                  {new Date().toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Map and show it in tabular format */}
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  Name
                </Text>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  Price
                </Text>
              </View>
              {products.map((product, index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{product.name}</Text>
                    <Text style={styles.tableCell}>{product.price}</Text>
                </View>
                ))}
            </View>
                
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{total}</Text>
            </View>
            </View>
        </Page>
        </Document>
    </PDFViewer>
    );
}

export default InvoicePDF;