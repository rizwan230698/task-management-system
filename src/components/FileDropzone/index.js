import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "../../aws";
import { firestore } from "../../firebase";
import Spinner from "../Spinner";

const FileDropzone = ({ item }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      const db = firestore();
      const files = [];
      db.collection("files")
        .where("taskId", "==", item.id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            files.push(doc.data());
          });

          setFiles(files);
        });
    })();
  }, [item.id]);

  const attachFile = async (data) => {
    const id = uuidv4();
    const newFile = {
      id,
      url: data.Location,
      name: data.key,
      taskId: item.id,
    };

    const db = firestore();
    await db.collection("files").doc(id).set(newFile);

    setFiles((prev) => [...prev, newFile]);
    setUploading(false);
  };

  const uploadFile = (file) => {
    setUploading(true);

    const params = {
      Body: file,
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: file.name,
      ACL: "public-read",
      ContentType: file.type,
    };

    return S3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        return false;
      }
      attachFile(data);
      return true;
    });
  };

  return (
    <div style={{ marginTop: 30, width: "100%", position: "relative" }}>
      <div style={{ display: "flex" }}>
        <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
        {uploading && (
          <div>
            <Spinner className="sm" />
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        {files.map((file) => (
          <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              textDecoration: "none",
              margin: 5,
            }}
          >
            <p
              style={{
                color: "rgb(85, 85, 85)",
                padding: "4px 12px",
                borderRadius: 3,
                backgroundColor: "rgb(247, 247, 247)",
              }}
            >
              {file.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
