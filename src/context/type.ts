export interface loggedInUserType {
  id: string;
  name: string;
  profileUrl: string;
  status: string;
  twitter_id?: string;
  linkedin_id?: string;
  github_id: string;
  username: string;
  token: string;
  designation: string;
  company: string;
}

export interface User {
  name: string;
  profileUrl: string;
  userName: string;
  designation: string;
  company: string;
  linkedInUrl: string;
  twitterUrl: string;
  githubUrl: string;
}
