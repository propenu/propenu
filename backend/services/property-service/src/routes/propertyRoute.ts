// routes/auth.js
import express from 'express';
import { createBuyer, deleteBuyer, getAllBuyers, getBuyerById, updateBuyer } from '../services/buyService';
import { createSeller, deleteSeller, getAllSellers, getSellerById, updateSeller } from '../services/sellService';
import { createRent, deleteRent, getAllRents, getRentById, updateRent } from '../services/rentService';

const propertyRoute = express.Router();

// buyer's api's
propertyRoute.get('/buy', getAllBuyers);
propertyRoute.get('/buy/:id', getBuyerById);
propertyRoute.post('/buy', createBuyer);
propertyRoute.patch('/buy/:id', updateBuyer);
propertyRoute.delete('/buy/:id', deleteBuyer);



//sell  api's
propertyRoute.get('/sell', getAllSellers);
propertyRoute.get('/sell/:id', getSellerById);
propertyRoute.post('/sell', createSeller);
propertyRoute.patch('/sell/:id', updateSeller);
propertyRoute.delete('/sell/:id', deleteSeller);



//Rent api's
propertyRoute.get('/rent', getAllRents);
propertyRoute.get('/rent/:id', getRentById);
propertyRoute.post('/rent', createRent);
propertyRoute.patch('/rent/:id', updateRent);
propertyRoute.delete('/rent/:id', deleteRent);

export default propertyRoute;
