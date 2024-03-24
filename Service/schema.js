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

  type Query {
    searchPointsOfInterest(searchInput: PoiSearchInput, apiKey: String!): [PointOfInterest!]!
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
    _id: ID!
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

  type idOfCreatedPoi {
    _id: ID!
  }

  type Mutation {
    createPointOfInterest(input: CreatePointOfInterestInput!, apiKey: String!): PointOfInterest!
    updatePointOfInterest(id: ID!, input: UpdatePointOfInterestInput!, apiKey: String!): PointOfInterest!
    deletePointOfInterest(id: ID!, apiKey: String!): String!

    generateApiKey(clientName: String!): String!
  }
`