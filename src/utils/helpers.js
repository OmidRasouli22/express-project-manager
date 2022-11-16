const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashString = (str) => {
  const salt = bcrypt.genSaltSync(10);
  const hashStr = bcrypt.hashSync(str, salt);

  return hashStr;
};

const checkHashString = (str, hash) => {
  return bcrypt.compareSync(str, hash);
};

const tokenGenerator = async (payload, options) => {
  const token = await jwt.sign(payload, config.jwt_secret_key, options);
  return token;
};

const tokenVerify = (token) => {
  let result = jwt.verify(token, config.jwt_secret_key);
  if (!result?.user_id) return false;

  return result.user_id;
};

const slugify = (string) => {
  let urlFriendlyString = "";

  // Initial clean up.
  string = string
    // Remove spaces from start and end.
    .trim()
    // Changes all characters to lower case.
    .toLowerCase()
    // Remove symbols with a space.
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ");

  // Special characters and the characters they will be replaced by.
  const specialCharacters = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź";
  const replaceCharacters = "aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz";
  // Creates a regular expression that matches all the special characters
  // from the specialCharacters constant. Will make something like this:
  // /à|á|ä/g and matches à or á or ä...
  const specialCharactersRegularExpression = new RegExp(
    specialCharacters.split("").join("|"),
    "g"
  );
  // Replaces special characters by their url friendly equivalent.
  string = string
    .replace(specialCharactersRegularExpression, (matchedCharacter) =>
      replaceCharacters.charAt(specialCharacters.indexOf(matchedCharacter))
    )
    .replace(/œ/g, "oe");

  // Only keeps Arabic, English and numbers in the string.
  const arabicLetters = "ىشغظذخثتسرقضفعصنملكيطحزوهدجبأاإآلإلألآؤءئة";
  const englishLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  for (let character of string) {
    if (character === " ") {
      urlFriendlyString += character;
      continue;
    }
    const characterIsURLFriendly = Boolean(
      arabicLetters.includes(character) ||
        englishLetters.includes(character) ||
        numbers.includes(character)
    );
    if (characterIsURLFriendly) urlFriendlyString += character;
  }

  // Clean up before text direction algorithm.
  // Replace multiple spaces with one space.
  urlFriendlyString = urlFriendlyString.replace(/\s+/g, "-");

  // Regular expression that matches strings that have
  // right to left direction.
  const isRightToLeft = /[\u0590-\u05ff\u0600-\u06ff]/u;
  // Makes an array of all the words in urlFriendlyString
  let words = urlFriendlyString.split("-");

  // Checks if urlFriendlyString is a unidirectional string.
  // Makes another array of boolean values that signify if
  // a string isRightToLeft. Then basically checks if all
  // the boolean values are the same. If yes then the string
  // is unidirectional.
  const stringIsUnidirectional = Boolean(
    words
      .map((word) => isRightToLeft.test(word))
      .filter((isWordRightToLeft, index, words) => {
        if (isWordRightToLeft === words[0]) return true;
        else return false;
      }).length === words.length
  );

  // If the string is unidirectional, there is no need for
  // it to pass through our bidirectional algorithm.
  if (stringIsUnidirectional) {
    return (
      urlFriendlyString
        // Replaces multiple hyphens by one hyphen
        .replace(/-+/g, "-")
        // Remove hyphen from start.
        .replace(/^-+/, "")
        // Remove hyphen from end.
        .replace(/-+$/, "")
    );
  }

  // Reset urlFriendlyString so we can rewrite it in the
  // direction we want.
  urlFriendlyString = "";
  // Add U+202B "Right to Left Embedding" character to the
  // start of the words array.
  words.unshift("\u202B");
  // Loop throught the values on the word array.
  for (let word of words) {
    // Concatinate - before every word (the first one will
    // be cleaned later on).
    urlFriendlyString += "-";
    // If the word isn't right to left concatinate the "Right
    // to Left Embedding" character before the word.
    if (!isRightToLeft.test(word)) urlFriendlyString += `\u202B${word}`;
    // If not then just concatinate the word.
    else urlFriendlyString += word;
  }

  return (
    urlFriendlyString
      // Replaces multiple hyphens by one hyphen.
      .replace(/-+/g, "-")
      // Remove hyphen from start.
      .replace(/^-+/, "")
      // Remove hyphen from end.
      .replace(/-+$/, "")
      // The character U+202B is invisible, so if it is in the start
      // or the end of a string, the first two regular expressions won't
      // match them and the string will look like it still has hyphens
      // in the start or the end.
      .replace(/^\u202B-+/, "")
      .replace(/-+\u202B$/, "")
      // Removes multiple hyphens that come after U + 202B
      .replace(/\u202B-+/, "")
  );
};

module.exports = {
  hashString,
  checkHashString,
  tokenGenerator,
  tokenVerify,
  slugify,
};
