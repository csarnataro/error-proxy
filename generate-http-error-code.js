function getTotalWeight(codes) {
  return Object.values(codes).reduce((acc, value) => acc += value.weight, 0);
}

function pickWeightedRandomCode(codes){
  const weight = getTotalWeight(codes);
  let pick = Math.random() * weight;
  for(let code in codes){
    pick -= codes[code].weight;
    if(pick <= 0){
        return code;
    }
  }
  return '500'; // fallback to 500
}

function possiblyGenerateErrorCode(url, urlsGeneratingErrors) {
  urlsGeneratingErrors.forEach(urlWithProbability => {
    const errorCode = getErrorCode(url, urlWithProbability);
    if (errorCode) {
      console.log(`\x1b[31m**** Generating error for ${urlWithProbability.url} ****\x1b[0m`);
      throw new Error(`Generated error ${errorCode}`, { cause: errorCode });
    }
  });
}

function getErrorCode(url, urlWithProbability) {
  const randomProbability = Math.random();
  if (url.match(urlWithProbability.url) && randomProbability < urlWithProbability.probability) {
    return pickWeightedRandomCode(urlWithProbability.codes);
  }
  return;
}

module.exports = {
  getTotalWeight,
  pickWeightedRandomCode,
  possiblyGenerateErrorCode
}