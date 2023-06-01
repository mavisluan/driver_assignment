import { program } from "commander";

import * as main from "./main";

(async () => {
  try {
    program
      .version("1.0.0")
      .option("--command <command>", "command to run", "check")
      .parse(process.argv);

    await main.run(program.opts());
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
