import { PrismaClient } from '@prisma/client';
import { req, res } from 'express';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
