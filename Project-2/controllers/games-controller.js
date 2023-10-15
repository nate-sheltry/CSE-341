const NONE = 'NONE';
const {ObjectId} = require('mongodb');

async function getGames(db, collectionName, gameName, year, beta){
    const collection = db.collection(collectionName);
    const query = {};
    if(gameName != NONE) query.name = gameName;
    if(year != NONE) query.releaseYear = year;
    if(beta != NONE) query.betaStatus = beta;
    console.log(await collection.find(query).toArray());
    return collection.find(query).toArray();
}

async function putGameData(db, collectionName, id, newData){
    const collection = db.collection(collectionName);
    const updatedData = await collection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        { $set: newData },
        {returnOriginal: false}
    );
    return updatedData;
}

async function deleteGameData(db, collectionName, id){
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if(result.deletedCount === 1)
        console.log('Document deleted successfully');
    else
        console.log('Document not found');
    return result;
}


module.exports = {
    getGames,
    putGameData,
    deleteGameData
};