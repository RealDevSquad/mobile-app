import axios from 'axios';
import { urls } from '../../constants/appConstant/url';
import { User } from '../../context/type';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get(urls.GET_USER_DATA + userId, {
      headers: {
        cookie: '',
      },
    });
    const user = response.data.user;
    return {
      name: user.github_display_name,
      profileUrl: user.picture?.url,
      userName: user.username,
      designation: user.designation,
      company: user.company,
      linkedInUrl: urls.LINKEDIN + user.linkedin_id,
      twitterUrl: urls.GITHUB + user.twitter_id,
      githubUrl: urls.TWITTER + user.github_id,
    };
  } catch (error) {
    throw error;
  }
};
