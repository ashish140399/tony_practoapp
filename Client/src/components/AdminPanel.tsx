import React, { useState } from "react";
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

const AdminPanel: React.FC = () => {
    const [code, setCode] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: any[] }>({});
    const navigate = useNavigate();

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

    // Render the question text or description based on the question type
    const renderQuestionText = (question: any) => {
        switch (question.type) {
            case "drawing-response":
                return <Typography variant="h6">{question.text}</Typography>;
            default:
                return <Typography variant="h5">{question.text}</Typography>;
        }
    };

    // Render the options for single-choice, multiple-choice, and image-choice questions
    const renderOptions = (question: any) => {
        // Assuming Question is a type that includes `id`, `type`, and `options`
        const isSingleChoice = question.type === "single-choice";
        if (
            ["single-choice", "multiple-choice", "image-choice"].includes(
                question.type
            )
        ) {
            return (
                <List>
                    {question.options.map(
                        (
                            option: any // Assuming QuestionOption is properly typed
                        ) => (
                            <ListItem
                                key={option.optionId}
                                secondaryAction={
                                    <Checkbox
                                        edge="start"
                                        onChange={() =>
                                            handleOptionChange(
                                                question.id,
                                                option.optionId,
                                                !answers[question.id]?.includes(
                                                    option.optionId
                                                )
                                            )
                                        }
                                        checked={
                                            answers[question.id]?.includes(
                                                option.optionId
                                            ) || false
                                        }
                                        icon={
                                            isSingleChoice ? (
                                                <RadioButtonUncheckedIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )
                                        }
                                        checkedIcon={
                                            isSingleChoice ? (
                                                <RadioButtonCheckedIcon />
                                            ) : (
                                                <CheckBoxIcon />
                                            )
                                        }
                                    />
                                }
                            >
                                {option.text ? (
                                    <ListItemText primary={option.text} />
                                ) : (
                                    <ListItemAvatar>
                                        <Avatar
                                            src={option.image}
                                            alt="Option"
                                        />
                                    </ListItemAvatar>
                                )}
                            </ListItem>
                        )
                    )}
                </List>
            );
        } else if (question.type === "text-input") {
            return (
                <TextField
                    label={question.text}
                    fullWidth
                    value={answers[question.id] ? answers[question.id][0] : ""}
                    onChange={(event) =>
                        handleTextInputChange(question.id, event.target.value)
                    }
                />
            );
        }
    };

    return (
        <PageContainer>
            <MainHeader>
                <div className="heading">Growwww</div>
            </MainHeader>
            <Layout>
                <LeftLayout>
                    <Sidebar>
                        <Button variant="contained">Show Picture</Button>
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
                                {renderOptions(questions[currentQuestionIndex])}
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
