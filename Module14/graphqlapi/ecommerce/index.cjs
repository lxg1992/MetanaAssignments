const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String
    products: [Product!]!
    product(name: String!): Product
  }

  type Product {
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    onSale: Boolean!
  }
`;

const products = [
  {
    name: "Product 1",
    description: "This is product 1",
    quantity: 10,
    price: 2.99,
    onSale: true,
  },
  {
    name: "Product 2",
    description: "This is product 2",
    quantity: 20,
    price: 3.99,
    onSale: false,
  },
  {
    name: "Product 3",
    description: "This is product 3",
    quantity: 30,
    price: 4.99,
    onSale: true,
  },
  {
    name: "Product 4",
    description: "This is product 4",
    quantity: 40,
    price: 5.99,
    onSale: false,
  },
  {
    name: "Product 5",
    description: "This is product 5",
    quantity: 50,
    price: 6.99,
    onSale: true,
  },
];

const resolvers = {
  Query: {
    hello: () => "Hello World",
    products: () => products,
    product: (parent, args, context) => {
      const productName = args.name;
      const product = products.find((product) => product.name === productName);
      return product;
    },
    //Take the following
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
