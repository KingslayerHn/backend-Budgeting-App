import mongoose from 'mongoose';
import keys from './keys';

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(keys.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('>>> Database connected');
  } catch (err) {
    console.log(err);
  }
}
