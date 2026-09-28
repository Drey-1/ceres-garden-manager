import "dotenv/config"
import { app } from "./app.js";
import environmentValidator from "./env.js";

environmentValidator()

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
