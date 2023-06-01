import { assignDrivers } from './assign-drivers';
function fatal(msg: string) {
  throw new Error(msg);
}

interface Options {
  command: string;
  dtPath: string;
  drPath: string;
}
export async function run(options: Options) {
  if (!options) {
    fatal('Options are required');
  }
  switch (options.command) {
    case 'check':
      console.log('check');
      return;
    case 'assign-drivers':
      await assignDrivers(options);
      return;
    default:
      fatal(`Unknown command: ${options.command}`);
  }
}
