import _ from "lodash";
import { useLocation, useParams } from "react-router-dom";
import useAnswers from "../../hooks/useAnswers";
import Analysis from "../Analysis";
import Summary from "../Summary";
export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const { qna } = location;
  const { loading, error, answers } = useAnswers(id);

  // const {location} = useHistorey();
  // const {state} = location;
  // const {qna} = state;


  console.log(qna)
  function calculate() {
    let score = 0;

    answers.forEach((question, index1) => {
      let correctIndexes = [],
        checkedIndexs = [];

      question.options.forEach((option, index2) => {
        if (option.correct) correctIndexes.push(index2);
        if (qna[index1].options[index2].checked) {
          checkedIndexs.push(index2);
          option.checked = true;
        }
      });

      if (_.isEqual(correctIndexes, checkedIndexs)) {
        score = score + 5;
      }
    });
    return score;
  }

  const userScore = calculate();
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Ther was an error!</div>}

      {answers && answers.length > 0 && (
        <>
          <Summary score={userScore} noq={answers.length} />
          <Analysis answers={answers} />
        </>
      )}
    </>
  );
}
