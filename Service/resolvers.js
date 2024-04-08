import { MongoClient, ObjectId } from 'mongodb';
import { connect, connectToApiKeys, closeConnection } from './database/db.js';
import { validateSearchInput } from './validators/inputValidation.js';
import { authenticateWithApiKey, generateApiKey } from './authUtils.js';
import dotenv from 'dotenv';
dotenv.config();
//const bcrypt = require('bcrypt');

// const hashPassword = async (password) => {
//     const saltRounds = 10;
//     return await bcrypt.hash(password, saltRounds);
// }

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
            // Case-insensitive to capital letters
            filter['category'] = {
                $regex: new RegExp(searchInput.category, 'i')
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

        if (result.length === 0) {
            throw new Error('No points of interest found');
        }

        return result;
    } catch (error) {
        if (error.message === 'No points of interest found') {
            throw error;
        } else {
            console.error('Error executing MongoDB query:', error);
            throw new Error('Internal server error');
        }
    } finally {
        closeConnection();
    }
};

const resolvers = {
    Query: {
        searchPointsOfInterest,
        recoverApiKey: async (_, { clientName, password }) => {
            // check if client has an API key
            // if so, recover the API key

            let apiKey = null;
            try {
                const collection = await connectToApiKeys();

                const result = await collection.findOne({ clientName: clientName });
                if(!result) {
                    throw new Error('Client not found');
                }

                // Verify if the provided password matches the stored hashed password
                // const storedHashedPassword = result.password;
                // const passwordMatch = await.compare(password, storedHashedPassword);
                // if (!passwordMatch) {
                //     throw new Error('Incorrect password');
                // }

                return result.apiKey;
            } catch (error) {
                if (error.message === 'Client not found' || error.message === 'Incorrect password') {
                    throw error;
                } else {
                    console.error('Error recovering API key:', error);
                    throw new Error('Internal server error');
                }
            } finally {
                closeConnection();
            }
        }
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
        generateApiKey: async (_, { clientName, password }) => {
            // check if client already has an API key
            // if not, generate a new API key

            let apiKey = null;
            try {
                const collection = await connectToApiKeys();

                const result = await collection.findOne({ clientName: clientName });
                if (result) {
                    throw new Error('Client already has an API key');
                } 

                //const hashedPassword = await hashPassword(password);
                
                apiKey = generateApiKey(clientName);
                await collection.insertOne({ clientName: clientName, apiKey: apiKey, password: password });//password: hashedPassword });

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
        }
    },
};

export default resolvers;