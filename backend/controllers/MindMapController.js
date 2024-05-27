const MindMap = require('../models/MindMapModel')
const fs = require('fs');
const path = require('path')
class MindMapController {
   async getAll(req, res) {
      try {
         const mindmaps = await MindMap.find({ creatorid: req.user }).sort('asc').select('-data')
         res.status(200).json({
            status: true,
            mindmaps
         })
      } catch (error) {
         res.status(201).json({
            status: false,
            message: error.message
         })
      }
   }
   async get(req, res) {
      try {
         const mindmap = await MindMap.findOne({ creatorid: req.user, _id: req.params.id })
         res.status(200).json({
            status: true,
            mindmap
         })
      } catch (error) {
         res.status(201).json({
            status: false,
            message: error.message
         })
      }
   }
   async updateOne(req, res) {
      try {

         const base64Data = req.body.thumbnail.replace(/^data:image\/png;base64,/, '');
         const filename = `thumbnail_${req.params.id}.png`;
         const savePath =  path.join(__dirname, '..', 'public', filename);
         fs.writeFileSync(savePath, base64Data, 'base64', (err) => {
            if (err) {
               console.error('Error saving thumbnail:', err);
            } else {
               console.log('Thumbnail saved successfully:', savePath);
            }
         });

         const response = await MindMap.updateOne({ _id: req.params.id, creatorid: req.user }, { $set: {...req.body , thumbnail : process.env.BACKEND_URL + filename} }, { new: true });
         res.status(200).json({
            status: true,
            response
         })
      } catch (error) {
         res.status(201).json({
            status: false,
            message: error.message
         })
      }
   }
   async createOne(req, res) {
      try {
         const mindmap = await MindMap.create({ ...req.body, creatorid: req.user })

         res.status(200).json({
            status: true,
            mindmap
         })
      } catch (error) {
         res.status(201).json({
            status: false,
            message: error.message
         })
      }
   }
   async removeOne(req, res) {
      try {
         const result = await MindMap.deleteOne({ _id: req.params.id, creatorid: req.user })
         console.log(result)
         res.json({
            status: result.deletedCount ? true : false,
            message: result.deletedCount ? 'MindMap Deleted' : 'Failed To Delete'
         })
      } catch (error) {
         res.status(201).json({
            status: false,
            message: error.message
         })
      }
   }
}


module.exports = new MindMapController()