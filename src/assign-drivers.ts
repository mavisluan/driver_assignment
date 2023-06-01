import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { maxWeightAssign } from 'munkres-algorithm';

// Read the new line separated files and create the arrays
const createDriversAndAddressArrays = (options: { dtPath: string; drPath: string }) => {
  const { dtPath: destinationsPath, drPath: driversPath } = options;
  const readFileLines = (filename: string) => fs.readFileSync(filename).toString('utf8').split('\n');
  const destinations = _.uniq(readFileLines(path.join(__dirname, destinationsPath)));
  const drivers = _.uniq(readFileLines(path.join(__dirname, driversPath)));

  return { destinations, drivers };
};

// This function removes the street number from the address and return street name only
const removeStreetNumber = (destination: string): string => {
  const street = destination.split(',')[0];
  const regex = /^\d+\s+/;

  const streetName = street.replace(regex, '');
  return streetName;
};

type SSElements = {
  addressLength: number;
  driverLength: number;
  driverVowels: number;
  driverConsonants: number;
};

// This function calculates the elements needed to calculate the base SS
const createCalculateSSElements = (addressName: string, driverName: string): SSElements => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const addressLength = addressName.length;
  const driverLength = driverName.length;

  let driverVowels = 0;
  driverName.split('').forEach((char) => {
    if (vowels.includes(char.toLowerCase())) driverVowels++;
  });

  const driverConsonants = driverLength - driverVowels;

  return { addressLength, driverLength, driverVowels, driverConsonants };
};

// This function calculates the base SS
const calculateBaseSS = ({
  addressLength,
  driverVowels,
  driverConsonants,
}: Omit<SSElements, 'driverLength'>): number => {
  if (addressLength % 2 === 0) {
    return driverVowels * 1.5;
  } else {
    return driverConsonants;
  }
};

// This function checks if the address length and driver length have a common factor
const hasCommonFactor = ({
  addressLength,
  driverLength,
}: Pick<SSElements, 'addressLength' | 'driverLength'>): boolean => {
  if (addressLength % driverLength === 0) return true;

  type FactorsMap = Map<number, number[]>;
  const factors: FactorsMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/factors.json'), 'utf8'));
  const factorsTwoToHundredMap = new Map(factors);
  const addressFactors = factorsTwoToHundredMap.get(addressLength);
  const driverFactors = factorsTwoToHundredMap.get(driverLength);
  const hadCommonFactor = _.intersection(addressFactors, driverFactors).length > 0;
  return hadCommonFactor;
};

const calculateSS = (address: string, driver: string): number => {
  const { addressLength, driverLength, driverVowels, driverConsonants } = createCalculateSSElements(address, driver);
  // cache is used to store the calculated SS for each address length and base SS to
  // avoid rechecking isCommonFactor and recalculating the SS
  const cache: { [key: string]: { [key: string]: number } } = {};

  const baseSS = calculateBaseSS({ addressLength, driverVowels, driverConsonants });
  if (cache[addressLength] && cache[addressLength][baseSS]) return cache[addressLength][baseSS];

  const isCommon = hasCommonFactor({ addressLength, driverLength });
  const finalSS = isCommon ? baseSS * 1.5 : baseSS;
  cache[addressLength] = { [baseSS]: finalSS };
  return finalSS;
};

const calculateAllPossibleSSArray = (destinations: string[], drivers: string[]): number[][] => {
  const addressNames: string[] = destinations.map((destination) => removeStreetNumber(destination));
  const ssArray: number[][] = Array.from({ length: addressNames.length }, () =>
    Array.from({ length: drivers.length }, () => 0)
  );

  addressNames.forEach((address, row) => {
    drivers.forEach((driver, col) => {
      const ss = calculateSS(address, driver);
      ssArray[row][col] = ss;
    });
  });

  return ssArray;
};

type MatchingDriversAndDestinationsType = {
  [key: string]: string;
};

export function assignDrivers(options: { dtPath: string; drPath: string }): void {
  if (!options.dtPath || !options.drPath) {
    throw new Error('dtPath and drPath are required to run assign-drivers command');
  }

  const { destinations, drivers } = createDriversAndAddressArrays(options);
  const SSArray = calculateAllPossibleSSArray(destinations, drivers);

  const { assignments: optimalAssignments, assignmentsWeight: totalSS } = maxWeightAssign(SSArray);
  const matchingDriversAndDestinations: MatchingDriversAndDestinationsType = {};

  optimalAssignments.forEach((driverIndex, destinationIndex) => {
    const destination = destinations[destinationIndex];
    const driver = drivers[driverIndex as number];
    matchingDriversAndDestinations[destination] = driver;
  });

  console.log('Total SS: ', totalSS);
  console.log('Matching Drivers and Destinations: ', matchingDriversAndDestinations);
}
