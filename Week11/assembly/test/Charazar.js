// Import necessary modules
const { expect } = require("chai");

// Start describing the tests using Mocha
describe("Charazar", function () {
  // Declare a variable to store the contract instance
  let charazar;

  // Define a beforeEach hook to deploy the contract before each test
  beforeEach(async function () {
    // Deploy the contract
    const Charazar = await ethers.getContractFactory("Charazar");
    charazar = await Charazar.deploy();
    await charazar.deployed();
  });

  // Test the charAt() function
  describe("charAt()", function () {
    it("should return the correct byte value for a valid index", async function () {
      // Call the charAt() function with the input "abcdef" and index 2
      const result = await charazar.charAt("abcdef", 2);
      // Check that the returned value is equal to 0x6300
      expect(result).to.equal("0x6300");
    });

    it("should return 0x0000 for an index outside the string bounds", async function () {
      // Call the charAt() function with the input "george" and index 10
      const result = await charazar.charAt("george", 10);
      // Check that the returned value is equal to 0x0000
      expect(result).to.equal("0x0000");
    });

    it("should return 0x0000 for an empty string", async function () {
      // Call the charAt() function with an empty string and index 0
      const result = await charazar.charAt("", 0);
      // Check that the returned value is equal to 0x0000
      expect(result).to.equal("0x0000");
    });
  });
});
