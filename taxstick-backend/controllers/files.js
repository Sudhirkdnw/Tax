const {s3Upload} = require('../utils/awsS3Bucket');

exports.uploadFiles = async (req, res, next) => {
    const {email} = res.locals.user;
    try {
        const results = await s3Upload(req.files, email);
        return res.status(200).json({
            status: true,
            message: 'File uploaded successfully!',
            url: results[0].Location
        });
    } catch (error) {
        return res.status(500).json({
            status: true,
            message: error.message
        })
    }
}
