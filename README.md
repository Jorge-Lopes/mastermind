# Mastermind Game

## Overview

Welcome to the Mastermind Game project!  

This project was a learning exercise in building and deploying a game on the [Agoric](https://agoric.com/) blockchain, as well as building an User Interface to connect an wallet, query the smart contract state and build and sign transactions.  

At this version of Mastermind, the contract will act as the code maker, which will generate a sequence of four colored pegs from a set of 6 available colors. The sequence (secret code) is kept hidden from the user until it wins or loses the game. The user, code breaker, is allowed to make a guess of four colored pegs in a specific order and will receive a feedback in return.  
The game is finished when the codebreaker guesses the exact sequence, or if it cannot guess the code within the given 10 attempts.
  
  
![Screenshot](Mastermind_Screenshot.png "mastermind")

## Features

- **Create New Game**: Users can create new games by pressing the respective button.
- **Guess The Code**: Users can submit guesses, where each guess is checked against the secret code.
- **Feedback Mechanism**: For each guess, feedback is provided:
  - **Black Color**: Represents correct values in the correct position.
  - **Red Color**: Represents correct values in the wrong position.
- **Game Phases**: The game phase can be either:
  - **Active**: The game is in progress, and users can continue making guesses.
  - **Completed**: The user has won the game by guessing the correct code.
  - **Failed**: The user has lost the game by exhausting all attempts without guessing the correct code.

## Secret Code

The secret code of each new game is generated via the [Mersenne-Twister](https://www.npmjs.com/package/mersenne-twister) package, which is a pseudorandom number generator.

At the `generateSecretCode` function, a new instance of the Mersenne Twister generator is created and initialized, being the `seed` the `timestamp` of the moment the `makeGameHandle` is executed on chain.
This function is needed to generate a 4-digit secret code, using generator.random() to produce a number between 0 and 5. The size of the code and the range of values can be easily adjusted within the generateSecretCode function.

NOTE: an interesting update would be exposing a method to change the structure of the secretCode via the contract `creatorFacet`

**IMPORTANT**:

- The seed is used to initialize the random number generator can be extracted from the chain logs, making the random number sequence predictable for anyone running a node.
- The secret code is currently being written to `vstorage` at the moment a game is initiated, in order to make it easier to test it. This should be updated to expose its value only if the game phase is not "active".

## Getting Started

Detailed instructions on setting up the environment, including a video walkthrough, are available at the [Your First Agoric Dapp](https://docs.agoric.com/guides/getting-started/) tutorial.  
If you already have the environment set up (i.e., the correct versions of Node.js, Yarn, Docker, and the Keplr wallet), follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Jorge-Lopes/mastermind.git
   cd mastermind
   ```

2. **Install Dependencies**:

   ```bash
   yarn install
   ```

   _Downloading all the required dependencies may take several minutes. The UI depends on the React framework, and the contract depends on the Agoric framework. The packages in this project also include development dependencies for testing, code formatting, and static analysis._

3. **Start Local Agoric Blockchain**:

   ```bash
   cd contract
   yarn start:docker
   ```

4. **Check Logs**:

   ```bash
   cd contract
   yarn docker:logs
   ```

5. **Start the Smart Contract**:

   ```bash
   cd contract
   yarn start:contract
   ```

6. **Start the UI**:

   ```bash
   cd ui
   yarn dev
   ```

   Use the link provided in the output to load the smart contract UI in your browser.

7. **Connect the Wallet**:

   Follow this [guide](https://docs.agoric.com/guides/getting-started/#setting-up-a-keplr-wallet-demo-account) to set up a Keplr Wallet for this demo.  
   After completing the steps above, click on `Connect Wallet` at the Mastermind UI.

## Testing

To run the unit tests:

```bash
cd contract
yarn test
```

## Contributing

Feel free to submit issues or pull requests.  
Contributions are welcome to improve the game or extend its features.

---

Thank you for exploring this repo and have fun playing Mastermind!
