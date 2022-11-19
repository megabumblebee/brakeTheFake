import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {AuthLoginDto} from "./dto/auth.login.dto";
import {User} from "../user/entities/user.entity";
import {comparePwd} from "../utils/compare-pwd";
import {JwtPayload} from "./jwt.strategy";
import {v4 as uuid} from 'uuid';
import {sign} from "jsonwebtoken";
import {Response} from 'express';
import {secretOrKey} from "../config/jwt.config";

@Injectable()
export class AuthService {

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          username: req.username,
        }
      });
      if(!(user && await comparePwd(req.pwd, user.pwdHash)))
        return res.json({error: 'Invalid login data!'});

      const token = await this.createToken(await this.generateToken(user), req.remember);

      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: 'localhost',    //TODO: do zmiany przy produkcji
          httpOnly: true,
        })
        .json({ok: true})
    } catch (e) {
      return res.json({
        error: e.message,
      });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();

      res.clearCookie(
        'jwt',
        {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        }
      );
      return res.json({ok: true});
    } catch (e) {
      return res.json({error: e.message});
    }
  }

  private async createToken(currentToken: string, remember: boolean): Promise<{ accessToken: string, expiresIn: number }> {
    const payload: JwtPayload = {id: currentToken};
    const expiresIn = remember ? 365 * 60 * 60 * 24 : 60 * 60 * 24; // 365 h / 24 h
    const accessToken = sign(payload, secretOrKey, {expiresIn});

    return {
      accessToken,
      expiresIn,
    }
  }

  private async generateToken(user: User): Promise<string> {
    const token = uuid();
    let userWithThisToken = null;
    do {
      userWithThisToken = await User.findOneBy({
        currentTokenId: token,
      });
    } while (!!userWithThisToken);

    user.currentTokenId = token; //TODO: więcej informacji o każdym tokenie (przeglądarka, urządzenie)
    await user.save();

    return token;
  }
}