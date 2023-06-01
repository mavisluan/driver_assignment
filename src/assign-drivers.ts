import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const createDriversAndAddressArrays = (options: { dtPath: string; drPath: string }) => {
  const { dtPath: destinationsPath, drPath: driversPath } = options;
  const readFileLines = (filename: string) => fs.readFileSync(filename).toString('utf8').split('\n');
  const destinations = readFileLines(path.join(__dirname, destinationsPath));
  const drivers = readFileLines(path.join(__dirname, driversPath));

  return { destinations, drivers };
};

export function assignDrivers(options: { dtPath: string; drPath: string }) {
  if (!options.dtPath || !options.drPath) {
    throw new Error('dtPath and drPath are required to run assign-drivers command');
  }

  const { destinations, drivers } = createDriversAndAddressArrays(options);
  console.log('🚀 ~ file: assign-drivers.ts:20 ~ assignDrivers ~ drivers:', drivers);
  console.log('🚀 ~ file: assign-drivers.ts:20 ~ assignDrivers ~ destinations:', destinations);
}
