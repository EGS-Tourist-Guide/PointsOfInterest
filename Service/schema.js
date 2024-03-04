export const typeDefs = `#graphql
  type PointOfInterest { 
    id: ID!
    name: String!
    location: String!
    description: String!
    startDate: String
    endDate: String
    capacity: Int
    priceRange: String
    thumbnail: String
  }

  input PointOfInterestInput {
    location: String
    keyword: String
    category: String
    startDate: String
    endDate: String
    priceRange: String
  }

  type Query {
    searchPointsOfInterest(searchInput: PointOfInterestInput): [PointOfInterest!]!
  }
`