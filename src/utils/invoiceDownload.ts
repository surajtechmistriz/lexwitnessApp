import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Buffer } from 'buffer';
import { AppState } from 'react-native';

import { downloadInvoiceApi } from '../services/invoice.service';

export const downloadInvoicePdf = async (id: number) => {
  try {
    const res = await downloadInvoiceApi(id);

    if (!res.headers['content-type']?.includes('pdf')) {
      if (__DEV__) {
        console.log('Not a PDF response');
        try {
          const text = Buffer.from(res.data).toString();
          console.log('Response text:', text);
        } catch {
          console.log('Cannot parse response');
        }
      }
      return;
    }

    const base64 = Buffer.from(res.data, 'binary').toString('base64');
    const path = RNFS.DocumentDirectoryPath + `/invoice-${id}.pdf`;

    await RNFS.writeFile(path, base64, 'base64');

    if (AppState.currentState !== 'active') {
      return path;
    }

    setTimeout(() => {
      FileViewer.open(path).catch(err => {
        if (__DEV__) {
          console.log('File open error:', err);
        }
      });
    }, 300);

    return path;
  } catch (err) {
    if (__DEV__) {
      console.error('Download failed:', err);
      const error = err as any;
      if (error?.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
      }
    }
    throw err;
  }
};
