import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // entender se é uma boa prática deixar o id aberto no header das rotas
    req.userId = decoded.id;
    // req.userId = await bcrypt.hash(toString(decoded.id), 8);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
