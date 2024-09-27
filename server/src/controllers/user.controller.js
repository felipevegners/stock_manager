import {
  getUser,
  registerUser,
  deleteUser,
  updateUserRoles
} from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const index = async (req, res) => {
  try {
    const user = await getUser(req.query);
    res.status(200).json(user);
  } catch (err) {
    console.log("Erro index ---> ", err);
    res.status(400).send(err);
  }
};

export const create = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await getUser(email);
    if (user) {
      return res.status(400).json({ message: "Usuário já existente!" });
    }
    user = await registerUser(req.body);

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        roles: user.roles
      }
    };

    jwt.sign(payload, "secret", { expiresIn: 360000 }, (err, token) => {
      if (err) console.log(err);
      res.json({ token });
    });

    // res.status(200).json({ message: "Usuário cadastrado com sucesso!", user });
  } catch (err) {
    console.log("Erro create ---> ", err);
    res.status(400).send(err);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUser(email);
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Senha inválida. Tente novamente." });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        roles: user.roles
      }
    };

    jwt.sign(payload, "secret", { expiresIn: 360000 }, (err, token) => {
      if (err) console.log(err);
      res.json({ token });
    });
  } catch (error) {
    res.status(400).send(err);
  }
};

export const update = async (req, res) => {
  try {
    const user = await updateUserRoles(req);
    res
      .status(200)
      .json({ message: "Permissões do usuário alteradas com sucesso", user });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const remove = async (req, res) => {
  try {
    const user = await deleteUser(req.params);
    res.status(200).json({ message: "Usuário removido com sucesso!", user });
  } catch (err) {
    res.status(400).send(err);
  }
};
