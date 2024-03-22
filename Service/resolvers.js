import { MongoClient, ObjectId } from 'mongodb';
import { AuthenticationError } from 'apollo-server-express';
import { validateSearchInput } from './validators/inputValidation.js';  
import dotenv from 'dotenv';
dotenv.config();

// Define MongoDB connection URI and database/collection names
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; 
const dbName = process.env.DB_NAME || 'poi_database'; 
const collectionName = process.env.COLLECTION_NAME || 'POIs';


// Function to connect to MongoDB and execute the query
const searchPointsOfInterest = async (_, { searchInput }) => {
    const client = new MongoClient(uri);

    // Validate the search input
    validateSearchInput(searchInput);

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
    Mutation: {
        createPointOfInterest: async (_, { input }) => {
            const client = new MongoClient(uri);
            try {
                await client.connect();
                const database = client.db(dbName);
                const collection = database.collection(collectionName);

                const result = await collection.insertOne(input);

                const insertedId = result.insertedId;

                // Fetch the created point of interest using the inserted ID
                const createdPointOfInterest = await collection.findOne({ _id: insertedId });

                return createdPointOfInterest;
            } catch (error) {
                console.error('Error creating point of interest:', error);
                throw new Error('Internal server error');
            } finally {
                await client.close();
            }
        },
        updatePointOfInterest: async (_, { id, input }) => {
            const client = new MongoClient(uri);
            try {
                await client.connect();
                const database = client.db(dbName);
                const collection = database.collection(collectionName);

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
                await client.close();
            }
        },
        deletePointOfInterest: async (_, { id }) => {
            const client = new MongoClient(uri);
            try {
                await client.connect();
                const database = client.db(dbName);
                const collection = database.collection(collectionName);

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
                await client.close();
            }
        },
    },
};

export default resolvers;