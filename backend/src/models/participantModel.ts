import { pool } from '../config/database';

export interface Participant {
  id: number;
  trialId: number;
  name: string;
}

export const getAllParticipants = async (): Promise<Participant[]> => {
  const result = await pool.query(
    'SELECT id, trial_id as "trialId", name FROM participants'
  );
  return result.rows;
};

export const getParticipantById = async (
  id: number
): Promise<Participant | null> => {
  const result = await pool.query(
    'SELECT id, trial_id as "trialId", name FROM participants WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const createParticipant = async (
  participantData: Partial<Participant>
): Promise<Participant> => {
  const { trialId, name } = participantData;
  const result = await pool.query(
    `INSERT INTO participants (trial_id, name)
     VALUES ($1, $2)
     RETURNING id, trial_id as "trialId", name`,
    [trialId, name]
  );
  return result.rows[0];
};

export const updateParticipant = async (
  id: number,
  participantData: Partial<Participant>
): Promise<Participant | null> => {
  const { trialId, name } = participantData;
  const result = await pool.query(
    `UPDATE participants
     SET trial_id = COALESCE($1, trial_id), name = COALESCE($2, name)
     WHERE id = $3
     RETURNING id, trial_id as "trialId", name`,
    [trialId, name, id]
  );
  return result.rows[0] || null;
};

export const deleteParticipant = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM participants WHERE id = $1', [id]);
  return result.rowCount > 0;
};
