import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { maxWeightAssign } from 'munkres-algorithm';

// Read the new line separated files and create the arrays
const createDriversAndAddressArrays = (options: { dtPath: string; drPath: string }) => {
  const { dtPath: destinationsPath, drPath: driversPath } = options;
  const readFileLines = (filename: string) => fs.readFileSync(filename).toString('utf8').split('\n');
  const destinations = readFileLines(path.join(__dirname, destinationsPath));
  const drivers = readFileLines(path.join(__dirname, driversPath));

  return { destinations, drivers };
};

// This function removes the street number from the address and return street name only
const removeStreetNumber = (destination: string): string => {
  const street = destination.split(',')[0];
  const regex = /^\d+\s+/;

  const streetName = street.replace(regex, '');
  return streetName;
};

// Calculate Base SS
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
  // Calculates the factors of a number without 1 because we don't consider 1 as a common factor in calculating SS
  const calculateFactorsWithoutOne = (num: number): number[] => {
    const factors = [];
    for (let i = 2; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  if (addressLength % driverLength === 0) return true;

  const addressFactors = calculateFactorsWithoutOne(addressLength);
  const driverFactors = calculateFactorsWithoutOne(driverLength);
  const hadCommonFactor = _.intersection(addressFactors, driverFactors).length > 0;
  return hadCommonFactor;
};

const calculateSS = (address: string, driver: string): number => {
  const { addressLength, driverLength, driverVowels, driverConsonants } = createCalculateSSElements(address, driver);

  const baseSS = calculateBaseSS({ addressLength, driverVowels, driverConsonants });
  const isCommon = hasCommonFactor({ addressLength, driverLength });

  if (isCommon) return baseSS * 1.5;
  return baseSS;
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

// TODO: Add tests and optimize the calculations
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