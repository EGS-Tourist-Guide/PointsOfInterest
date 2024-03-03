# Points Of Interest Service

The idea is to use GraphQL instead of REST since i am doing a single query with multiple data to chose the correct POIs. 

## Technologies used
- **Apollo Server**: Simplifies the process of building GraphQL APIs. It is also well documented and seems easy to use.

- **PostgreSQL with PostGIS extension**: Widely used database. Can be seamlessly integrated with Apollo Server, allowing me to efficiently fetch and manipulate data for our GraphQL API. PostGIS will be used to add support for geographic objects.

    <img src="images/Apollo.jpg" alt="Apollo Server" width="500">

## GraphQL Schema (SDL)

The query must have into consideration different inputs in order to retrieve the correct POI's and their respective information.
Searching parameters are all optional and can be:
  - location
  - type/keyword: (festivals, museums, restaurants) 
  - category (beach, nature, history, food)
  - start and end dates
  - price range

if there are no input arguments, most searched POI's will be displayed.

The first structure looks like this:

```graphql
type PointOfInterest { 
    id: ID!
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
  ```

Example of query:

```graphql
query {
  searchPointsOfInterest(
    searchInput: {
      location: "Aveiro"
      type: "Restaurante"
      priceRange: "10€ - 20€"
    }
  ) {
    name
    location
    description
    startDate
    endDate
    capacity
    thumbnail
  }
}
```

With this query we can obtain name, location, description, opening and closing day, capacity, and photo of a list of restaurants located in Aveiro for a price range between 10 and 20 euros.