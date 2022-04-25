const fs = require('fs');
const { HandleError} = require('../helpers/handleUploadExceptions')
const {
  createDirectories,
  MoveApk,
  deleteImages
} = require('../helpers/fileUpdater')
const Apps = require('../models/App')


const newFileSaver = (files, name) => {
  let HomePath = `uploads/${name}`;
  let newApkPath = HomePath + `/${files[0]['newApkFILE'].name}`;
  let newBackIpath = HomePath + `/${files[0]['newBackImage'].name}`;
  let screenShootsPath = [];

  for (const file in files[0]) {
    if (file == 'newApkFILE') {
      files[0][file].mv(HomePath + `/${files[0][file].name}`, (err) => {
        HandleError();
      })
    }
    if (file == 'newBackImage') {
      files[0][file].mv(HomePath + `/backImage` + `/${files[0][file].name}`, (err) => {
        HandleError();
      })
    }
    if (file == 'newScreenshots') {

      for (let index = 0; index < files[0][file].length; index++) {
        files[0][file][index].mv(HomePath + `/screenshot` + `/${files[0][file][index].name}`, (err) => {
          HandleError();
        })
        screenShootsPath.push(HomePath + `/screenshot/${files[0][file][index].name}`)
      }
    }
  }

  const filesPath = {
    HomePath,
    newApkPath,
    newBackIpath,
    screenShootsPath
  }
  return filesPath
}


exports.updateApps = async (req, res) => {
  const newApkFILE = req.files.apk;
  const newBackImage = req.files.backImage;
  const newScreenshots = req.files.screenshots;
  const newFilesArray = [{
    newApkFILE,
    newBackImage,
    newScreenshots,
  }]


  const Paths = await Promise.resolve(Apps.getAppsPath(req.params.id, res.locals.dev.id));
  date = new Date(Paths[0].publishedDate);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  const theDate = year + '-' + month + '-' + dt;


  const directory = `uploads/${Paths[0].appName}/`;
  try {
    console.log("nigit")
    console.log(Paths[0].publishedDate)
    const ReturnedFolders = createDirectories(Paths);
    console.log(ReturnedFolders[0])
    console.log(ReturnedFolders[1])


    //Jumps these executions and continue

    // Promise.allSettled([await MoveApk(ReturnedFolders[0], ReturnedFolders[1])
    //   .catch((err) => {
    //     console.log(err)
    //   })
    // ]).
    // then(async Result => {
    //   console.log("inside delete then")
    //   if (Result[0].status == 'fulfilled') {
    //     await Promise.resolve(deleteImages(directory)).catch((err) => {
    //       console.log(err)
    //     });
    //   }
    // }).finally(async () => {
    //   console.log("inside finally theb")
    //     await Apps.updateApp(Paths[0].appid, theDate, ReturnedFolders[1])
    //      .catch(err =>{console.log(err)})
    //   })
    //   console.log("here we are")

                                                                                               // NEW PROCESS

      Promise.allSettled([
        await MoveApk(ReturnedFolders[0], ReturnedFolders[1]).catch((err) => { console.log(err)} ),
      ])


      // .then(newFileSaver(newFilesArray, Paths[0].appName))
      // .then(async (newFilesPath) => {
      //     await Apps.UpdateTheAppTable(newFilesPath.newApkPath, newFilesPath.screenShootsPath, newFilesPath.newBackIpath, Paths[0].appid)
      //     .catch(err => {
      //       console.log(err)
      //     })
      // }).catch(err => { console.log(err)})


  } catch (err) {
    if (err) {
      console.log("from here" + err)
      return
    }

  } finally {
    
    //console.log(newFilesArray, Paths[0].appName)
    // const newFilesPath = newFileSaver(newFilesArray, Paths[0].appName);
    // new Promise((resolve, reject) => {
    //   resolve(Apps.UpdateTheAppTable(newFilesPath.newApkPath, newFilesPath.screenShootsPath, newFilesPath.newBackIpath, Paths[0].appid).then(()=>{
    //     res.send("update completed");
    //   }).catch(err =>{
    //     reject(err)
    //   })
    //   );
    // })
  }
  res.send("done")
}


exports.StoreUpdated = (req, res) => {


  console.log('the store')
  res.send("stored")
}