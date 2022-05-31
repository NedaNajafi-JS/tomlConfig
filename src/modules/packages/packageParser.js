const path = require('path');
const {CACHE} = require('./../../shared/config/keys');
const fs = require('fs');

exports.readFile = (filename) => {
    fs.readFile(path.dirname(require.main.filename) + `/src/modules/packages/statics/${filename}`, 'utf8', async (err, data) => {

        let arr = data.split(/\n\s*\n/)
        arr = arr.filter(n => n);

        let packages = [];
        await Promise.all(arr.map(pack => {
            pack = pack.split('\r\n').filter(n => n)
            pack = pack.filter(pp => pp !== '[[package]]' && !pp.includes('version'));

            let json_ = {}
            let extra_json = {}
            let dependencies_json = []
            for (p of pack) {
                if (p === '[package.extras]') {
                    for (let i = 1; i < pack.length; i++) {
                        let j = pack[i].split(' = ');
                        extra_json[j[0]] = j[1];
                    }

                    break;

                } else if (p === '[package.dependencies]') {

                    for (let i = 1; i < pack.length; i++) {
                        let j = pack[i].split(' = ');
                        if (j[0]) {
                            dependencies_json.push(j[0].replace(/ /g, ""));
                        }
                    }

                    break;
                }

                let j = p.split('=');
                if (j[0] && j[1]) {
                    j[1] = j[1].replace(/"/g, "");
                    j[0] = j[0].replace(/ /g, "");
                    if (j[0] === 'description') {
                        json_[j[0]] = j[1];
                    } else {
                        json_[j[0]] = j[1].replace(/ /g, "");
                    }
                }
            };

          /*if(Object.keys(extra_json).length > 0){
            packages[packages.length - 1].extra = extra_json;
            extra_json = {};
          }else */if (Object.keys(dependencies_json).length > 0) {
                packages[packages.length - 1].dependencies = dependencies_json;
                dependencies_json = {};
            } else {
                packages.push(json_)
            }

        }));

        packages = await packages.filter(n => Object.keys(n).length > 0)
        packages.sort((a, b) => a.name < b.name ? -1 : 1);
        packages.splice(packages.length - 2, 2)
        CACHE.set('config', packages);

        fs.unlink(path.dirname(require.main.filename) + `/src/modules/packages/statics/${filename}`, (err) => {
            console.log(err)
        });

        Promise.resolve(true)
    });
}