import { MongoClient } from 'mongodb';
import { AuthenticationError } from 'apollo-server-express';

import dotenv from 'dotenv';
dotenv.config();

// Define MongoDB connection URI and database/collection names
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; 
const dbName = process.env.DB_NAME || 'poi_database'; 
const collectionName = process.env.COLLECTION_NAME || 'POIs';


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
            // Case-insensitive regex to match the location name
            filter['locationName'] = {
                $regex: new RegExp(searchInput.locationName, 'i')
            };
        }

        if (searchInput.category) {
            filter['category'] = searchInput.category;
        }

        if (searchInput.priceRange) {
            // Ensure priceRange is an array
            if (!Array.isArray(searchInput.priceRange)) {
                throw new Error('Price range must be an array');
            }

            // Extract min and max values from the array
            const [minPrice, maxPrice] = searchInput.priceRange;

            filter['priceRange'] = {
                $gte: minPrice, // greater than or equal to
                $lte: maxPrice  // less than or equal to
            };
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

const resolvers = {
    Query: {
        searchPointsOfInterest,
    },
};

export default resolvers;