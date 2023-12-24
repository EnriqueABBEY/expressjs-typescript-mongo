import { postRoutes } from './src/routes/post.routes';
import { userRoutes } from './src/routes/user.routes';
import { connectdb } from './src/config/database';
import { authRoutes } from './src/routes/auth.routes';
import * as express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const port: number = 8000;

connectdb();
const app: Application = express();

//middleware pour les traiter les données des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//project routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => console.log(`Server listenning on port ${port}`));