# Points Of Interest Service

The idea is to use GraphQL instead of REST since i am doing a single query with multiple data to chose the correct POIs. 

## Technologies used
- **Apollo Server**: Simplifies the process of building GraphQL APIs. It is also well documented and seems easy to use.

- **PostgreSQL with PostGIS extension**: Widely used database. Can be seamlessly integrated with Apollo Server, allowing me to efficiently fetch and manipulate data for our GraphQL API. PostGIS will be used to add support for geographic objects.

    <img src="images/Apollo.jpg" alt="Apollo Server" width="500">

## GraphQL Schema (SDL)

The query must have into consideration different inputs in order to retrieve the correct POI's and their respective information.
Searching parameters are all optional and can be:
  - location -> city, region, country
  - type/keyword -> beach, nature, history, food
  - category -> festivals, museums, restaurants
  - start and end dates -> YYYY-MM-DD
  - price range -> €€ - €€€ 

If there are no input arguments, most searched POI's will be displayed.
The output will be a list of POI's with the following information (name, location and description are mandatory):
  - name
  - location
  - description
  - start and end dates
  - capacity
  - price range
  - thumbnail

The first schema structure looks like this:

```graphql
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
  ```

Example of query:

```graphql
query {
  searchPointsOfInterest(
    searchInput: {
      location: "Algarve"
      keyword: "beach"
    }
  ) {
    name
    location
    description
    startDate
    endDate
    capacity
    priceRange
    thumbnail
  }
}
```

This query will return a JSON response with a list of beaches located in Algarve. Information like startDate and endDate is optional, i.e. can be null, and will only be displayed if they are available (In this case, beaches don't have start and end dates).
For a better understanding of the query, the following image shows the structure of the expected response:
```json
{
  "data": {
    "searchPointsOfInterest": [
      {
        "name": "Praia da Marinha",
        "location": "Algarve, Portugal",
        "description": "Praia da Marinha is one of the most emblematic and beautiful beaches in the Algarve region. It features stunning cliffs, crystal-clear waters, and golden sand.",
        "startDate": null,
        "endDate": null,
        "capacity": null,
        "thumbnail": "https://example.com/praia-da-marinha-thumbnail.jpg"
      },
      {
        "name": "Praia da Falésia",
        "location": "Algarve, Portugal",
        "description": "Praia da Falésia is a breathtaking beach known for its towering cliffs and golden sands. It offers stunning views and is perfect for sunbathing and swimming.",
        "startDate": null,
        "endDate": null,
        "capacity": null,
        "priceRange": null,
        "thumbnail": "https://example.com/praia-da-falesia-thumbnail.jpg"
      }
    ]
  }
}
```

Another example of query:

```graphql
query {
  searchPointsOfInterest(
    searchInput: {
      location: "Aveiro"
      category: "Restaurante"
      priceRange: "10€ - 20€"
    }
  ) {
    name
    location
    description
    startDate
    endDate
    capacity
    priceRange
    thumbnail
  }
}
```

With this query we can obtain name, location, description, opening and closing day, capacity, price range and photo of a list of restaurants located in Aveiro for a price range between 10 and 20 euros.

