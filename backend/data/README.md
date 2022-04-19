## Nutzen der mongoose schemas

Objekte, die in der Datenbank gespeichert werden sollen, sollen über mongoose schemas angelegt werden 


#### Anlegen eines Objekts:

```typescript
const testitem = new item({
    name : "testname",
    description : "testdesc"
});

const testactionevent = new actionEvent({
    eventType: "addhp",
    value : "3"
});

const testaction = new action({
    command : "test",
    output : "example output",
    description : "this is an example action",
    events: testactionevent,
    itemsneeded: testitem
});
```

Für die referenzierten Datensätze wird lediglich die ObjectID gespeichert.
```json
{
    "_id":{"$oid":"625ed96aea4efe20a2d679a5"},
    "command":"test",
    "output":"example output",
    "description":"this is an example action",
    "events":[{"$oid":"625ed96aea4efe20a2d679a4"}],
    "itemsneeded":[{"$oid":"625ed96aea4efe20a2d679a3"}]
}
```