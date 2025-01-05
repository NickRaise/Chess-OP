import { Router } from 'express'
import googleRouter from './googleAuth';
import githubRouter from './githubAuth';

const router = Router() 

router.use('/google', googleRouter)
router.use('/github', githubRouter)

export default router