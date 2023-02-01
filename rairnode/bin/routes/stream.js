const express = require('express');
const url = require('url');
const { validation, streamVerification } = require('../middleware');
const { MediaViewLog } = require('../models');

const updateVideoAnalytics = async (req, res, next) => {
  const { viewLogId } = req.session;
  const viewData = await MediaViewLog.findById(viewLogId);
  const requestedFile = url.parse(req.url).pathname;
  if (viewData && requestedFile.includes('.ts')) {
    const currentChunk = requestedFile.split('p')[1]?.split('.ts')[0];
    if (currentChunk && currentChunk > viewData.decryptedFiles) {
      viewData.decryptedFiles = currentChunk;
      viewData.save();
    }
  }
  next();
};

module.exports = (context) => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /stream/{token}/{mediaId}/{fileName}:
   *   post:
   *     description: Register a new piece of media. Optionally provide a decrypt key
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: token
   *         description: The JSON web token granted by the auth API to access the media given by the mediaId. Must be current and generated by this node.
   *         schema:
   *           type: string
   *         required: true
   *       - in: path
   *         description: RAIR unique identifier for a piece of media.
   *         name: mediaId
   *         schema:
   *           type: string
   *         required: true
   *       - in: path
   *         description: Sub-file of the media. For HLS can be a manifest/playlist file (.m3u8) or a media chunk (.ts) or the rair.json manifest
   *         name: fileName
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Returns if added successfully
   */
  router.use(
    '/:mediaId',
    streamVerification,
    validation('stream', 'params'),
    updateVideoAnalytics,
    context.hls.middleware,
  );

  return router;
};
