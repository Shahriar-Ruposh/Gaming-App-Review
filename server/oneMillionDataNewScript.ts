const { faker } = require("@faker-js/faker");
const createGame = require("./createGame");

const imageUrls = [
  "https://assets-prd.ignimgs.com/2024/10/31/callofduty-blackops6-zombies-review-blogroll-1730398137298.jpg?crop=16%3A9&width=282&dpr=2",
  "https://assets-prd.ignimgs.com/2024/10/31/no-more-room-in-hell-2-earlyaccess-blogroll-1730394027223.jpg?crop=16%3A9&width=282&dpr=2",
];

const genreId = [
  "168bfe66-5dc6-4097-9239-c9037e8739be",
  "8c9b2882-45d3-499b-9e6b-9c97fbd8fe68",
  "a6bfcbc0-5731-42d8-861d-dffb701d8acf",
  "6cd57daf-d563-4f9e-83cf-e8b8b59a6197",
  "441c3c39-8202-420d-80cb-518c2599a0c7",
  "69e9f7b2-5873-454b-b7fc-700cf38ea69c",
  "da64b7ad-ffbd-454a-a47b-b28247a539a1",
  "3a0b8deb-9cb4-48f1-9ace-0a3697edfe7e",
  "cba17144-3638-4e7a-bcec-0397434478ac",
  "e801beb5-190b-42a5-8081-b9cc30d965e3",
  "17662053-83c5-4066-b7c1-9cc6bf29d409",
  "9b571e8b-31d4-43f9-a7e3-2795a8b16276",
  "c8e45369-ee51-4376-9a53-c7aefcf4201a",
  "8ab53bf5-39b0-497a-a5f9-e5af49a3ee8a",
  "e5a6e052-4667-4d77-9d2a-3c69ab0aff02",
  "d2441e92-35af-421d-9b17-44ffd913c4ec",
  "abb8505c-9586-47cd-b2d3-45efa8bf4b21",
  "9d502c50-8f91-427c-badd-07c9cc48d1c5",
  "b61ff50e-b1e4-4e70-a593-d0bfca6cf7b2",
];

const userId = [
  "96ea82ae-fd3c-4383-b356-e6381650d369",
  "f33fe63b-1dfc-442f-9666-87914950aaa1",
  "e0ece25d-ff43-46e1-8be8-532eda5824ed",
  "423c1eb7-e04e-435e-b67e-c100dd0db03c",
  "6728c30f-8ad5-4eaa-8340-0a459fcfe322",
  "a94c5653-4039-474f-a269-0672ba36aca0",
  "8052d324-da95-4ce2-b85e-0d34b54582d1",
  "4bfb8e7d-1280-4065-a6bc-eee984946d6d",
  "610aef29-461d-42cd-ab32-6e186f4774ae",
  "124406cf-4796-4623-b5ab-09a1fe94fd7b",
  "41cf8216-6572-4e63-8860-909d3ad18720",
  "879d18fd-a312-4fc1-a0a2-3b5f0b83c288",
];

const generateRandomGameData = () => ({
  title: faker.commerce.productName(),
  description: faker.lorem.sentences(2),
  publisher: faker.company.name(),
  imageUrl: faker.image.url({ width: 256, height: 256 }),
  releaseDate: faker.date.between({ from: "2020-01-01T00:00:00.000Z", to: "2030-01-01T00:00:00.000Z" }),
  genreIds: [faker.number.int({ min: 1, max: 15 }), faker.number.int({ min: 1, max: 15 })],
});

const generateGames = async (token, numberOfGames = 10) => {
  for (let i = 0; i < numberOfGames; i++) {
    const gameData = generateRandomGameData();

    try {
      const game = await createGame(gameData, token);
      console.log(`Game ${i + 1} created successfully:`, game);
    } catch (error) {
      console.error(`Failed to create game ${i + 1}:`, error.message);
    }
  }
};

// Provide the token here
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwNjEyMjY1fQ.59nHnzVvL5uz_legHFlj-wRvcIz_Ee5CZZEWSug_DRw";
generateGames(token);
