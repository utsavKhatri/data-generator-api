const { faker } = require('@faker-js/faker');
const crypto = require('crypto');
const dns = require('node:dns');
const domains = require('disposable-email-domains');

/**
 * Generates random data for a given structure.
 *
 * @param {any} structure - The structure for which random data needs to be generated.
 * @return {Promise<any>} - A promise that resolves to the generated random data.
 */
async function generateRandomDataForStructure(structure) {
  if (typeof structure === 'string') {
    return generateRandomValueByType(structure);
  }

  if (Array.isArray(structure)) {
    const [objectStructure, config] = structure;
    const arrayLength =
      config && config.arrayLength
        ? parseInt(config.arrayLength)
        : objectStructure.arrayLength;

    return await Promise.all(
      Array.from({ length: arrayLength }, () =>
        generateRandomDataForStructure(objectStructure)
      )
    );
  }

  if (typeof structure === 'object') {
    const result = {};
    for (const key in structure) {
      if (structure.hasOwnProperty(key)) {
        result[key] = await generateRandomDataForStructure(structure[key]);
      }
    }
    return result;
  }

  throw new Error(`Unhandled case for structure: ${structure}`);
}

/**
 * Generates a random value based on the given type.
 *
 * @param {string} type - The type of value to generate.
 * @return {Promise<any>} - A promise that resolves to the generated value.
 */
async function generateRandomValueByType(type) {
  const typeGenerators = {
    string: () => faker.string.sample(),
    number: async () => await getRandomNumber(1, 100),
    boolean: () => Math.random() < 0.5,
    uuid: () => crypto.randomUUID(),
    arrayOfString: async () => await generateArrayOfStrings(),
    arrayOfNumber: async () => await generateArrayOfNumbers(),
    arrayOfArray: async () => await generateArrayOfArrays(),
    date: () => faker.date.past(),
    email: () => faker.internet.email(),
    address: () => ({
      street: faker.location.buildingNumber(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    }),
    name: () => faker.person.firstName(),
    fullName: () => faker.person.fullName(),
    slug: () => faker.lorem.slug(),
    longText: () => faker.lorem.paragraphs(3),
    website: () => faker.internet.url(),
    ip: () => faker.internet.ip(),
    contact: () => faker.phone.number(),
  };

  if (typeGenerators[type]) {
    return await typeGenerators[type]();
  }

  throw new Error(`Invalid type: ${type}`);
}

/**
 * Generates an array of arrays asynchronously.
 *
 * @return {Promise<Array<Array<type>>>} A promise that resolves to an array of arrays,
 * where each inner array contains random values of various types.
 */
async function generateArrayOfArrays() {
  const length = getRandomNumber(1, 5);
  return await Promise.all(
    Array.from({ length }, async () => {
      const randomType = getRandomType();
      return randomType === 'arrayOfArray'
        ? await generateArrayOfArrays()
        : await generateRandomValueByType(randomType);
    })
  );
}

async function generateArrayOfStrings() {
  const length = getRandomNumber(1, 5);
  return await Promise.all(Array.from({ length }, generateRandomString));
}

async function generateArrayOfNumbers() {
  const length = getRandomNumber(1, 5);
  return await Promise.all(
    Array.from({ length }, async () => getRandomNumber(1, 100))
  );
}

function generateRandomString() {
  const length = getRandomNumber(5, 15);
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomType() {
  const types = [
    'string',
    'number',
    'arrayOfArray',
    'arrayOfString',
    'arrayOfNumber',
    'date',
    'email',
    'address',
    'name',
    'fullName',
    'slug',
    'longText',
    'website',
    'ip',
  ];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
}
/**
 * Checks if a domain has an A record.
 *
 * @param {string} domain - The domain to check.
 * @returns {boolean} - True if the domain has an A record, false otherwise.
 */
const hasARecord = async (domain) => {
  try {
    await dns.promises.resolve(domain, 'A');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * Checks if the given domain is a disposable email domain.
 *
 * @param {string} domain - The domain to be checked.
 * @return {boolean} Returns true if the domain is disposable, false otherwise.
 */
const isDisposableEmail = async (domain) => {
  // Check if the domain is in the list of disposable email domains
  return domains.includes(domain.toLowerCase());
};
/**
 * Validates an email address.
 *
 * @param {string} email - The email address to be validated.
 * @return {Promise<Object>} A promise that resolves to an object representing the result of the validation. The object has the following properties:
 *   - valid: A boolean indicating whether the email is valid or not.
 *   - reason: A string describing the reason for the validation result.
 *   - message: A string providing additional information about the validation result.
 */
const validateEmail = async (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email syntax is valid
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      reason: 'Invalid email syntax',
      message: 'Invalid email syntax',
    };
  }

  // Extract domain from email
  const [, domain] = email.split('@');

  try {
    // Resolve MX records for the domain
    const address = await dns.resolveMx(domain, (_err, addresses) => {
      if (!addresses || addresses.length === 0) {
        return false;
      }
      return true;
    });

    // Check if domain does not have MX records
    if (address === false) {
      return {
        valid: false,
        reason: 'Domain does not exist',
        message: 'Invalid email',
      };
    }

    // Check if domain has an A record
    const domainHasARecord = await hasARecord(domain);

    if (!domainHasARecord) {
      return {
        valid: false,
        reason: 'Domain does not have an A record',
        message: 'Invalid email',
      };
    }

    // Check if email domain is a disposable email service
    const isDisposable = await isDisposableEmail(domain);

    if (isDisposable) {
      return {
        valid: false,
        reason: 'Disposable email address',
        message: 'Invalid email',
      };
    }

    // Email is valid
    return { valid: true, reason: null, message: null };
  } catch (error) {
    // Error in DNS lookup
    return {
      valid: false,
      reason: 'Error in DNS lookup',
      message: error.message,
    };
  }
};

module.exports = {
  generateRandomValueByType,
  generateArrayOfArrays,
  generateArrayOfStrings,
  generateArrayOfNumbers,
  generateRandomString,
  getRandomNumber,
  getRandomType,
  generateRandomDataForStructure,
  validateEmail,
};
