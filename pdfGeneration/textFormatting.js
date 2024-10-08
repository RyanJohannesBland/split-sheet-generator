const sectionSizes = {
  title: 29,
  key: 6,
  bpm: 6,
  producers: 51,
  writers: 53,
  writerNamePercentages1: 59,
  writerNamePercentages2: 45,
  publisherNamePercentages: 45,
  writerNamePercentages3: 59,
  ownershipWriterName1: 23,
  ownershipWriterName2: 23,
  ownershipWriterName3: 23,
  ownershipWriterName4: 23,
  ownershipWriterPRO1: 20,
  ownershipWriterPRO2: 20,
  ownershipWriterPRO3: 20,
  ownershipWriterPRO4: 20,
  ownershipWriterIPI1: 17,
  ownershipWriterIPI2: 17,
  ownershipWriterIPI3: 17,
  ownershipWriterIPI4: 17,
  ownershipWriterPercentage1: 4,
  ownershipWriterPercentage2: 4,
  ownershipWriterPercentage3: 4,
  ownershipWriterPercentage4: 4,
  ownershipPublisherName1: 21,
  ownershipPublisherName2: 21,
  ownershipPublisherName3: 21,
  ownershipPublisherName4: 21,
  ownershipPublisherPRO1: 19,
  ownershipPublisherPRO2: 19,
  ownershipPublisherPRO3: 19,
  ownershipPublisherPRO4: 19,
  ownershipPublisherIPI1: 17,
  ownershipPublisherIPI2: 17,
  ownershipPublisherIPI3: 17,
  ownershipPublisherIPI4: 17,
  ownershipPublisherPercentage1: 4,
  ownershipPublisherPercentage2: 4,
  ownershipPublisherPercentage3: 4,
  ownershipPublisherPercentage4: 4,
  ownershipMasterPercentage1: 4,
  ownershipMasterPercentage2: 4,
  ownershipMasterPercentage3: 4,
  ownershipMasterPercentage4: 4,
  ownershipArtistEmail1: 22,
  ownershipArtistEmail2: 22,
  ownershipArtistEmail3: 22,
  ownershipArtistEmail4: 22,
  ownershipArtistPhone1: 22,
  ownershipArtistPhone2: 22,
  ownershipArtistPhone3: 22,
  ownershipArtistPhone4: 22,
  "agree-er1": 14,
  "agree-er2": 15,
  contributorSignature1: 17,
  contributorSignature2: 17,
  contributorSignature3: 17,
  contributorSignature4: 17,
};

const minSize = 6;
const maxSize = 12;

function getTextFormatting(section, text) {
  // Algorithm: Shrink until it can fit on one line. If we hit min size and can't fit on
  // one line, start inserting new lines until we can.
  const sectionSize = sectionSizes[section];

  const sectionSizeMultipliers = {
    11: 1.1,
    10: 1.22,
    9: 1.35,
    8: 1.5,
    7: 1.75,
    6: 2,
  };

  let currTextSize = 11;

  const maxCharacters = () =>
    Math.floor(sectionSize * sectionSizeMultipliers[currTextSize]);

  // Attempt to shrink text to fit on one line.
  while (currTextSize > minSize) {
    if (text.length <= maxCharacters()) {
      break;
    }
    currTextSize -= 1;
  }
  // If text is still too long, attempt to split by finding the closest point to the
  // middle.
  const midpoint = Math.floor(text.length / 2);
  let distanceFromMidpoint = 0;
  while (text.split("\n")[0].length > maxCharacters) {
    const right1 = midpoint + distanceFromMidpoint;
    const left1 = midpoint - distanceFromMidpoint;
    if (text[right1] === " ") {
      text = text.substring(0, right1) + "\n" + text.substring(right1 + 2);
    } else if (text[left1] === " ") {
      text = text.substring(0, left1) + "\n" + text.substring(left1 + 2);
    }
    distanceFromMidpoint += 1;
  }

  return { text, size: currTextSize };
}

module.exports = { getTextFormatting };
