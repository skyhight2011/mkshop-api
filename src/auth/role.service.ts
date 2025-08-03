import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument, RoleLevel } from '../schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: Partial<Role>): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async findByLevel(level: RoleLevel): Promise<Role[]> {
    return this.roleModel.find({ level }).exec();
  }

  async update(id: string, updateRoleDto: Partial<Role>): Promise<Role> {
    const role = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async remove(id: string): Promise<Role> {
    const role = await this.roleModel.findByIdAndDelete(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    const role = await this.roleModel.findById(roleId).exec();
    return role?.permissions.includes(permission) || false;
  }

  async getDefaultRole(): Promise<Role> {
    const defaultRole = await this.roleModel.findOne({ level: RoleLevel.USER }).exec();
    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }
    return defaultRole;
  }
}
