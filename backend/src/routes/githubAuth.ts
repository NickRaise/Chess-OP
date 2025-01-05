import { Router, Request, Response } from 'express'
import passport from "passport"
import { Strategy as GithubStrategy } from 'passport-github2';

const router = Router()

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth credentials in environment variables');
}

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + "/auth/github/callback",
},
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
        return done(null, profile)
    })
)

router.get('/',
    passport.authenticate('github', { scope: ['user', 'email'] })
)

router.get('/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect("/")
    }
)

export default router