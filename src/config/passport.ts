import passport from 'passport';
import GooglePassport from 'passport-google-oauth20';
import { IOauthUser } from '../interface/auth-user.js';
import * as dotenv from 'dotenv';

const GoogleStrategy = GooglePassport.Strategy;
dotenv.config();

// This function normalizes the profile Object gotten from Google
export const userProfile = (profile: IOauthUser) => {
  const { id, name, emails, provider } = profile;

  let firstName;
  let lastName;
  let email;

  if (emails && emails.length) email = emails[0].value;
  if (name.givenName) firstName = name.givenName;
  if (name.familyName) lastName = name.familyName;

  return {
    id,
    firstName,
    lastName,
    email,
    provider,
  };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: '/google/auth/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) =>
      cb(null, userProfile(profile))
  )
);

export default passport;
