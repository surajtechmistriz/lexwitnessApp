import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { downloadInvoiceApi } from "./invoice";
import { Buffer } from "buffer";

import { AppState } from "react-native";

export const downloadInvoicePdf = async (id: number) => {
  try {
    console.log("Downloading invoice:", id);

    const res = await downloadInvoiceApi(id);

    console.log("API Response:", res);
    console.log("Headers:", res.headers);
    console.log("Content-Type:", res.headers["content-type"]);
    console.log("Data:", res.data);

    // check if response is pdf
    if (
      !res.headers["content-type"]?.includes("pdf")
    ) {
      console.log("Not a PDF response");

      // try to decode response
      try {
        const text = Buffer.from(res.data).toString();
        console.log("Response text:", text);
      } catch (e) {
        console.log("Cannot parse response");
      }

      return;
    }

    const base64 = Buffer.from(res.data, "binary").toString(
      "base64"
    );

    console.log("Base64 created");

    const path =
      RNFS.DocumentDirectoryPath + `/invoice-${id}.pdf`;

    console.log("Saving path:", path);

    await RNFS.writeFile(path, base64, "base64");

    console.log("PDF saved");

    const exists = await RNFS.exists(path);

    console.log("File exists:", exists);

    if (AppState.currentState !== "active") {
      console.log("App not active, skipping open");
      return path;
    }

    setTimeout(() => {
      FileViewer.open(path)
        .then(() => {
          console.log("PDF opened");
        })
        .catch((err) => {
          console.log("File open error:", err);
        });
    }, 300);

    return path;
  } catch (err) {
    console.error("Download failed:", err);

    if (err.response) {
      console.log("Error response:", err.response.data);
      console.log("Error status:", err.response.status);
    }

    throw err;
  }
};