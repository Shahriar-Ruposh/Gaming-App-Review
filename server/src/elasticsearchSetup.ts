import client from "./config/elasticSearch";

export const createGameIndex = async () => {
  const indexExists = await client.indices.exists({ index: "games" });
  if (!indexExists) {
    await client.indices.create({
      index: "games",
      body: {
        mappings: {
          properties: {
            id: { type: "keyword" },
            title: { type: "text" },
            description: { type: "text" },
            release_date: { type: "date" },
            publisher: { type: "text" },
            thumbnail: { type: "text" },
            is_published: { type: "boolean" },
            view_count: { type: "integer" },
            popularity_score: { type: "integer" },
            trending_score: { type: "integer" },
            created_by: { type: "keyword" },
          },
        },
      },
    });
  }
};
