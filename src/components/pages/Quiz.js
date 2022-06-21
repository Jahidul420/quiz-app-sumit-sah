import { getDatabase, ref, set } from "firebase/database";

import _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useQuestions from "../../hooks/useQuestions";
import Answers from "../Answers";
import MiniPlayer from "../MiniPlayer";
import ProgressBar from "../ProgressBar";
const initialState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "questions":
      action.value.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return action.value;

    case "answer":
      const questions = _.cloneDeep(state);
      questions[action.questionID].options[action.optionIndes].checked =
        action.value;

      return questions;
    default:
      return state;
  }
};

export default function Quiz() {
  const { id } = useParams();
  const { loading, error, questions } = useQuestions(id);
  const [currentQustion, setCurrentQustion] = useState(0);
  const [qna, dispatch] = useReducer(reducer, initialState);
  const {currentUser} = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch({
      type: "questions",
      value: questions,
    });
  }, [questions]);

  function handleAnswerChange(e, index) {
    dispatch({
      type: "answer",
      questionID: currentQustion,
      optionIndes: index,
      value: e.target.checked,
    });
  }
  // handle when user click the nex button to get the next uestion

  function nextQuestion() {
    if (currentQustion + 1 < questions.length) {
      setCurrentQustion((prevCurrent) => prevCurrent + 1);
    }
  }

  // handle when user clicks the prev button to get back to the previous question
  function prevQuestion() {
    if (currentQustion >= 1 && currentQustion <= questions.length) {
      setCurrentQustion((prevCurrent) => prevCurrent - 1);
    }
  }


//submit quiz
async function submit(){
  const {uid}= currentUser;

  const db = getDatabase();
  const resultRef = ref(db, `result/${uid}`);

  await set(resultRef, {
    [id]: qna
  });

  navigate({
    pathname: `/result/${id}`,
    state: {
      qna,
    }
  })
} 

  // calculate precentage of progress
  const precentage =
    questions.length > 0 ? ((currentQustion + 1) / questions.length) * 100 : 0;


  
  

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Ther was an error!</div>}
      {!loading && !error && qna && qna.length > 0 && (
        <>
          <h1>{qna[currentQustion].title}</h1>

          <h4>Question can have multiple answers</h4>
          <Answers
            input
            options={qna[currentQustion].options}
            handleChange={handleAnswerChange}
          />
          <ProgressBar
            next={nextQuestion}
            prev={prevQuestion}
            progress={precentage}
            submit={submit}
          />
          <MiniPlayer />
        </>
      )}
    </>
  );
}
