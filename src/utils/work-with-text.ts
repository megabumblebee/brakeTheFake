import {lettersToSlice} from "../config/app.config";

export const replaceWhiteChars = (text) => {
  const whiteChars = ',."():;!?';
  [...whiteChars].forEach(
    (whiteChars) => (text = text.replaceAll(whiteChars, ""))
  );
  text = text.replaceAll(" - ", " ");
  return text;
};

export const analyzeText = (searchingText, textToSearch) => {
  searchingText = replaceWhiteChars(searchingText)
    .toLowerCase()
    .split(" ")
    .map((word) => word.slice(0, word.length - Math.floor(word.length * lettersToSlice)));

  textToSearch = replaceWhiteChars(textToSearch)
    .toLowerCase()
    .split(" ");

  let isValid = true;
  searchingText.forEach((s) => {
    if (!textToSearch.find((word) => word.startsWith(s))) {
      isValid = false;
    }
  });
  return isValid;
};

export const analyzeTags = (searchingText, oldTopic) => {
  searchingText = replaceWhiteChars(searchingText)
    .toLowerCase()
    .split(" ")
    .map((word) => word.slice(0, word.length - Math.floor(word.length * lettersToSlice)));
  const topic = oldTopic.map((w) => w.toLowerCase());
  let result;
  searchingText.forEach((s) => {
    const word = topic.find((word) => word.startsWith(s));
    if (word) {
      result = oldTopic.find((w) => w.toLowerCase() === word);
    }
  });
  return result;
};

export const getTags = (text, tagsTest) => {
  const tagsInText = text.match(/(([A-Z]\w\s){2,})|(\w{6,})/g);
  if (tagsInText) {
    return [
      ...new Set(
        tagsInText.map((tag) => analyzeTags(tag, tagsTest)).filter((e) => e)
      ),
    ];
  } else {
    return [];
  }
};

export const calculateLegitimacy = (text, fakeWords, legitWords) => {
  const legitimacy = replaceWhiteChars(text)
    .toLowerCase()
    .split(" ")
    .reduce((acc, a) => {
      if (fakeWords.includes(a)) acc-=2;
      if (legitWords.includes(a)) acc++;
      return acc;
    }, 0);
  // 10% more for every good word and 20% less for every bad word
  const legFinal = 0.5 + legitimacy * 0.1;
  return legFinal > 1 ? 1 : legFinal < 0 ? 0 : legFinal;
};

export const calculateAuthority = (text) => {
  const names = text.match(/([A-Z])\w+\s([A-Z])\w+/g);
  if (names) {
    // every word give 2,5% more chance to legit
    return names.length * 0.025;
  }
  return 0;
};