import {ExpressApp} from './app';
import {AdminRouter, CartRouter, LoginRouter, ProductRouter, UserRouter,} from './routes';

const PORT = Number(process.env.PORT) || 8000

const app = new ExpressApp([
  new AdminRouter(),
  new CartRouter(),
  new LoginRouter(),
  // new OrderRouter(),
  new ProductRouter(),
  new UserRouter(),
])

app.listen(PORT)
