# ABI Helper
Fetches ABI information from a Etherscan-compatible block explorer and outputs the decoded call information in a human-readable form.

## Installation
Simply install the dependencies using yarn:
```shell
yarn
```

## Usage
The application is started like a normal NodeJS application:
```shell
yarn start
```

The application will prompt you for these two values:
#### contractAddress
The contract address that is being called.

### data
The input data to the call, prefixed with 0x.
