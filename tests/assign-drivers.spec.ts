import { assignDrivers } from '../src/assign-drivers';
import { expect } from 'chai';
describe('assignDrivers', () => {
  const dtPath = 'tests/data/destinations.txt';
  const drPath = 'tests/data/drivers.txt';

  it('should assign drivers to destinations', async () => {
    const { totalSS, matchingDriversAndDestinations } = await assignDrivers({ dtPath, drPath });

    expect(totalSS).to.equal(40);
    expect(matchingDriversAndDestinations).to.deep.equal({
      '123 Fake Street, San Diego, CA, 92128': 'Kelly Johnson',
      '234 Franklin Street, Carborro, NC, 70214': 'John Smith',
      '345 Main Road, San Jose, CA, 92123': 'Mary  Doe',
      '456 Jelly Road, San Jose, CA, 94017': 'Cindy Williams',
    });
  });
});
