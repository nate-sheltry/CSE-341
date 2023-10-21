const {ObjectId} = require('mongodb');

async function postData(db, collectionName, newData){
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(newData);
    return result;
}

async function putData(db, collectionName, id, newData){
    const collection = db.collection(collectionName);
    const updatedData = await collection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        { $set: newData },
        {returnOriginal: false}
    );
    console.log(updatedData);
    if(updatedData == null){
        return 'errors';
    }
    return updatedData;
}

async function deleteData(db, collectionName, id){
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if(result.deletedCount === 1)
        console.log('Document deleted successfully');
    else
        result.error = 'Document not found.';
    return result;
}

module.exports = {
    postData,
    putData,
    deleteData
};