const fs = require('fs')
const path = require('path')
const got = require('got')
const urls = [
    'https://game.gtimg.cn/images/lol/act/img/tft/js/chess.js', // 英雄
    'https://game.gtimg.cn/images/lol/act/img/tft/js/job.js', // 职业
    'https://game.gtimg.cn/images/lol/act/img/tft/js/race.js', // 种族
    'https://game.gtimg.cn/images/lol/act/img/tft/js/equip.js', // 装备
]

; (async () => {
    await fetchJsFile()
    await fetchImageFile()
    await fetchChessFile()
    await fetchChessChampionFile()
    await exportJsonFile()
})()

async function fetchJsFile() {
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        const { body } = await got(url, { responseType: 'json' })
        let jsBody = 'module.exports=\n' + JSON.stringify(body, null, '\t')
        let filepath = '../images/lol/act/img/tft/js/' + path.basename(url)
        await fs.promises.writeFile(filepath, jsBody)
    }
}

async function fetchImageFile(){
    var images=[]
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        let filepath = './images/lol/act/img/tft/js/' + path.basename(url)
        let jsData= JSON.stringify(require(filepath))
        let matchResult=jsData.match(/[a-zA-z]+:\/\/[a-zA-z\/.0-9\\-]*/ig)
        matchResult.forEach(url => {
            if(images.indexOf(url)==-1){
                images.push(url)
            }
        })
    }
    let imageDomain='https://game.gtimg.cn/'
    for (let i = 0; i < images.length; i++) {
        const fileurl = images[i]
        console.log(`${i+1}/${images.length} => ${fileurl}`)
        if(fileurl.substr(0,imageDomain.length)==imageDomain){
            try {
                let bf= await got(fileurl).buffer()
                fs.promises.writeFile(fileurl.substr(imageDomain.length),bf)
            } catch (error) {
                console.error(`${i+1}/${images.length} => ${fileurl} X 404`)
            }
           
        }
    }
}
async function fetchChessFile(){
    var chess=require('./images/lol/act/img/tft/js/chess.js')
    chess.data.name
    let imageDomain='https://game.gtimg.cn/'
    for (let i = 0; i < chess.data.length; i++) {
        const name = chess.data[i].name
        let fileurl='https://game.gtimg.cn/images/lol/tft/cham-icons/624x318/'+name
        console.log(`${i+1}/${chess.data.length} => ${fileurl}`)
        try {
            let bf= await got(fileurl).buffer()
            fs.promises.writeFile(fileurl.substr(imageDomain.length),bf)
        } catch (error) {
            console.error(`${i+1}/${ chess.data.length} => ${fileurl} X 404`)
        }
    }
}
async function fetchChessChampionFile(){
    var chess=require('./images/lol/act/img/tft/js/chess.js')
    chess.data.name
    let imageDomain='https://game.gtimg.cn/'
    for (let i = 0; i < chess.data.length; i++) {
        const name = chess.data[i].name
        let fileurl='https://game.gtimg.cn/images/lol/act/img/tft/champions/'+name
        console.log(`${i+1}/${chess.data.length} => ${fileurl}`)
        try {
            let bf= await got(fileurl).buffer()
            fs.promises.writeFile(fileurl.substr(imageDomain.length),bf)
        } catch (error) {
            console.error(`${i+1}/${ chess.data.length} => ${fileurl} X 404`)
        }
    }
}

async function exportJsonFile(){
    let imageDomain='https://game.gtimg.cn/'
    let cdnDomain='https://cdn.jsdelivr.net/gh/chaohui2/teamfight-tactics-data/'
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        let filepath = './images/lol/act/img/tft/js/' + path.basename(url)
        let jsData= JSON.stringify(require(filepath), null, '\t')
        let matchResult=jsData.match(/https:\/\/game.gtimg.cn\/[a-zA-z\/.0-9\\-]*/ig)
        matchResult.forEach(url => {
            let cdnurl=cdnDomain+url.substr(imageDomain.length)
            jsData= jsData.replace(url,cdnurl)
        })
        fs.promises.writeFile('data/'+path.basename(url)+'on',jsData)
}