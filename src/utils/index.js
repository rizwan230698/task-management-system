import { firestore } from "../firebase";

export const deleteCommentsAndFiles = async (id) => {
  const db = firestore();

  const comments = await db
    .collection("comments")
    .where("taskId", "==", id)
    .get();

  const files = await db.collection("files").where("taskId", "==", id).get();

  const batch = db.batch();

  comments.forEach((doc) => {
    batch.delete(doc.ref);
  });

  files.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.commit();
};
