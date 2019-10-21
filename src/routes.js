import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', SessionController.store);

routes.use(auth);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
