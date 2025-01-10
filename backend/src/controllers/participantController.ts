import { Request, Response } from 'express';
import * as participantModel from '../models/participantModel';

export const listParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await participantModel.getAllParticipants();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
};

export const getParticipant = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const participant = await participantModel.getParticipantById(id);
    if (participant) res.json(participant);
    else res.status(404).json({ error: 'Participant not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
};

export const createParticipant = async (req: Request, res: Response) => {
  const participantData = req.body;
  try {
    const newParticipant = await participantModel.createParticipant(
      participantData
    );
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create participant' });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const participantData = req.body;
  try {
    const updatedParticipant = await participantModel.updateParticipant(
      id,
      participantData
    );
    if (updatedParticipant) res.json(updatedParticipant);
    else res.status(404).json({ error: 'Participant not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update participant' });
  }
};

export const deleteParticipant = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const success = await participantModel.deleteParticipant(id);
    if (success) res.json({ message: 'Participant deleted' });
    else res.status(404).json({ error: 'Participant not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete participant' });
  }
};
