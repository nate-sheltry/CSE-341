async function getAllDocuments(db, collectionName){
    const collection = db.collection(collectionName);
    return collection.find({}).toArray();
}

async function getRequestByName(db, collectionName, fname, lname){
    const collection = db.collection(collectionName);
    return collection.find({firstName:fname, lastName:lname}).toArray();
}

module.exports = {
    getAllDocuments,
    getRequestByName
}
