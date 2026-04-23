import { pool } from '../db';

export const createPost = async (
  Id: number,
  title: string,
  content: string,
  userId: number
) => {
  const [result] = await pool.execute(
    'INSERT INTO posts (Id, title, content, user_id) VALUES (?, ?, ?)',
    [Id, title, content, userId]
  );
  return result;
};