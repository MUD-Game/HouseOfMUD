import * as mongoDB from "mongodb";
import * as mongoose from "mongoose";
import { Action, actionSchema } from "./action";
import { ActionEvent, actionEventSchema } from "./actionEvent";
import { Item, itemSchema } from "./item";

//opening a connection to a database
const connection = mongoose.createConnection("mongodb://127.0.0.1:27017/test");

//creating models (type safe collections) from predefined schemas
const itemModel = connection.model<Item>('Item', itemSchema)
const actionEventModel = connection.model<ActionEvent>("ActionEvent", actionEventSchema)
const actionModel = connection.model<Action>('ActionModel', actionSchema)
//TODO anlegen der models für alle Schemata

//creating documents inside those type safe collections
//if the document does not match the specified constraints, a ValidatorError is thrown
async function createAndStoreObjects() {

    const testitem = await itemModel.create({
        name : "testname",
        description : "testdesc"
    });
    
    const testactionevent = await actionEventModel.create({
        eventType: "addhp",
        value : "3"
    });
    
    const testaction = await actionModel.create({
        command : "test",
        output : "example output",
        description : "this is an example action",
        events: testactionevent,
        itemsneeded: testitem
    });
}

//query a document from a type save collection (by ID)
async function getActionResult() {
    const actionresult: Action = await actionModel.findOne(new mongoDB.ObjectId("62608678e25c3f84ddd4ecc6"));
    console.log(actionresult);
}

//query a referenced document inside another document from a type safe collection (by ID)
async function getItemFromActionResult() {
    const action = await actionModel.findOne(new mongoDB.ObjectId("62608678e25c3f84ddd4ecc6")).populate('itemsneeded')
    console.log(action.itemsneeded[0])
}

//createAndStoreObjects();
//getActionResult();
getItemFromActionResult();
