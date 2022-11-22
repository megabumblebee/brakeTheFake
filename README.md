## Genesis
This is a project created during the 24-hours `HackYeah 2022` hackathon by me and one participant.

After the event, I just refactored and arranged the code calmly.

However, everything is the result of our 24-hour continuous work.

## Description

The application is designed to download news from RSS channels and assess the probability that the information is true or false.

In addition, the application examines the sentiment of the news (the authors using of emotions).

## Legit / fake factor
Our factor has components of 5 parts with specific weights:
- trust factor from source - 40%
- trust factor from users - 20%
- fake / legit words - 20%
- neutral sentiment - 10%
- reference to authority - 10%

You can freely change the weights in the settings.

### 1. Trust factor from source
The most important thing in the assessment is the source of the news.
The more trusted the source (the better the truthfulness record), is the greater the chance that the next message will be true.

### 2. Trust factor from users
In any algorithm, human help would be useful.

Therefore, we assume that trusted users (checkers) will be able to evaluate each news, what are their feelings regarding the truthfulness of the news.

### 3. Fake / legit words
Database of word would be very useful for assessment words.

In every language there are words that can hint/indicate an increased probability that something is true or false.

### 4. Neutral sentiment
The more emotions the creator puts into his words, the greater the chance that the news is subjective.

It is about thoughts, not facts.

### 5. Reference to authority
Referring to institutions, companies, people by mentioning their names increases the chances that the author is conveying a proven message.

## Machine learning element
Every 24 hours, the system checks how much news from the source turned out to be fake or legit and adds or subtracts legitimacy points for source - the most important evaluator.

## Own settings for algorithm
In file `src/config/app.config.ts` you can change all values for the algorithm.

In folder `data` you can change all data which the algorithm processing.

## Environment and using tools

- nest.js
- TypeORM
- MySQL


- cheerio
- polish-sentiment
- jsonwebtoken

# How to test application
1. Create a MySQL database `break-the-fake` or change name of database in `.env` file
2. Open code with IDE
3. `npm i` - install all packages
4. `nest start --watch` - start the server on [http://localhost:3001](http://localhost:3001)
5. Make some data - just open the right links -> details in end-points 😎
6. App is working and every minute will download news to database.
7. Enjoy!

## End-points

### Creating data
#### [http://localhost:3001/source/my-secret-path/create-sources](http://localhost:3001/source/my-secret-path/create-sources) - GET
This will create news sources by file `/src/data/sources.js`

---

#### [http://localhost:3001/source/my-secret-path/create-categories](http://localhost:3001/source/my-secret-path/create-categories) - GET
This will create categories by file `/src/data/categories.js`

---

#### [http://localhost:3001/user/create-users](http://localhost:3001/user/create-users) - GET
This will create users by file `/src/data/users.js`

---

#### [http://localhost:3001/user/create-tags](http://localhost:3001/user/create-tags) - GET
This will create tags by file `/src/data/tags.js`

---
### Authorization


#### [http://localhost:3001/auth/login](http://localhost:3001/auth/login) - POST

body in JSON - _**remember**: true - logging for 1 year, false - logging for 24h_
````
{
	"username": "admin",
	"pwd": "admin",
	"remember": true
}
````
````
{
	"username": "user",
	"pwd": "user",
	"remember": false
}
````
---
#### [http://localhost:3001/auth/logout](http://localhost:3001/auth/logout) - GET

**authorization check** - you can logout only logged account

---

### Working with data

#### [http://localhost:3001/news/](http://localhost:3001/news/) - GET

#### The basic functionality of the application - downloading news
**authorization check** - you must be logged in at least with a user account

#### Response:
````
[{
    // below value 0 ~ 1 // 0 = totally fake // 1 - tottaly legit
    sourceFactor: number,
    legitimacyFactor: number,
    authorityFactor: number,
    sentimentFactor: number,
    userFactor: number | null, // null - user not response yet
}, ...
]
````

---

#### [http://localhost:3001/news/my-secret-path/force-download/](http://localhost:3001/news/my-secret-path/force-download/) - GET
Forced downloading of messages outside the specified time period

---

#### [http://localhost:3001/news/my-secret-path/force-update-sources/](http://localhost:3001/news/my-secret-path/force-update-sources/) - GET

Forced assessing the credibility of sources beyond the specified time period