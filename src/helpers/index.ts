import crypto from "crypto";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jwt from "jsonwebtoken";

dayjs.extend(utc);

export const SECRET = "JONVITER-REST-API";

export const random_bytes = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const isBodyEmpty = (obj: any) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const executionError = (status: any, message: any) => {
  return { executionError: true, status, message };
};

export const formatToISO = (dateStr: any) => {
  const [date, time] = dateStr.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);

  // buat date sebagai UTC (kurangi 7 jam)
  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour - 7, minute, second),
  );

  return utcDate.toISOString().replace("Z", "+00:00");
};

export const toUTCISOString = (dateStr: string): string => {
  if (!dateStr) return dateStr;
  const date = new Date(dateStr.replace(" ", "T"));
  return date.toISOString().replace("Z", "+00:00");

  // new Date("2022-02-18 04:07:53").toISOString() => mengembalikan for
};

// Mengembalikan format ke awal date dan jam
export const toWIBFormat = (utcString: string): string => {
  return dayjs(utcString).utc().utcOffset(7).format("YYYY-MM-DD HH:mm:ss");
};

export const verifyPassword = (password: string, hash: string) => {
  let curr_hash = hash;
  curr_hash = curr_hash.replace("$2y$", "$2b$"); // Convert Laravel's format to Node.js compatible
  let check_password = bcrypt.compare(password, curr_hash);
  return check_password;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  // Optional: convert ke format Laravel ($2y$)
  return hash.replace("$2b$", "$2y$");
};

export const generateToken = async (_id: string): Promise<string> => {
  return jwt.sign({ _id }, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { _id: string } => {
  return jwt.verify(token, SECRET) as { _id: string };
};
