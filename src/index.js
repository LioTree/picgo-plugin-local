const fs = require('fs');

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('local', {
      handle(ctx) {
        let userConfig = ctx.getConfig('picBed.local')
        if (!userConfig) {
          throw new Error('Can\'t find uploader config')
        }

        try {
          let imgList = ctx.output
          for (let i in imgList) {
            let image = imgList[i].buffer
            if (!image && imgList[i].base64Image) {
              image = Buffer.from(imgList[i].base64Image, 'base64')
            }

            let path = userConfig.Path
            ctx.log.info(path + imgList[i].fileName)
            fs.writeFileSync(path + imgList[i].fileName, image)
            delete imgList[i].base64Image
            delete imgList[i].buffer
            imgList[i]['imgUrl'] = imgList[i].fileName
          }
        } catch (err) {
          ctx.emit('notification', {
            title: '上传失败',
            body: JSON.stringify(err)
          })
        }
      },
      name: '本地文件系统',
      config: config
    })
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.local')
    if (!userConfig) {
      userConfig = {}
    }
    return [{
      name: 'Path',
      type: 'input',
      default: userConfig.Path,
      required: true,
      message: 'F:/image/ 后面加上/',
      alias: 'Path'
    }]
  }

  return {
    uploader: 'local',
    register
  }
}