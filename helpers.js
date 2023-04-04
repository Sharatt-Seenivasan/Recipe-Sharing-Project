import { ObjectId } from "mongodb";

const checkStr = (str, strName) => {
  if (!str) throw "No string provided";
  if (typeof str !== "string") throw `${strName} is not a string`;
  str = str.trim();
  if (str.length === 0) throw `${strName} is empty`;
  return str; // trimed
};

const checkId = (id, idName) => {
  id = checkStr(id, idName); // trimed
  if (!ObjectId.isValid(id)) throw `${idName} is not a valid ObjectId`;
  return id; // trimed
};

const checkUrl = (url, urlName) => {
  url = checkStr(url, urlName); // trimed
  url = url.replace(/\s/, "%20");

  const supportedProtocols = ["http://", "https://"];
  const minimumLength = 0;

  if (!supportedProtocols.some((p) => url.startsWith(p)))
    throw ` must provide supported protocols for ${urlName}: ${supportedProtocols.join(
      ", "
    )}`;
  if (url.split("//")[1].length < minimumLength)
    throw `${urlName} is too short`;

  return url; // trimed and replaced spaces with %20
};

const checkImgUrl = (url, imgName) => {
  url = checkUrl(url, `${imgName} link`); // trimed and replaced spaces with %20

  const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif",".svg"];
  if (!supportedExtensions.some((e) => url.endsWith(e)))
    throw `${imgName} must have supported formats: ${supportedExtensions.join(
      ", "
    )}`;

  return url; // trimed and replaced spaces with %20
};

const checkCountryCode = (countryCode) => {
  countryCode = checkStr(countryCode, "countryCode");
  return countryCode; // trimed
};

const checkGeoCode = (geoCode, geoCodeName) => {
  if (!geoCode) throw "No geoCode provided";
  if (typeof geoCode !== "object") throw `${geoCodeName} is not an object`;

  const { latitude, longitude, country, countryCode, city } = geoCode;

  if (!latitude) throw `${geoCodeName} is missing latitude`;
  if (!longitude) throw `${geoCodeName} is missing longitude`;
  if (typeof latitude !== "number")
    throw `${geoCodeName} latitude is not a number`;
  if (typeof longitude !== "number")
    throw `${geoCodeName} longitude is not a number`;

  geoCode.country = checkStr(geoCode.country, "country");
  geoCode.countryCode = checkCountryCode(geoCode.countryCode, "countryCode");
  geoCode.city = checkStr(geoCode.city, "city");

  return geoCode; // have country, countryCode, city trimed
};

const checkNumber = (num, numName, min, max) => {
  if (!num) throw `No ${numName} provided`;
  if (typeof num !== "number") throw `${numName} is not a number`;

  if (typeof min !== "number" && typeof max !== "number") return num; // nothing changed

  if (typeof min !== "number" && num > max)
    throw `${numName} must be smaller than ${max}`;
  if (typeof max !== "number" && num < min)
    throw `${numName} must be bigger than ${min}`;

  if (min > max) throw "min must be smaller than max";

  if (num < min || num > max)
    throw `${numName} must be between ${min} and ${max}`;

  return num; // nothing changed
};

const checkStrArr = (arr, arrName) => {
  if (!arr) throw `No ${arrName} provided`;
  if (!Array.isArray(arr)) throw `${arrName} is not an array`;
  if (arr.length === 0) throw `${arrName} is empty`;

  arr.map((e) => checkStr(e, `${arrName} element`));

  return arr; // trimed
};

const arrsEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  const arr1_sorted = arr1.sort();
  const arr2_sorted = arr2.sort();

  return arr1_sorted.every((e, i) => e === arr2_sorted[i]);
}

const objsEqual = (obj1, obj2) => {
  if (!obj1 || !obj2) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

  const obj1_keys = Object.keys(obj1);
  const obj2_keys = Object.keys(obj2);

  if (!arrsEqual(obj1_keys, obj2_keys)) return false;

  return obj1_keys.every((key) => obj1[key] === obj2[key]);
}

const objectId2str_doc = (doc) => {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return doc;

  return JSON.parse(
    JSON.stringify(doc, (key, value) => {
      if (key === "_id" && typeof value === ObjectId) return value.toString();
      return value;
    })
  );
};

const objectId2str_docs_arr = (arrOfDocs) => {
  if (
    !arrOfDocs ||
    !Array.isArray(arrOfDocs) ||
    arrOfDocs.some((e) => typeof e !== "object" || Array.isArray(e))
  )
    return arrOfDocs;

  return arrOfDocs.map((doc) => objectId2str_doc(doc));
};

export {
  checkStr,
  checkId,
  checkUrl,
  checkImgUrl,
  checkCountryCode,
  checkGeoCode,
  checkNumber,
  checkStrArr,
  objectId2str_doc,
  objectId2str_docs_arr,
  arrsEqual,
  objsEqual,
};
