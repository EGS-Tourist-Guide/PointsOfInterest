export const typeDefs = `#graphql
  type PointOfInterest { 
    _id: ID!
    name: String!
    location: Point!
    locationName: String!
    street: String
    postcode: String
    description: String
    category: String
    thumbnail: String
    event_ids: [ID]
  }

  input PoiSearchInput {
    location: PointInput
    radius: Float
    locationName: String
    category: String
  }

  type Point {
    type: String!
    coordinates: [Float]!
  }

  input PointInput {
    type: String!
    coordinates: [Float]!
  }

  type Query {
    searchPointsOfInterest(searchInput: PoiSearchInput, apiKey: String!): [PointOfInterest!]!
    
    recoverApiKey(clientName: String!): String!
  }

  input CreatePointOfInterestInput {
    name: String!
    location: PointInput!
    locationName: String!
    street: String
    postcode: String
    description: String
    category: String
    thumbnail: String
    event_ids: [ID]
  }

  input UpdatePointOfInterestInput {
    name: String
    location: PointInput
    locationName: String
    street: String
    postcode: String
    description: String
    category: String
    thumbnail: String
    event_ids: [ID]
  }

  type Mutation {
    createPointOfInterest(input: CreatePointOfInterestInput!, apiKey: String!): PointOfInterest!
    updatePointOfInterest(id: ID!, input: UpdatePointOfInterestInput!, apiKey: String!): PointOfInterest!
    deletePointOfInterest(id: ID!, apiKey: String!): String!

    generateApiKey(clientName: String!): String!
  }
`