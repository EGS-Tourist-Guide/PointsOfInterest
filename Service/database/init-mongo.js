// Switch to admin database to create poi_database
const adminDB = db.getSiblingDB('admin');

// Create poi_database
adminDB.createCollection("poi_database");

// Switch to poi_database
const db = db.getSiblingDB('poi_database');

// Create collections
db.createCollection("POIs");
db.createCollection("apiKeys");

// Create default API key
db.apiKeys.insertOne({
  clientName: "Tigas",
  apiKey: "Tigas:4712b0a1d771938c04e5cba078b0a889",
  password: "$2b$10$vUemVm248PUDU3oH/GSQruO4fMZR1mJitcum4XtJbvgykc6m2pqTC"
});

// Create a geospatial index on the 'location' field in the 'POIs' collection
db.POIs.createIndex({ location: "2dsphere" });

// Insert documents into POIs collection
db.POIs.insertMany([
  {
    _id: ObjectId("5f8f4b3b9b3e6b1f3c1e4b1a"),
    name: "Praia da Marinha",
    location: {
      type: "Point",
      coordinates: [-8.406331708, 37.08749965]
    },
    locationName: "Algarve, Portugal",
    postcode: "8400-407",
    description: "Praia da Marinha is one of the most emblematic and beautiful beaches in the Algarve region. It features stunning cliffs, crystal-clear waters, and golden sand.",
    category: "Nature",
    thumbnail: "https://example.com/praia-da-marinha-thumbnail.jpg",
    event_ids: ["event1", "event2"]
  },
  {
    _id: ObjectId("5f8f4b3b9b3e6b1f3c1e4b1b"),
    name: "Jardim Botânico de Coimbra",
    location: {
      type: "Point",
      coordinates: [-8.420713, 40.205148]
    },
    locationName: "Coimbra, Portugal",
    street: null,
    postcode: null,
    description: "The Coimbra Botanical Garden is a beautiful botanical garden located in the heart of Coimbra. It features a diverse collection of plants and trees from around the world.",
    category: "Nature",
    thumbnail: "https://example.com/botanical-garden-thumbnail.jpg",
    event_ids: ["event3"]
  },
  {
    _id: ObjectId("5f8f4b3b9b3e6b1f3c1e4b1c"),
    name: "Rio Mondego",
    location: {
      type: "Point",
      coordinates: [-8.429349, 40.20552]
    },
    locationName: "Coimbra, Portugal",
    description: "The Mondego River is the longest river entirely within Portuguese territory. It flows through Coimbra, offering picturesque views and recreational activities.",
    category: "Nature",
    event_ids: ["event4", "event5"]
  },
  {
    _id: ObjectId("5f8f4b3b9b3e6b1f3c1e4b1d"),
    name: "Restaurante Espeto do Sul",
    location: {
      type: "Point",
      coordinates: [-8.649476, 40.635707]
    },
    locationName: "Aveiro, Portugal",
    street: "R. de São Sebastião 97",
    postcode: "3810-187",
    description: "O sabor único do genuíno rodízio brasileiro conquista Aveiro, sendo o mais típico restaurante brasileiro onde cada refeição é uma festa!",
    category: "Food",
    thumbnail: "https://example.com/botanical-garden-thumbnail.jpg",
    event_ids: ["event6"]
  }
]);