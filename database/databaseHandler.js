import path from "path";
import url from "url";
import fs from "fs/promises";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readLoginData = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "loginDatabase.json"),
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error reading data: ${error}`);
    return [];
  }
};


export const writeLoginData = async (data) => {
  try {
    await fs.writeFile(
      path.join(__dirname, "loginDatabase.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.log(`Error writing data: ${error}`);
  }
};

export const readUserData = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "userInfo.json"),
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error reading data: ${error}`);
    return [];
  }
};

export const writeUserData = async (data) => {
  try {
    await fs.writeFile(path.join(__dirname, "userInfo.json"), JSON.stringify(data, null, 2), "utf-8");
    return data;
  } catch (error) {
    console.log(`Error writing data: ${error}`);
  }
};

