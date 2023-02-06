import { ExpressApp } from './app';
import {
  UserRouter,
} from './routes';

const PORT = Number(process.env.PORT) || 8000;

const app = new ExpressApp([
  new UserRouter(),
]);
app.listen(PORT);
