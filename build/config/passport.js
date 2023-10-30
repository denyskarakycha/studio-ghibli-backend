import passport from 'passport';
import GooglePassport from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
const GoogleStrategy = GooglePassport.Strategy;
dotenv.config();
export const userProfile = (profile) => {
    const { id, name, emails, provider } = profile;
    let firstName;
    let lastName;
    let email;
    if (emails && emails.length)
        email = emails[0].value;
    if (name.givenName)
        firstName = name.givenName;
    if (name.familyName)
        lastName = name.familyName;
    return {
        id,
        firstName,
        lastName,
        email,
        provider,
    };
};
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/google/auth/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, cb) => cb(null, userProfile(profile))));
export default passport;
