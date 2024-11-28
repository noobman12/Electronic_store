import app from './src/app'
import mongoose from "mongoose";
import { globalConfig } from './src/constants/configs';
/// Start the server

const PORT = globalConfig.PORT

mongoose
.connect(globalConfig.MONGODB_URL as string)
  .then(() => {
    console.log('Connected to MongoDB');
    //should listen app here
  })
  .catch((err) => {
    console.error('Failed to Connect to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})