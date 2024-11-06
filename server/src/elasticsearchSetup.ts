import client from "./config/elasticSearch";

const createGameIndex = async () => {
  const index = "games";
  const exists = await client.indices.exists({ index });

  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            release_date: { type: "date" },
            publisher: { type: "keyword" },
            thumbnail: { type: "text" },
            genres: { type: "keyword" }, // Stores genre names as keywords
            created_by: { type: "keyword" },
            view_count: { type: "integer" },
            popularity_score: { type: "integer" },
            trending_score: { type: "integer" },
          },
        },
      },
    });
    console.log(`Index "${index}" created.`);
  } else {
    console.log(`Index "${index}" already exists.`);
  }
};

export default createGameIndex;
