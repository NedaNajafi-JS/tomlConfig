const path = require('path');
const {CACHE} = require('./../../shared/config/keys');
const fs = require('fs');
const parser = require('./packageParser');


exports.index = (req, res, next) => {

    res.sendFile(path.dirname(require.main.filename) + '/src/modules/packages/statics/indexPack.html');
}

exports.viewPanel = (req, res, next) => {
    res.sendFile(path.dirname(require.main.filename) + '/src/modules/packages/statics/view.html');
}

exports.fillData = async (req, res, next) => {
    let data = CACHE.get('config');
    return res.status(200).json(data || []);
}

exports.get = async (req, res, next) => {

    let data_ = CACHE.get('config');

    if (!data_) {
        return res.status(200).json([]);
    }

    let data = await data_.find(pack => pack.name === req.params.id);

    let depToMe = await data_.filter(pack => pack.dependencies && pack.dependencies.includes(data?.name));
    data.depToMe = [];
    await Promise.all(depToMe.map(dep => {
        data.depToMe.push(dep.name)
    }));

    return res.status(200).json({ data });
}

exports.chooseFile = async (req, res, next) => {
    res.sendFile(path.dirname(require.main.filename) + '/src/modules/packages/statics/uploadFile.html');

}

const readFile = (filename) => {
    
}

exports.loadFile = async (req, res, next) => {

    try{
        if (req.fileValidationError) {
            return res.status(400).json('Ivalid input type');
        }

        await parser.readFile(req.file.filename);
        res.status(200).end();
    
        // await fs.readFile(path.dirname(require.main.filename) + `/src/modules/packages/statics/${req.file.filename}`, 'utf8', async (err, data) => {
    
        //     let arr = data.split(/\n\s*\n/)
        //     arr = arr.filter(n => n);
    
        //     let packages = [];
        //     await Promise.all(arr.map(pack => {
        //         pack = pack.split('\r\n').filter(n => n)
        //         pack = pack.filter(pp => pp !== '[[package]]' && !pp.includes('version'));
    
        //         let json_ = {}
        //         let extra_json = {}
        //         let dependencies_json = []
        //         for (p of pack) {
        //             if (p === '[package.extras]') {
        //                 for (let i = 1; i < pack.length; i++) {
        //                     let j = pack[i].split(' = ');
        //                     extra_json[j[0]] = j[1];
        //                 }
    
        //                 break;
    
        //             } else if (p === '[package.dependencies]') {
    
        //                 for (let i = 1; i < pack.length; i++) {
        //                     let j = pack[i].split(' = ');
        //                     if (j[0]) {
        //                         dependencies_json.push(j[0].replace(/ /g, ""));
        //                     }
        //                 }
    
        //                 break;
        //             }
    
        //             let j = p.split('=');
        //             if (j[0] && j[1]) {
        //                 j[1] = j[1].replace(/"/g, "");
        //                 j[0] = j[0].replace(/ /g, "");
        //                 if (j[0] === 'description') {
        //                     json_[j[0]] = j[1];
        //                 } else {
        //                     json_[j[0]] = j[1].replace(/ /g, "");
        //                 }
        //             }
        //         };
    
        //       /*if(Object.keys(extra_json).length > 0){
        //         packages[packages.length - 1].extra = extra_json;
        //         extra_json = {};
        //       }else */if (Object.keys(dependencies_json).length > 0) {
        //             packages[packages.length - 1].dependencies = dependencies_json;
        //             dependencies_json = {};
        //         } else {
        //             packages.push(json_)
        //         }
    
        //     }));
    
        //     packages = await packages.filter(n => Object.keys(n).length > 0)
        //     packages.sort((a, b) => a.name < b.name ? -1 : 1);
        //     packages.splice(packages.length - 2, 2)
        //     CACHE.set('config', packages);
            
        //     fs.unlink(path.dirname(require.main.filename) + `/src/modules/packages/statics/${req.file.filename}`, (err) => {
        //         console.log(err)
        //     });

        //     res.status(200).end();
        // });
    }catch(err){
        return res.status(400).json('Server error');
    }
    
}
