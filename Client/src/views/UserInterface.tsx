import React, { useState, useEffect } from "react";

import io from "socket.io-client";
import { Typography } from "@mui/material";
import { questions } from "../question/ques";
import {
    Layout,
    LeftLayout,
    MainSection,
    PageContainer,
    RightLayout,
    Sidebar,
    MainHeader,
} from "../styles";
import { renderOptions, renderQuestionText } from "./common";
import { useRef } from "react";

// const socket = io("http://localhost:4000");
const socket = io("http://162.254.38.101:4000");
const roomId = "abcde";
const UserInterface: React.FC = () => {
    const [code, setCode] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState<{ [key: number]: any[] }>({});
    // Create a reference to dispose the Fabric.js canvas from outside the component
    const disposeCanvasRef = useRef<() => void | null>(null);
    useEffect(() => {
        // Assign role as 'examinee' when connected with a specific roomId
        socket.emit("assignRole", { role: "examinee", roomId });

        // Listen for questions from the examiner
        socket.on("displayQuestion", ({ answer, questionId }) => {
            setCurrentQuestionIndex(questionId - 1);
            setAnswers({ ...answers, [questionId]: answer });
            console.log("Question received:", answer, questionId);
        });

        return () => {
            socket.off("displayQuestion");
        };
    }, [roomId]);
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
                    // Update the answer for single-choice questions
                    const updatedAnswers = {
                        ...answers,
                        [questionId]: [optionId],
                    };
                    setAnswers(updatedAnswers);
                    emitToExaminer(updatedAnswers[questionId], questionId); // Emit updated answer
                } else {
                    // Update the answer for multiple-choice questions
                    const updatedAnswers = {
                        ...answers,
                        [questionId]: [...currentAnswers, optionId],
                    };
                    setAnswers(updatedAnswers);
                    emitToExaminer(updatedAnswers[questionId], questionId); // Emit updated answer
                }
            } else {
                // Remove the answer if deselected
                const updatedAnswers = {
                    ...answers,
                    [questionId]: currentAnswers.filter(
                        (id) => id !== optionId
                    ),
                };
                setAnswers(updatedAnswers);
                emitToExaminer(updatedAnswers[questionId], questionId); // Emit updated answer
            }
        }
    };

    const handleTextInputChange = (questionId: number, text: string) => {
        // Update the answer for text-input questions
        const updatedAnswers = { ...answers, [questionId]: [text] };
        setAnswers(updatedAnswers);
        emitToExaminer(updatedAnswers[questionId], questionId); // Emit updated answer
    };
    // Function to save canvas content in answers state
    const handleCanvasChange = (questionId: number, canvasJSON: string) => {
        // Update the answer for text-input questions
        const updatedAnswers = { ...answers, [questionId]: [canvasJSON] };
        setAnswers(updatedAnswers);
        emitToExaminer(updatedAnswers[questionId], questionId); // Emit updated answer
    };
    // Function to emit the updated answer to the examiner
    const emitToExaminer = (answer: any, questionId: number) => {
        console.log("before canvas emission", answer);
        socket.emit("optionSelected", { answer, questionId, roomId });
    };
    return (
        <PageContainer>
            <MainHeader>
                <div className="heading">AssessMe</div>
                <div className="type">Examinee</div>
            </MainHeader>
            <Layout>
                <LeftLayout>
                    <Sidebar>
                        {currentQuestionIndex === -1
                            ? "Sit back & Relax !!"
                            : "Examine the question carefully"}
                    </Sidebar>
                </LeftLayout>
                <RightLayout>
                    <MainSection>
                        {currentQuestionIndex === -1 ? (
                            <>
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    gutterBottom
                                >
                                    Wait for the examiner to send the question
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    gutterBottom
                                >
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
                            </>
                        )}
                    </MainSection>
                </RightLayout>
            </Layout>
        </PageContainer>
    );
};

export default UserInterface;
