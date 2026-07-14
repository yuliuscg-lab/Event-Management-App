import { userRepository } from "../repositories/user.repository";

export class UserService {
  async findAll() {
    return userRepository.findAll();
  }

  async findById(id: string) {
    return userRepository.findById(id);
  }

  async create(data: any) {
    return userRepository.create(data);
  }

  async update(id: string, data: any) {
    return userRepository.update(id, data);
  }

  async delete(id: string) {
    return userRepository.delete(id);
  }

}

export const userService = new UserService();