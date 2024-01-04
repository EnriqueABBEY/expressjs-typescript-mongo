import { commentRoutes } from './src/routes/comment.routes';
import { postRoutes } from './src/routes/post.routes';
import { userRoutes } from './src/routes/user.routes';
import { connectdb } from './src/config/database';
import { authRoutes } from './src/routes/auth.routes';
import * as express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();
const port: number = 8000;

connectdb();
const app: Application = express();

//middleware pour les traiter les données des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public/uploads/", express.static(path.join(__dirname, 'public/uploads')));

//project routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.listen(port, () => console.log(`Server listenning on port ${port}`));