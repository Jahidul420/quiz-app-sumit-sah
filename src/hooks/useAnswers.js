import { get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useAnswers(videoID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    async function fetchAnswers() {
      // database related works
      const db = getDatabase();
      const answerRef = ref(db, "answers/" + videoID + "/questions");
      const answerQuery = query(answerRef, orderByKey());
      // console.log("quiz ref  " + answerRef)



      try {
        setError(false);
        setLoading(true);


        // request Firebase database
        const snapshot = await get(answerQuery);
        setLoading(false)
        if (snapshot.exists()) {
          setAnswers((prevAnswers) => {
            return [...prevAnswers, ...Object.values(snapshot.val())];
          });
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }


    fetchAnswers();
  }, [videoID]);


console.log(answers)
  return {
    loading,
    error,
    answers,
  };
}
