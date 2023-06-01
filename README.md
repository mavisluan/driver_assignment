# driver_assignment

Command line tool for assigning drivers to destinations in an optimized way

## Installation

    $ npm install -g

## Build and Run Locally

    $ npm run build
    $ node build/index.js --help
    Usage: index [options]

    Options:
    -V, --version                output the version number
    --command <command>          command to run (default: "check")
    -h, --help                   display help for command

## Commands

### Check
    Check if your installation and configuration are done correctly

    Run the command below and see 'check' with not error 
    $ node build/index.js --command=check


### Assign Drivers
    Before running the script
    
    inputFiles folder
    Add destinations.txt and drivers.txt file to inputFiles folder 
    (You can name the files however you want. Just make sure you refer to the right file paths on option --dtPath and --drPath )

    OPTIONS:
    --dtPath AND --drPath are required on this command

    Output the result in a separate file
    - By default, the result will be logged out in the console
    - Run command with > <file.txt> in the end to output the result in the file
    - The output file can be found in the root folder

    Examples:
     $ node build/index.js --command assign-drivers  --dtPath '../inputFiles/destinations.txt' --drPath '../inputFiles/drivers.txt' > result.txt
