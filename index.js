const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
// axios.get('https://xkcd.com/').then((response)=> {
//     const $ = cheerio.load(response.data);
//     console.log('callback', $('#comic img').attr('src'));
// });
async function download(url, filename){
    const writer = fs.createWriteStream(path.resolve(__dirname, filename));
    const response = await axios.get(url, {responseType: 'stream'});
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}


(async ()=> {
    for(let i = 2462; i>2452; i--){
        let response = await axios.get(`https://xkcd.com/${i}/`);
        const $ = cheerio.load(response.data);
        let src = 'https:' + $('#comic img').attr('src');
        console.log(src);
        let parts = src.split('/');
        await download(src, 'images/'+parts[parts.length-1]);
    }
})();

