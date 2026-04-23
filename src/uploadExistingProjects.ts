import { projects } from './data';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

async function uploadInitialProjects() {
  for (const project of projects) {
    await setDoc(doc(db, 'projects', 'proj_' + project.id.toString()), {
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image
    });
  }
  console.log('Projects uploaded to Firestore.');
}

uploadInitialProjects().catch(console.error);
