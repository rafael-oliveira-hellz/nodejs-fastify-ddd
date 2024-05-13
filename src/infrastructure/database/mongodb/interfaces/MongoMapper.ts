import { Document, WithId } from "mongodb";

interface MongoMapper<TDomain, TMongo> {
  toMongoDocument(entity: TDomain): TMongo;
  fromMongoDocument(doc: WithId<Document>): TDomain;
}
