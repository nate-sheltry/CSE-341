const NONE = 'NONE';

async function getPlayers(db, collectionName, playerName, gameName, refund, purchase, lastPlay, playerId){
    const collection = db.collection(collectionName);
    const query = {};
    if(playerName != NONE) query.name = playerName;
    if(gameName != NONE) query.game = gameName;
    if(refund != NONE) query.refundWindow = refund;
    if(purchase != NONE) query.purchaseDate = purchase;
    if(lastPlay != NONE) query.lastPlayed = lastPlay;
    if(playerId != NONE) query.id = playerId;
    console.log(await collection.find(query).toArray());
    return collection.find(query).toArray();
}

module.exports = {
    getPlayers
};