// src/types/questionTypes.ts
export interface TextOption {
    optionId: number;
    text: string;
    type: 'text';
  }
  
  export interface ImageOption {
    optionId: number;
    image: string;
    type: 'image';
  }
  
  export type QuestionOption = TextOption | ImageOption;
  
  export interface Question {
    id: number;
    type: string;
    text: string;
    options: QuestionOption[];
    responseType: string;
  }
  