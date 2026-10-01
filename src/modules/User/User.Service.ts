import prisma from "../../lib/db.js";
import type { IAddressBody } from "./User.Interface.js";

class userService {
  findUserAddresses = async (id: string) => {
    const addresses = await prisma.address.findMany({
      where: {
        userId: id
      }
    })

    return addresses
  }

  addAddress = async (userId: string, body: IAddressBody) => {
    const data = await prisma.address.create({
      data: {
        userId: userId,
        state: body.state,
        city: body.city,
        country: body.country,
        isDefault: body.isDefault,
        streetAddress: body.streetAddress
      }
    })

    return data
  }

  updateAddress = async (id: string, body: IAddressBody) => {
    const data = await prisma.address.update({
      where: {
        id: id
      },
      data: {
        state: body.state,
        city: body.city,
        country: body.country,
        isDefault: body.isDefault,
        streetAddress: body.streetAddress
      }
    })

    return data
  }

  deleteAddress = async (id: string) => {
    const data = await prisma.address.delete({
      where: {
        id: id
      }
    })

    return data
  }
}

export default new userService()