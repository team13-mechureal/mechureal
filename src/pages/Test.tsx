import React, { JSX, useState } from "react";
import food from '../data/food.json';
import questions from '../data/questions.json';
import { getBestQuestion } from '../logic/inference';


type Question = {
    key: keyof Omit<Food, 'name'>;
    question: string;
};
type Food = {
    food: string;
    isFastFood: boolean,
    isChicken: boolean,
    isSpicy: boolean
};
const Test = (): JSX.Element => {
    const [candidates, setCandidates] = useState<Food[]>(food as Food[]);
    const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

    const remainingQuestions = (questions as Question[]).filter(q => !usedQuestions.includes(q.key));
    const currentQuestion = getBestQuestion(candidates, remainingQuestions) as Question;

    const handleAnswer = (answer: boolean) => {
        const filtered = candidates.filter(p => p[currentQuestion.key] === answer);
        setCandidates(filtered);
        setUsedQuestions(prev => [...prev, currentQuestion.key]);
    };

    if (candidates.length === 1) {
        return (
            <div className="w-screen h-screen bg-ivory flex flex-col items-center justify-center tj-l-16">
                <p className="tj-eb-36 text-darkBrown">추천하는 음식은 바로... {candidates[0].food}!!</p>
            </div>
        )
    }

    if (candidates.length === 0 || remainingQuestions.length === 0) {
        return (
            <div className="w-screen h-screen bg-ivory flex flex-col items-center justify-center tj-l-16">
                <p className="tj-eb-36 text-darkBrown">죄송해요. 좀 더 발전할게요 😢</p>
            </div>
        )
    }

    return <QuestionCard question={currentQuestion.question} onAnswer={handleAnswer} />;
}

export default Test;


function QuestionCard({ question, onAnswer }: any) {
    return (
        <div className="w-screen h-screen bg-ivory flex flex-col items-center justify-center tj-l-16">
            <p className="tj-eb-32 text-darkBrown">{question}</p>
            <div className="w-max h-auto flex flex-row mt-3">
                <button className="tj-b-24 p-4 bg-orangeBrown" onClick={() => onAnswer(true)} style={{ marginRight: 10 }}>좋아요!</button>
                <button className="tj-b-24 p-4 bg-orangeBrown" onClick={() => onAnswer(false)}>싫어요ㅠ</button>
            </div>
        </div>
    );
}