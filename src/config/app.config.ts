// news download frequency - in minutes
export const newsFrequency = 5;

// if there is false - the algorithm will not save to the database news that cannot be assigned a category
export const savingWithoutCategories = true;

export const factorWeights = {
  'source': 0.4,
  'legitimacy': 0.2,
  'users': 0.2,
  'sentiment': 0.1,
  'authority': 0.1,
}

// in Polish, words have their conjugations, so we had to cut the endings to find the same word in a different conjugation
// this is the percentage of sliced letters in the word
// in languages without variations, e.g. in English, this factor can be set to 0

export const lettersToSlice = 0.25;