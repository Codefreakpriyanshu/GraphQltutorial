const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')
const app = express()

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name:"HelloWorld",
//         fields: () => ({
//             message:{
//                 type:GraphQLString,
//                 resolve: () =>'Hello World'
//             } 
//         })
//     })
// })
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
    name:"AuthorBook",
    description:'this represents author',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        book:{
            type:new GraphQLList(BookType),
            resolve:(authors)=>{
                return books.filter(book => book.authorId===authors.id)
            }
        } 
    })
})
const BookType = new GraphQLObjectType({
    name:"Book",
    description:'this represents a book written by an author',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{
            type:AuthorType,
            resolve:(books)=>{
                return authors.find((author => author.id === books.authorId))
            }
        }
    })
})
const RootQueryType = new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:()=>({
        book:{
            type:BookType,
            description:"Return a single book",
            args:{
                id: {type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return books.find(book => args.id === book.id)
            }
        },
        books :{
            type:new GraphQLList(BookType),
            description:'List of all books',
            resolve:()=>books                                                                                                               
        },
        author :{
            type:new GraphQLList(AuthorType),
            description:'List of all author',
            resolve:()=>authors                                                                                                               
        }
        
    })
})  
const RootMutationType = new GraphQLObjectType({
    type:"Mutation",
    description:"Root Mutation",
    fields:()=>({
        addBook:{
            type:BookType,
            description:"Add a single Book",
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book = {id: books.length+1, name:args.name, authorId:args.authorId}
                books.push(book)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
})

app.use('/graphql', graphqlHTTP ({
    schema : schema,
    graphiql:true,
}))
app.listen(5000,()=>{console.log("Server has started")})