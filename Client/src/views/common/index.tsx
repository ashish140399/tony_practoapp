import {
    Avatar,
    Checkbox,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useRef } from "react";
import { fabric } from "fabric"; // Import Fabric.js

// Render the question text or description based on the question type
export const renderQuestionText = (question: any) => {
    switch (question.type) {
        case "drawing-response":
            return <Typography variant="h6">{question.text}</Typography>;
        default:
            return <Typography variant="h5">{question.text}</Typography>;
    }
};

// Render the options for single-choice, multiple-choice, and image-choice questions
export const renderOptions = (
    question: any,
    answers: any,
    handleOptionChange: (
        questionId: number,
        optionId: number,
        selected: boolean
    ) => void,
    handleTextInputChange: (questionId: number, text: string) => void,
    handleCanvasChange: (questionId: number, canvasJSON: string) => void,
    disposeCanvasRef?: any
) => {
    // Call the disposal function before rendering new options (if applicable)
    if (disposeCanvasRef.current) {
        disposeCanvasRef.current(); // Dispose of previous canvas if it exists
    }
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
                                    <Avatar src={option.image} alt="Option" />
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
                minRows={5}
                multiline
                style={{ marginTop: "20px" }}
                fullWidth
                value={answers[question.id] ? answers[question.id][0] : ""}
                onChange={(event) =>
                    handleTextInputChange(question.id, event.target.value)
                }
            />
        );
    }
    // Case for drawing-response (Fabric.js Canvas)
    else if (question.type === "drawing-response") {
        return (
            <FabricCanvas
                questionId={question.id}
                disposeCanvasRef={disposeCanvasRef}
                handleCanvasChange={handleCanvasChange}
                value={answers[question.id]}
            />
        );
    }
};

const FabricCanvas = ({
    questionId,
    disposeCanvasRef,
    handleCanvasChange,
    value,
}: {
    questionId: number;
    disposeCanvasRef: any;
    handleCanvasChange: (questionId: number, canvasJSON: string) => void;
    value?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    console.log("value", value);
    useEffect(() => {
        // Clean up any previous Fabric.js canvas instance before re-initializing
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.clear();
            fabricCanvasRef.current.dispose();
            fabricCanvasRef.current = null;
        }

        // Initialize the Fabric.js canvas
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current);
            fabricCanvasRef.current = canvas;

            // Set up canvas dimensions and properties
            canvas.setWidth(800);
            canvas.setHeight(400);
            canvas.setBackgroundColor("#f3f3f3", canvas.renderAll.bind(canvas));
            // Ensure value is a single JSON string (not an array)
            const canvasValue = Array.isArray(value) ? value[0] : value;
            // If a JSON value is provided, load the canvas from the JSON
            if (canvasValue) {
                canvas.loadFromJSON(canvasValue, () => {
                    canvas.renderAll(); // Ensure the canvas is rendered after loading JSON
                    console.log("Canvas loaded from JSON.");
                });
            } else {
                // Optionally add default content (e.g., a red rectangle)
                const rect = new fabric.Rect({
                    left: 100,
                    top: 100,
                    fill: "red",
                    width: 100,
                    height: 100,
                });
                canvas.add(rect);
            }

            // Function to save the canvas state
            const saveCanvasState = () => {
                if (fabricCanvasRef.current) {
                    const canvasJSON = fabricCanvasRef.current.toJSON(); // Convert to JSON
                    console.log("canvasJSON", canvasJSON);
                    handleCanvasChange(questionId, JSON.stringify(canvasJSON)); // Store JSON in answers
                }
            };

            // Add event listeners for changes and save the state automatically
            const events = [
                "object:added",
                "object:modified",
                "object:removed",
            ];
            events.forEach((event) => {
                canvas.on(event, saveCanvasState); // Save canvas state on modification
            });
            // disposeCanvasRef.current = () => {
            //     if (fabricCanvasRef.current) {
            //         fabricCanvasRef.current.clear();
            //         fabricCanvasRef.current.dispose();
            //         fabricCanvasRef.current = null;
            //     }
            // };
            // Clean up when the component is unmounted or questionId changes
            return () => {
                events.forEach((event) => {
                    canvas.off(event, saveCanvasState); // Remove event listeners
                });
                // disposeCanvasRef.current(); // Dispose the canvas properly
            };
        }
    }, [value, questionId]); // Depend on `value` and `questionId` to re-initialize canvas if these change

    return (
        <canvas
            id={`canvas_${questionId}`}
            ref={canvasRef}
            style={{ border: "1px solid #000" }}
        />
    );
};
