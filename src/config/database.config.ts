import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongoUri = (): string => {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    return uri;
  }
  return 'mongodb://localhost:27017/mkshop';
};

export const databaseConfig: MongooseModuleOptions = {
  uri: getMongoUri(),
};
