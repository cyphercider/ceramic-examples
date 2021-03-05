import Ceramic from "@ceramicnetwork/http-client"
import { IDX } from "@ceramicstudio/idx"

const aliases = {
  alias1: "definitionID 1",
  alias2: "definitionID 2",
}

async function testIdx(): Promise<void> {
  const ceramic = new Ceramic("http://localhost:7007")
  const idx = new IDX({ ceramic, aliases })

  // ceramic.setDIDProvider(idx.)
}

testIdx()
