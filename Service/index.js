import { ApolloServer, gql } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Define schema
// ! means that the field can not be null
const typeDefs = gql`
  type PointOfInterest { 
    name: String!
    location: String!
    description: String!
    startDate: String
    endDate: String
    capacity: Int
    thumbnail: String
  }

  input PointOfInterestInput {
    location: String
    type: String
    category: String
    startDate: String
    endDate: String
    priceRange: String
  }

  type Query {
    searchPointsOfInterest(searchInput: PointOfInterestInput): [PointOfInterest!]!
  }
`;

export default typeDefs;