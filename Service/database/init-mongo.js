// Switch to admin database to create poi_database
const adminDB = db.getSiblingDB('admin');

// Create poi_database
adminDB.createCollection("poi_database");

// Switch to poi_database
const db = db.getSiblingDB('poi_database');

// Create collections
db.createCollection("POIs");
db.createCollection("apiKeys");

// Insert documents into POIs collection
db.POIs.insertMany([
  { name: "POI 1", description: "Description of POI 1", coordinates: [10, 20] },
  { name: "POI 2", description: "Description of POI 2", coordinates: [30, 40] }
]);


// {
//   "name": "Praia da Marinha",
//   "location": {
//     "type": "Point",
//     "coordinates": [
//       -8.406331708,
//       37.08749965
//     ]
//   },
//   "locationName": "Algarve, Portugal",
//   "postcode": "8400-407",
//   "description": "Praia da Marinha is one of the most emblematic and beautiful beaches in the Algarve region. It features stunning cliffs, crystal-clear waters, and golden sand.",
//   "category": "Nature",
//   "thumbnail": "https://example.com/praia-da-marinha-thumbnail.jpg",
//   "event_ids": [
//     "event1",
//     "event2"
//   ]
// }

// {
//   "name": "Jardim Botânico de Coimbra",
//   "location": {
//     "type": "Point",
//     "coordinates": [
//       -8.420713,
//       40.205148
//     ]
//   },
//   "locationName": "Coimbra, Portugal",
//   "street": null,
//   "postcode": null,
//   "description": "The Coimbra Botanical Garden is a beautiful botanical garden located in the heart of Coimbra. It features a diverse collection of plants and trees from around the world.",
//   "category": "Nature",
//   "thumbnail": "https://example.com/botanical-garden-thumbnail.jpg",
//   "event_ids": [
//     "event3"
//   ]
// }

// {
//   "name": "Rio Mondego",
//   "location": {
//     "type": "Point",
//     "coordinates": [
//       -8.429349,
//       40.20552
//     ]
//   },
//   "locationName": "Coimbra, Portugal",
//   "description": "The Mondego River is the longest river entirely within Portuguese territory. It flows through Coimbra, offering picturesque views and recreational activities.",
//   "category": "Nature"
// }

// {
//   "name": "Restaurante Espeto do Sul",
//   "location": {
//     "type": "Point",
//     "coordinates": [
//       -8.649476,
//       40.635707
//     ]
//   },
//   "locationName": "Aveiro, Portugal",
//   "street": "R. de São Sebastião 97",
//   "postcode": "3810-187",
//   "description": "O sabor único do genuíno rodízio brasileiro conquista Aveiro, sendo o mais típico restaurante brasileiro onde cada refeição é uma festa!",
//   "category": "Food",
//   "thumbnail": "https://example.com/botanical-garden-thumbnail.jpg"
// }