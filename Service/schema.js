export const typeDefs = `#graphql
  type PointOfInterest { 
    _id: ID!
    name: String!
    location: Point!
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
    location: PointInput
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

  type Point {
    type: String!
    coordinates: [Float]!
  }

  input PointInput {
    type: String!
    coordinates: [Float]!
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