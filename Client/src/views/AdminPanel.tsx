import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Button,
    TextField,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
import { questions } from "../question/ques";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styled from "styled-components";
import {
    Layout,
    LeftLayout,
    MainSection,
    PageContainer,
    RightLayout,
    ActionButtons,
    Sidebar,
    MainHeader,
} from "../styles";
import io from "socket.io-client";
import { renderOptions, renderQuestionText } from "./common";
import { GB_TEXT_INPUT } from "../const";
import { useRef } from "react";
// const socket = io("http://localhost:4000");
const socket = io("http://162.254.38.101:4000");
const roomId = "abcde";
const AdminPanel: React.FC = () => {
    // Create a reference to dispose the Fabric.js canvas from outside the component
    const disposeCanvasRef = useRef<() => void | null>(null);
    const [code, setCode] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: any[] }>({});
    const [answersScore, setAnswersScore] = useState<{ [key: number]: number }>(
        {}
    );
    const navigate = useNavigate();
    useEffect(() => {
        // Assign role as 'examiner' when connected
        socket.emit("assignRole", { role: "examiner", roomId });

        // Listen for examinee's selected option
        socket.on("updateExaminer", (data) => {
            setAnswers({ ...answers, [data.questionId]: data.answer });
            console.log("Examinee selected:", data);
        });

        return () => {
            socket.off("updateExaminer");
        };
    }, []);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    const handleOptionChange = (
        questionId: number,
        optionId: number,
        selected: boolean
    ) => {
        const currentAnswers = answers[questionId] || [];
        const question = questions.find((q) => q.id === questionId);
        if (question) {
            const isSingleChoice = question.type === "single-choice";
            if (selected) {
                if (isSingleChoice) {
                    setAnswers({ ...answers, [questionId]: [optionId] });
                } else {
                    setAnswers({
                        ...answers,
                        [questionId]: [...currentAnswers, optionId],
                    });
                }
            } else {
                setAnswers({
                    ...answers,
                    [questionId]: currentAnswers.filter(
                        (id) => id !== optionId
                    ),
                });
            }
        }
    };

    const handleTextInputChange = (questionId: number, text: string) => {
        setAnswers({ ...answers, [questionId]: [text] });
    };
    // Function to save canvas content in answers state
    const handleCanvasChange = (questionId: number, canvasJSON: string) => {
        setAnswers({ ...answers, [questionId]: [canvasJSON] });
    };
    const emitToExaminee = () => {
        let currentquestionid = questions[currentQuestionIndex].id;
        socket.emit("showQuestion", {
            answer: answers[currentquestionid],
            questionId: currentquestionid,
            roomId,
        });
    };
    const resetAnswerForCurrentKey = () => {
        let valuetoreset: any;
        if (questions[currentQuestionIndex].type === GB_TEXT_INPUT) {
            valuetoreset = [""];
        } else {
            valuetoreset = [];
        }
        setAnswers((prevAnswers) => ({
            ...prevAnswers, // Keep all other answers unchanged
            [questions[currentQuestionIndex].id]: valuetoreset, // Reset the answer for the specific questionId
        }));
    };
    // For score calculation
    const calculateCurrentScore = () => {
        const totalScore = Object.values(answersScore).reduce(
            (sum, score) => sum + score,
            0
        );
        return totalScore;
    };
    const calculateTotalScore = () => {
        const totalScore = questions.length * 10;
        return totalScore;
    };
    const addScore = () => {
        let currentquestionid = questions[currentQuestionIndex].id;
        setAnswersScore({ ...answersScore, [currentquestionid]: 10 });
    };
    const subtractScore = () => {
        let currentquestionid = questions[currentQuestionIndex].id;
        setAnswersScore({ ...answersScore, [currentquestionid]: 0 });
    };
    return (
        <PageContainer>
            <MainHeader>
                <div className="heading">AssessMe</div>
                <div className="type">Examiner</div>
            </MainHeader>
            <Layout>
                <LeftLayout>
                    <Sidebar>
                        <Button variant="contained" onClick={emitToExaminee}>
                            Show Picture
                        </Button>
                        <Button
                            variant="contained"
                            onClick={resetAnswerForCurrentKey}
                            style={{ marginTop: "30px" }}
                        >
                            Clear Input
                        </Button>
                        <ScoreBox>
                            <h3>
                                Score {calculateCurrentScore()} /{" "}
                                {calculateTotalScore()}
                            </h3>
                            <div className="flex">
                                <Button variant="contained" onClick={addScore}>
                                    Pass
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={subtractScore}
                                >
                                    Fail
                                </Button>
                            </div>
                        </ScoreBox>
                    </Sidebar>
                </LeftLayout>
                <RightLayout>
                    <MainSection>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Question. {currentQuestionIndex + 1}
                        </Typography>
                        {currentQuestionIndex < questions.length && (
                            <>
                                {renderQuestionText(
                                    questions[currentQuestionIndex]
                                )}
                                {renderOptions(
                                    questions[currentQuestionIndex],
                                    answers,
                                    handleOptionChange,
                                    handleTextInputChange,
                                    handleCanvasChange,
                                    disposeCanvasRef
                                )}
                            </>
                        )}
                        <ActionButtons>
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                variant="contained"
                                color="secondary"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={
                                    currentQuestionIndex ===
                                    questions.length - 1
                                }
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: "10px" }}
                            >
                                Next
                            </Button>
                        </ActionButtons>
                    </MainSection>
                </RightLayout>
            </Layout>
        </PageContainer>
    );
};

export default AdminPanel;

const ScoreBox = styled.div`
    margin-top: 30px;
    h3 {
        margin: 0;
        margin-bottom: 10px;
    }
    .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: -10px;
        margin-right: -10px;
        button {
            margin: 0 10px;
        }
    }
`;
