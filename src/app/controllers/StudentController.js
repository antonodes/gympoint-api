import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import Student from '../models/Student';

class StudentControler {
  async searchStudents(req, res, next) {
    const { name } = req.query;
    
    if(name) {
        return await findByName(name);
    }
        return await findAll();
  }
  
  //metodo que vai chamar o serviço para buscar todos os estudantes
  async findAll() {}
      
   //metodo que vai chamar o serviço para buscar todos os estudantes com aquele nome
  async findAll() {}

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.message });
    });

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { name, email, age, weight, height } = await Student.create(req.body);

    return res.json({
      student: {
        name,
        email,
        age,
        weight,
        height,
      },
    });
  }

  async update(req, res) {
    // este código se repete, verificar padrões de projeto para criação
    // de funcões de verificação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(400).json({ error: err.message });
    });

    const { email, name, age, weight, height } = req.body;
    const student = await Student.findOne({ where: { id: req.params.id } });

    if (email !== student.email) {
      // Verificação em todas tabelas se o e-mail já está em uso
      // Procurar por padrões de projeto pois não tenho ctz se chamar uma
      // model de outro controller que não é o seu é uma boa prática
      const userExists = await User.findOne({ where: { email } });
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists || userExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentControler();
