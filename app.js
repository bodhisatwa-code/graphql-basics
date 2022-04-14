const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,

} = require("graphql");

const {authors,books} = require('./dummy_data');

const AuthorType = new GraphQLObjectType({
    name : "Author",
    description : "A person who writes books",
    fields : () =>({
        id : {type : new GraphQLNonNull(GraphQLInt)},
        name : {type : new GraphQLNonNull(GraphQLString)},
        books : {
            type : new GraphQLList(BookType),
            resolve : (author,args)=>{
                return books.filter(_b=>_b.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name : "Book",
    description : "A book written by an author",
    fields : () =>({
        id : { type : new GraphQLNonNull(GraphQLInt)},
        name : {type : new GraphQLNonNull(GraphQLString)},
        authorId : {type : new GraphQLNonNull(GraphQLInt)},
        author : {
            type : AuthorType,
            resolve : (book,args)=>{
                return authors.find(_A => _A.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name : "Query",
    description : "Root query",
    fields : () => ({
        book : {
            type : BookType,
            description : "details of a book",
            args : {
                id : {type : GraphQLInt}
            },
            resolve : (parent,args) => {
                return books.find(_b=>_b.id === args.id)
            }
        },
        author : {
            type : AuthorType,
            description : "One author",
            args : {
                id : {type : GraphQLInt}
            },
            resolve : (parent,{id}) => authors.find(_a=>_a.id === id)
        },
        books : {
            type : new GraphQLList(BookType),
            description : "list of books",
            resolve : () => books
        },
        authors : {
            type : new GraphQLList(AuthorType),
            description : "list of authors",
            resolve : () => authors,
        }
    })
})

const RootMutationQuery = new GraphQLObjectType({
    name : "Mutation",
    description : "Root mutations",
    fields : () =>({
        addBook : {
            type : BookType,
            description : "Add a book into the list",
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                authorId : {type : new GraphQLNonNull(GraphQLInt)},
            },
            resolve : (parent,{name,authorId}) => {
                const newBook = {
                    id : (books.length + 1),
                    name,
                    authorId,
                }
                books.push(newBook);
                return newBook;
            }
        },
        addAuthor : {
            type : AuthorType,
            description : "adds a new author",
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)}
            },
            resolve : (parent,{name}) =>{
                const newAuthor = {
                    id : authors.length + 1,
                    name,
                }
                authors.push(newAuthor);
                return newAuthor;
            }
        }
    })
})

const RootSubscriptionQuery = new GraphQLObjectType({
    name : "Subscription",
    description : "Root subscription",
    fields : ()=>({
        
    })
})

const schema = new GraphQLSchema({
    query : RootQueryType,
    mutation : RootMutationQuery,
    subscription : RootSubscriptionQuery
})

const app = express();

app.use("/graphql",expressGraphQL({
    graphiql : true,
    schema,
}))

app.listen(5000 , ()=>{
    console.log("server running at port 5000");
})