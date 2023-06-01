function fatal(msg: string) {
  throw new Error(msg);
}

export async function run(options: any) {
  switch (options.command) {
    case "check":
      console.log('check');
      return;
   
    default:
      fatal(`Unknown command: ${options.command}`);
  }
}