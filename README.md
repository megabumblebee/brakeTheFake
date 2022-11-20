## Description

The application is designed to download news from RSS channels and assess the probability that the information is true or false.

## Legit / fake factor
Our factor has components with specific weights:
- trust factor from source - 40%
- trust factor from user - 20%
- fake / legit words - 20%
- neutral sentiment - 10%
- reference to authority - 10%

## Mashine learning element
Every 24 hours, the system checks how many news from the source turned out to be fake or legit and adds or subtracts legitimacy points for source - the most important evaluator.


## Environment

- nest.js
- TypeORM
- MySQL
- React.js