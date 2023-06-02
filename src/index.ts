import { program } from 'commander';

import * as main from './main';

(async () => {
  try {
    program
      .version('1.0.0')
      .option(
        '--dtPath <destinationsPath>',
        'The path to read destinations input files, required on assign-drivers command'
      )
      .option('--drPath <driversPath>', 'The path to read drivers input files, required on assign-drivers command')
      .parse(process.argv);

    await main.run(program.opts());
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
