import dotenv from 'dotenv';
dotenv.config();
import app from "./app";
const PORT = process.env.PORT;


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
