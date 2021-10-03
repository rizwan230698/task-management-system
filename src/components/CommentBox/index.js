import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../firebase";
import Spinner from "../Spinner";
import "./style.css";

const CommentBox = ({ item }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingComment, setCreatingComment] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const db = firestore();
      const comments = [];
      db.collection("comments")
        .where("taskId", "==", item.id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            comments.push(doc.data());
          });

          setComments(comments);
          setLoading(false);
        });
    })();
  }, []);

  const handleSubmit = async (e) => {
    if (e.key === "Enter" && input.trim() && !creatingComment) {
      setCreatingComment(true);
      try {
        const id = uuidv4();
        const newComment = {
          id,
          text: input,
          taskId: item.id,
        };

        const db = firestore();
        await db.collection("comments").doc(id).set(newComment);

        setComments((prev) => [newComment, ...prev]);
        setCreatingComment(false);
        setInput("");
      } catch (error) {
        setCreatingComment(false);
        console.log(error);
      }
    }
  };

  return (
    <div className="comment-box" style={{ width: "100%", marginTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Leave a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
        />
        {creatingComment && (
          <div style={{ position: "absolute", right: "20px" }}>
            <Spinner className="sm" />
          </div>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : comments.length ? (
        comments.map((comment) => (
          <p
            key={comment.id}
            style={{ padding: "10px 5px", borderBottom: "1px solid #EAEAEA" }}
          >
            {comment.text}
          </p>
        ))
      ) : (
        <div>No comments yet!</div>
      )}
    </div>
  );
};

export default CommentBox;
