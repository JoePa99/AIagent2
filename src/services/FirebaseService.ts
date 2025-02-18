import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private storage: Storage;

  constructor(firebaseConfig: any) {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  async saveTemplate(template: Template): Promise<void> {
    const templateRef = doc(this.db, 'templates', template.id);
    await setDoc(templateRef, template);
  }

  async getTemplate(templateId: string): Promise<Template> {
    const templateRef = doc(this.db, 'templates', templateId);
    const templateSnap = await getDoc(templateRef);
    return templateSnap.data() as Template;
  }

  async saveDocument(repoId: string, document: Document): Promise<string> {
    // Save document metadata to Firestore
    const docRef = doc(collection(this.db, `repositories/${repoId}/documents`));
    await setDoc(docRef, document);

    // Upload file to Storage if exists
    if (document.file) {
      const storageRef = ref(this.storage, `repositories/${repoId}/documents/${docRef.id}`);
      await uploadBytes(storageRef, document.file);
      document.url = await getDownloadURL(storageRef);
      await setDoc(docRef, document); // Update with URL
    }

    return docRef.id;
  }
} 