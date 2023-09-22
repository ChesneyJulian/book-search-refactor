import { gql } from '@apollo/client';
// client side query to get all data for the user's personal account
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        title
        bookId
        description
        authors
        image
        link
      }
    }
  }
`