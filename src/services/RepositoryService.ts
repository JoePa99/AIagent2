interface ClientRepository {
  id: string;
  clientId: string;
  name: string;
  description: string;
  documents: Document[];
  vectorStore: VectorStore;
}

class RepositoryService {
  async createRepository(clientId: string, name: string): Promise<ClientRepository>;
  async addDocument(repoId: string, document: Document): Promise<void>;
  async vectorizeDocument(document: Document): Promise<VectorizedDocument>;
  async searchSimilarContent(query: string, repoId: string): Promise<SearchResult[]>;
} 