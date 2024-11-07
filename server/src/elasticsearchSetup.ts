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
            publisher: { type: "text" },
            thumbnail: { type: "text" },
            created_by: { type: "text" },
            avg_user_rating: { type: "float" },
            view_count: { type: "integer" },
            genres: { type: "text" },
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

// title: { type: "text" },//
// description: { type: "text" },//
// release_date: { type: "date" },//
// publisher: { type: "keyword" },//
// thumbnail: { type: "text" },//
// genres: { type: "keyword" }, //
// created_by: { type: "keyword" },//
// view_count: { type: "integer" },//
// avg_user_rating: { type: "float" },//
