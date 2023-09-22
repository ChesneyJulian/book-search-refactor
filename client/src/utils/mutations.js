import { gql } from '@apollo/client';
// client side mutations

// mutation to add user and specify all arguments and return fields
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`
// mutation to login user and specify all arguments and return fields
export const LOGIN_USER = gql`
  mutation loginUser($username: String, $email: String, $password: String!) {
    loginUser(username: $username, email: $email, password: $password) {
      token 
      user {
        _id
        username
      }
    }
  }
`
// mutation to save a book to the user's accounts and specify all arguments and return fields
export const SAVE_BOOK = gql`
  mutation saveBook($authors: [String], $description: String, $title: String, $bookId: String, $image: String, $link: String){
    saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, link: $link){
      _id
      username
      savedBooks {
        authors 
        bookId
        description
        title
        image
        link
      }
    }
  }
`
// mutation to remove a book from the user's account and specify all arguments and return fields
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!){
    removeBook(bookId: $bookId){
      _id
      username
      savedBooks {
        authors 
        bookId
        description
        title
      }
    }  
  }
`