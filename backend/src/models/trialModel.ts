import { pool } from '../config/database';

export interface Trial {
  id: number;
  name: string;
  description?: string;
}

export const getAllTrials = async (): Promise<Trial[]> => {
  const result = await pool.query('SELECT id, name, description FROM trials');
  return result.rows;
};

export const getTrialById = async (id: number): Promise<Trial | null> => {
  const result = await pool.query(
    'SELECT id, name, description FROM trials WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const createTrial = async (
  trialData: Partial<Trial>
): Promise<Trial> => {
  const { name, description } = trialData;
  const result = await pool.query(
    'INSERT INTO trials (name, description) VALUES ($1, $2) RETURNING id, name, description',
    [name, description]
  );
  return result.rows[0];
};

export const updateTrial = async (
  id: number,
  trialData: Partial<Trial>
): Promise<Trial | null> => {
  const { name, description } = trialData;
  const result = await pool.query(
    `UPDATE trials
     SET name = COALESCE($1, name), description = COALESCE($2, description)
     WHERE id = $3
     RETURNING id, name, description`,
    [name, description, id]
  );
  return result.rows[0] || null;
};

export const deleteTrial = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM trials WHERE id = $1', [id]);
  return result.rowCount > 0;
};
