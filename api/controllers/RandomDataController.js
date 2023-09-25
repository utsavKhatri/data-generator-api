/**
 * RandomDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { generateRandomDataForStructure } = require('../utils');

module.exports = {
  /**
   * Generates random data based on the given structure and array length.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A promise that resolves to the generated random data.
   */
  generateRandomData: async (req, res) => {
    const { structure, arrayLength } = req.body;

    if (!structure || !arrayLength) {
      return res.badRequest('Structure and arrayLength are required');
    }

    try {
      const randomData = await Promise.all(
        Array.from({ length: parseInt(arrayLength) }, () =>
          generateRandomDataForStructure(structure)
        )
      );

      // store that generated data in db
      await GeneratedData.create({
        data: JSON.stringify(randomData),
        user: req.id,
      });

      return res.json(randomData);
    } catch (error) {
      console.error(error);
      return res.serverError({
        message: error.message,
      });
    }
  },
};
