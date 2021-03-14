import gql from 'graphql-tag';

export const USER_QUERY = gql`
  query User {
    user {
      email
      firstName
      id
      lastName
      avatar {
        id
        downloadUrl
      }
    }
  }
`;

export const USER_SIGNUP_MUTATIONS = gql`
  mutation UserSignup($authProfileId: ID, $user: UserCreateInput!) {
    userSignUpWithToken(authProfileId: $authProfileId, user: $user) {
      email
      firstName
      id
      lastName
      avatar {
        id
        downloadUrl
      }
    }
  }
`;
 