import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // import.meta.url : mimic or refers the where current file is located 
const __dirname = path.dirname(__filename);  // dirname is the function which will give the directory name of the current file

export default{
 mode:"development",
 entry:path.resolve(__dirname,'src/index.js'), // __dirname : refer to the current directory
 // path.resolve make it full absolute path 
 output:{
    path:path.resolve(__dirname,"dist"),
    filename:"bundle.js"
 }
}