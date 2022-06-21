import { get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useQuestions(videoID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      // database related works
      const db = getDatabase();
      const quizRef = ref(db, "quiz/" + videoID + "/questions");
      const quizQueary = query(quizRef, orderByKey());
      // console.log("quiz ref  " + quizRef)



      try {
        setError(false);
        setLoading(false);
        // request Firebase database
        const snapshot = await get(quizQueary);

        // console.log( snapshot.val())
        if (snapshot.exists()) {
          setQuestions((prevQuestions) => {
            return [...prevQuestions, ...Object.values(snapshot.val())];
          });
        }


      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }


    fetchQuestions();
  }, [videoID]);


// console.log(question)
  return {
    loading,
    error,
    questions,
  };
}
