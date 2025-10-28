import { Request, Response } from "express";

export const getAllRents = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: 'Fetched all rent listings successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rent listings' });
  }
};


export const getRentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ message: `Fetched rent listing with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rent listing details' });
  }
};

export const createRent = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({ message: 'Rent listing created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create rent listing' });
  }
};


export const updateRent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ message: `Rent listing with ID ${id} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rent listing' });
  }
};


export const deleteRent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ message: `Rent listing with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete rent listing' });
  }
};
