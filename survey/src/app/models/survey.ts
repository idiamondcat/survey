export interface Survey {
    sections: Section[];
}

export interface Section {
    title: string;
    questions: Question[];
}

export interface Question {
    id: string;
    question: string;
    type: string;
    sectionName: string;
    answers: Field[];
    lastCard?: LastCardType;
}
export interface Field {
    answerId: string;
    weight: Record<string, number> | 0;
    type: string;
    nextCardNumber?: string;
    text?: string;
    placeholder?: string;
}
export interface SurveyCurrentState {
    isLoading: boolean;
    currentSection: Section | null;
    currentQuestion: Question | null;
    answeredQuestions: Record<string, any>;
    survey: Survey | null;
}

type LastCardType = true | null;

export interface ResponseData {
    user: User,
    price: Price,
    results: Result[];
    supplements: Supplement[]
}

interface User {
    name: string;
    email: string;
    phone: string;
}

interface Price {
    total: number;
    discount: boolean;
    discounted_price?: number;
    discountCodes?: DiscountCode[];
}

interface DiscountCode {
    name: string;
    type: DiscountType;
    discount_value: number;
}

interface Result {
    name: string;
    positive: boolean;
}

export interface Supplement {
    id: number;
    name: string;
    description: string;
    count: string;
    img: string;
    price: string;
    ingredients: Ingredient[];
}

interface Ingredient {
    name: string;
    count: string;
    daily: string;
    percent: string;
}

type DiscountType = 'percent' | 'sum';