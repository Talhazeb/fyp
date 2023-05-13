import React from "react";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Svg,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

function Pdf() {
  const data = JSON.parse(localStorage.getItem("transcriptionData"));
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Image
            src="https://i.ibb.co/3fHcdxD/logo.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Transcription Summary</Text>
          <Text style={styles.subtitle}>
            {new Date().toDateString()} at {new Date().toLocaleTimeString()}
          </Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Transcription Text:</Text>{" "}
              {data}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default Pdf;
