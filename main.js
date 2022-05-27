let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);

let types = {
    media: ["mp4", "mkv", "jpg", "png"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

let command = inputArr[0];
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please enter correct command");
        break;
}

function treeFn(dirPath) {
    if (dirPath == undefined) {
        console.log("Kindely enter the path");
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "  ")

        }
        else {
            console.log("Kindely enter the correct path");
            return;
        }

    }
}
function treeHelper(dirPath, indent) {

    let isFile = fs.lstatSync(dirPath).isFile();

    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);

        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }

}

function organizeFn(dirPath) {

    let destPath;

    if (dirPath == undefined) {
        console.log("Kindely enter the path");
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {

            destPath = path.join(dirPath, "organized_files");

            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        }
        else {
            console.log("Kindely enter the correct path");
            return;
        }

    }
    console.log("organize command implemented for ", dirPath);
    organizeHelper(dirPath, destPath);

}
function organizeHelper(src, dest) {

    let childNames = fs.readdirSync(src);

    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {

            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to ---->", category);

            sendFiles(childAddress, dest, category);
        }
    }
}
function sendFiles(srcFilePath, dest, category) {

    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }



    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);

    console.log(fileName, " copied to ", category);

}
function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);

    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}


function helpFn() {

    console.log(`
    List of all commands
        node main.js tree "directoryPath"
        node main.js organsie "directoryPath"
        node main.js help
    `);
}
