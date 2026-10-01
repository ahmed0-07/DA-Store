import { User as prismaUser} from "@prisma/client";
import { IUser } from "../../modules/User/User.Interface.ts";
declare global {
  namespace Express {
    interface User extends prismaUser { }
    interface Request {
      User?: IUser
    }
  }
}