import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
// import { UserModel } from '../models'
import * as model from '../utils/types'
import * as dto from '../utils/types.dto'
import { TokenObj } from '../utils/token'
import errorGenerator from '../utils/errorGenerator'
import dotenv from 'dotenv'
dotenv.config()
