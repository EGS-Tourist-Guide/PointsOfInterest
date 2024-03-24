import { MongoClient, ObjectId } from 'mongodb';
import { connect, connectToApiKeys, closeConnection } from './database/db.js';
import { validateSearchInput } from './validators/inputValidation.js';
import { authenticateWithApiKey, generateApiKey } from './authUtils.js';
import dotenv from 'dotenv';
dotenv.config();

// Define MongoDB connection URI and database/collection names
// const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; 
// const dbName = process.env.DB_NAME || 'poi_database'; 
// const mainCollection = process.env.COLLECTION_NAME || 'POIs';


// Function to connect to MongoDB and execute the query
const searchPointsOfInterest = async (_, { searchInput, apiKey }) => {
    await authenticateWithApiKey(_, _, _, { apiKey: apiKey });
    
    // Validate the search input
    validateSearchInput(searchInput);

    try {
        const collection = await connect();

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
        closeConnection();
    }
};

const resolvers = {
    Query: {
        searchPointsOfInterest,
    },
    Mutation: {
        createPointOfInterest: async (_, { input, apiKey }) => {
            await authenticateWithApiKey(_, _, _, { apiKey: apiKey });

            try {
                const collection = await connect();

                const result = await collection.insertOne(input);

                const insertedId = result.insertedId;

                // Fetch the created point of interest using the inserted ID
                const createdPointOfInterest = await collection.findOne({ _id: insertedId });

                return createdPointOfInterest;
            } catch (error) {
                console.error('Error creating point of interest:', error);
                throw new Error('Internal server error');
            } finally {
                closeConnection();
            }
        },
        updatePointOfInterest: async (_, { id, input, apiKey }) => {
            await authenticateWithApiKey(_, _, _, { apiKey: apiKey });
            try {
                const collection = await connect();

                const result = await collection.findOneAndUpdate(
                    { _id: id },
                    { $set: input },
                    { returnOriginal: false }
                );

                return result;
            } catch (error) {
                console.error('Error updating point of interest:', error);
                throw new Error('Internal server error');
            } finally {
                closeConnection();
            }
        },
        deletePointOfInterest: async (_, { id, apiKey }) => {
            await authenticateWithApiKey(_, _, _, { apiKey: apiKey });
            try {
                const collection = await connect();

                const result = await collection.deleteOne({ _id: id });
                if (result.deletedCount === 1) {
                    return 'Point of interest deleted successfully';
                } else {
                    throw new Error('Point of interest not found');
                }
            } catch (error) {
                if (error.message === 'Point of interest not found') {
                    throw error;
                } else {
                    console.error('Error deleting point of interest:', error);
                    throw new Error('Internal server error');
                }
            } finally {
                closeConnection();
            }
        },
        generateApiKey: async (_, { clientName }) => {
            // check if client already has an API key
            // if not, generate a new API key

            let apiKey = null;
            try {
                const collection = await connectToApiKeys();

                const result = await collection.findOne({ clientName: clientName });
                if (result) {
                    throw new Error('Client already has an API key');
                } else {
                    apiKey = generateApiKey(clientName);
                    await collection.insertOne({ clientName: clientName, apiKey: apiKey });
                }

                return apiKey;
            } catch (error) {
                if (error.message === 'Client already has an API key') {
                    throw error;
                } else {
                    console.error('Error generating API key:', error);
                    throw new Error('Internal server error');
                }
            } finally {
                closeConnection();
            }
        },
    },
};

export default resolvers;