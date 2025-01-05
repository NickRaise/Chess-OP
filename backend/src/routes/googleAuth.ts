import { Router } from 'express'
import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = Router()

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth credentials in environment variables');
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + "/auth/google/callback",
},
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
        return done(null, profile)
    })
)

router.get('/',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)

router.get('/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/')
    }
)

export default router