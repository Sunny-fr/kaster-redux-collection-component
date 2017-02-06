export default function (store) {
    return {
        tempModel: store.<%= lowercaseName %>.temp,
        collectionLoaded: store.<%= lowercaseName %>.loaded,
        collection: store.<%= lowercaseName %>.collection
    }
}

