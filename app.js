const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,

} = require("graphql");

const schema = new GraphQLSchema({
    query : new GraphQLObjectType({
        name : "HelloWorld", //query name
        fields : () => ({
            message : { //query defenition
                type : GraphQLString,
                resolve : ()=>{
                    return 'Hello World';
                }
            }
        })
    })
})

const app = express();

app.use("/graphql",expressGraphQL({
    graphiql : true,
    schema,
}))

app.listen(5000 , ()=>{
    console.log("server running at port 5000");
})