// compile code will go here
const path = require('path'); //dosya yolunu almak için
const fs = require('fs'); //dosya içeriğini okumak için
const solc = require('solc'); //solidity derleyicisi


const inboxPath = path.resolve(__dirname,'contracts','Inbox.sol');
const source = fs.readFileSync(inboxPath,'utf-8');

module.exports=solc.compile(source,1).contracts[':Inbox'];//dosya içieriği ve derleyemeye çalıştığımız sözleşme sayisi.
//module ezporst ile projedeki diger dosyalar icin de kullanilabilir hale getirdik
//once sozleşmelere atifta bulunduk sonra da sozleşmedeki inbox'u cektik
