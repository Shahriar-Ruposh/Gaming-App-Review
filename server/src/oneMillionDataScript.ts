import { faker } from "@faker-js/faker";
import { Game, Genre, GameGenre, User } from "./models";

// Function to generate and insert fake games in batches
const generateFakeGames = async (numGames: number, batchSize: number = 1000) => {
  try {
    const users = await User.findAll();
    if (!users.length) {
      console.error("No users found. Please add some users first.");
      return;
    }

    const genreNames = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Puzzle", "Racing", "Shooter", "Fighting", "Platformer", "Horror"];

    // Fetch or create genres from the database
    const genres = await Promise.all(
      genreNames.map(async (name) => {
        const [genre] = await Genre.findOrCreate({ where: { name } });
        return genre;
      })
    );

    const totalBatches = Math.ceil(numGames / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      console.log(`Processing batch ${batch + 1} of ${totalBatches}...`);

      const newGames = [];

      // Generate games in the current batch
      for (let i = 0; i < batchSize && batch * batchSize + i < numGames; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const gameData = {
          title: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          release_date: faker.date.past(),
          publisher: faker.company.name(),
          thumbnail: faker.image.url(),
          created_by: randomUser.id,
        };

        newGames.push(gameData);
      }

      // Bulk insert games into the database
      const createdGames = await Game.bulkCreate(newGames, { returning: true });

      for (const game of createdGames) {
        // Assign 1 to 3 random genres to the game
        const numGenres = faker.number.int({ min: 1, max: 3 });
        const randomGenres = faker.helpers.arrayElements(genres, numGenres);

        // Create GameGenre records for each game and its genres
        const gameGenresData = randomGenres.map((genre) => ({
          game_id: game.id,
          genre_id: genre.id,
        }));

        await GameGenre.bulkCreate(gameGenresData);
      }

      console.log(`Batch ${batch + 1} processed and games created successfully.`);
    }

    console.log(`${numGames} fake games created successfully!`);
  } catch (error) {
    console.error("Error creating fake games:", error);
  }
};

// Call the function to generate 800,000 fake games in batches of 5,000
generateFakeGames(800000, 5000);
