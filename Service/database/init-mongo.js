db.createCollection("POIs");
db.createCollection("apiKeys");

db.POIs.insertMany([
  { name: "POI 1", description: "Description of POI 1", coordinates: [10, 20] },
  { name: "POI 2", description: "Description of POI 2", coordinates: [30, 40] }
]);
