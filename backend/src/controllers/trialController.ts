import { Request, Response } from 'express';
import * as trialModel from '../models/trialModel';

export const listTrials = async (req: Request, res: Response) => {
  try {
    const trials = await trialModel.getAllTrials();
    res.json(trials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trials' });
  }
};

export const getTrial = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const trial = await trialModel.getTrialById(id);
    if (trial) res.json(trial);
    else res.status(404).json({ error: 'Trial not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trial' });
  }
};

export const createTrial = async (req: Request, res: Response) => {
  const trialData = req.body;
  try {
    const newTrial = await trialModel.createTrial(trialData);
    res.status(201).json(newTrial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trial' });
  }
};

export const updateTrial = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const trialData = req.body;
  try {
    const updatedTrial = await trialModel.updateTrial(id, trialData);
    if (updatedTrial) res.json(updatedTrial);
    else res.status(404).json({ error: 'Trial not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trial' });
  }
};

export const deleteTrial = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const success = await trialModel.deleteTrial(id);
    if (success) res.json({ message: 'Trial deleted' });
    else res.status(404).json({ error: 'Trial not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trial' });
  }
};
