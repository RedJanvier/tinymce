import { Fun, Id, Optional } from '@ephox/katamari';

import { isInProtectedMode } from './Mode';

const dataId = Id.generate('data');

const setData = (item: DataTransferItem, data: string): void => {
  const itemObj: any = item;
  itemObj[dataId] = data;
};

const getData = (item: DataTransferItem): Optional<string> => {
  const itemObj: any = item;
  return Optional.from(itemObj[dataId]);
};

const createDataTransferItemFromFile = (dataTransfer: DataTransfer, file: File): DataTransferItem => {
  const transferItem: DataTransferItem = {
    kind: 'file',
    type: file.type,
    getAsString: Fun.noop,
    getAsFile: () => {
      if (isInProtectedMode(dataTransfer) === false) {
        return file;
      } else {
        return null;
      }
    },

    // Not supported on all browsers but needed since the TS dom lib type has it
    webkitGetAsEntry: Fun.noop
  };

  return transferItem;
};

const createDataTransferItemFromString = (dataTransfer: DataTransfer, type: string, data: string): DataTransferItem => {
  const transferItem: DataTransferItem = {
    kind: 'string',
    type,
    getAsString: (callback) => {
      if (isInProtectedMode(dataTransfer) === false) {
        callback(data);
      }
    },
    getAsFile: Fun.constant(null),

    // Not supported on all browsers but needed since the TS dom lib type has it
    webkitGetAsEntry: Fun.noop
  };

  setData(transferItem, data);

  return transferItem;
};

export {
  createDataTransferItemFromFile,
  createDataTransferItemFromString,
  getData
};
