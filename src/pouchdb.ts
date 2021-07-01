import PouchDB from "pouchdb"

async function testPouchdb(): Promise<void> {
  const db = new PouchDB("testdb")

  const info = await db.info()
  console.log(`info is`, info)
}

testPouchdb()
