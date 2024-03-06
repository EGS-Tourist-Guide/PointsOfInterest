export const typeDefs = `#graphql
  type PointOfInterest { 
    id: ID!
    name: String!
    latitude: Float
    longitude: Float
    locationName: String!
    description: String!
    category: String!
    openingHours: String
    schedule: String
    capacity: Int
    priceRange: String
    thumbnail: String
  }

  input PoiSearchInput {
    latitude: Float
    longitude: Float
    radius: Float
    locationName: String
    category: String
    openingHours: String
    schedule: String
    priceRange: String
  }

  type Query {
    searchPointsOfInterest(searchInput: PoiSearchInput): [PointOfInterest!]!
  }




















  input CreatePointOfInterestInput {
    latitude: Float!
    longitude: Float!
    name: String!
    locationName: String!
    description: String!
    capacity: Int
    priceRange: String
    thumbnail: String
  }

  input UpdatePointOfInterestInput {
    latitude: Float
    longitude: Float
    name: String
    locationName: String
    description: String
    capacity: Int
    priceRange: String
    thumbnail: String
  }

  type Mutation {
    createPointOfInterest(input: CreatePointOfInterestInput!): PointOfInterest!
    updatePointOfInterest(id: ID!, input: UpdatePointOfInterestInput!): PointOfInterest!
    deletePointOfInterest(id: ID!): Boolean!
  }
`