import { MongoClient } from 'mongodb';

// Define MongoDB connection URI and database/collection names
const uri = 'mongodb://localhost:27017/poi_database'; 
const dbName = 'poi_database'; 
const collectionName = 'POIs';

// Function to connect to MongoDB and execute the query
const searchPointsOfInterest = async (_, { searchInput }) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Construct the filter based on the search input
        const filter = {};

        if (searchInput.locationName) {
            filter['locationName'] = searchInput.locationName;
        }

        // Add conditions based on the search input
        if (searchInput.location) {
            filter['location'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: searchInput.location.coordinates
                    },
                    $maxDistance: searchInput.radius
                }
            };
        }

        // Add other conditions based on other search input fields

        // Execute the query
        const result = await collection.find(filter).toArray();
        return result;
    } catch (error) {
        console.error('Error executing MongoDB query:', error);
        throw new Error('Internal server error');
    } finally {
        await client.close();
    }
};

// Define your resolvers
const resolvers = {
    Query: {
        searchPointsOfInterest,
    },
};

export default resolvers;