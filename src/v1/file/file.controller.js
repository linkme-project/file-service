const File = require('../models/file');
const RESULT_CODE = require('../constants').RESULT_CODE;

exports.create = async (fileInfo) => {
  const { 
    fileName, 
    fileSize, 
    fileUrl, 
    regDate
  } = fileInfo;

  // create file instance
  const file = new File({
    fileName,
    fileSize,
    fileUrl,
    regDate
  });

  // insert file record into mongodb
  try {
    await file.save();
  } catch (e) {
    return RESULT_CODE.FAIL;
  }

  return file;
};

exports.search = async (fileId) => {
  let file;

  file = await File.find({ _id: fileId }).exec();
  if (file.length == 0) return null;

  let result = {
    fileSn: file[0]._id,
    fileName: file[0].fileName,
    fileSize: file[0].fileSize,
    fileUrl: file[0].fileUrl,
    regDate: file[0].regDate 
  };

  return result;
};