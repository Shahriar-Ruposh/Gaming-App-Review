// import { faker } from "@faker-js/faker";
// import { Game } from "./src/models/game.model.ts";
// import { GameGenre } from "./src/models/gameGenres.model.ts"; // Adjust your model import paths accordingly

// // Predefined user and genre IDs
// const userIds = ["09c6db90-fa4e-4d90-9e1b-d4e9e77df5f3", "63cb048b-834b-412b-a0bc-89efe6c614a3", "3cacfb14-c57e-4efa-93aa-9ef3315071a8", "1dc7eaac-31a0-444e-a71b-af32cf3aa75f", "580a4e60-e940-4948-af86-86d0e54cf6db", "e7c4b106-a0ad-475e-942b-7eba2d9e5ef0"];

// const genreIds = [
//   "6b3d16c4-33ef-40e2-982f-bc00b6b17f38",
//   "d5d9eae2-53f1-4cb9-b5a5-1d4f703e7608",
//   "f0a9ec1f-8e34-43a7-85b0-7ec2ae896564",
//   "45d9cf2b-9118-49c6-9629-c08b9d62d5f7",
//   "b2c32d94-bb7c-4d90-b5c1-d715f4e27aef",
//   "1a1743f2-c2c8-4c36-9cb5-dfc12f154733",
//   "835fd43f-bd10-421d-81f5-5d7e1b155762",
//   "e11cfcb9-365d-4e1b-bf64-05f2c46cc636",
//   "82eeb74a-df46-4130-8535-22e0e2291f9a",
//   "4b7e31b7-5f4a-4cfc-bc3b-498addef4eab",
//   "a5bb51b9-e2ef-462a-9ffb-19620e7d7e78",
//   "73e6c86f-7e92-4ab2-8414-d83dce3450b7",
// ];

// const generateRandomGameData = () => ({
//   title: faker.lorem.words(3),
//   description: faker.lorem.paragraph(),
//   release_date: faker.date.past(),
//   publisher: faker.company.name(),
//   thumbnail: faker.image.imageUrl(),
//   popularity_score: faker.number.({ min: 0, max: 100 }),
//   trending_score: faker.datatype.number({ min: 0, max: 100 }),
//   created_by: faker.helpers.arrayElement(userIds),
// });

// const generateRandomGameGenresData = (gameId) => ({
//   game_id: gameId,
//   genre_id: faker.helpers.arrayElement(genreIds),
// });

// (async () => {
//   console.log("Starting data generation...");

//   try {
//     for (let i = 0; i < 1000000; i++) {
//       const gameData = generateRandomGameData();
//       const game = await Game.create(gameData);

//       const genresToCreate = faker.datatype.number({ min: 1, max: 3 });
//       for (let j = 0; j < genresToCreate; j++) {
//         const gameGenreData = generateRandomGameGenresData(game.id);
//         await GameGenre.create(gameGenreData);
//       }
//       if (i % 10000 === 0) {
//         console.log(`${i} games inserted...`);
//       }
//     }

//     console.log("Data generation completed!");
//   } catch (error) {
//     console.error("Error during data generation:", error);
//   }
// })();
