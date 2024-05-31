import {
  uniqueNamesGenerator,
  colors,
  starWars,
  animals,
} from 'unique-names-generator';

export const anonymizeName = () => {
  const anonName = uniqueNamesGenerator({
    dictionaries: [colors, starWars, animals],
    length: 2,
    separator: ' ',
  });

  return anonName;
};

export const anonymizeEmail = () => {
  const anonEmail = uniqueNamesGenerator({
    dictionaries: [colors, starWars, animals],
    length: 1,
    separator: '.',
  });

  return `${anonEmail}@${uniqueNamesGenerator({
    dictionaries: [colors, starWars, animals],
    length: 1,
    separator: '.',
  })}.com`;
};
