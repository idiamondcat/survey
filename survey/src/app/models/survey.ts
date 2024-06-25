export interface Survey {
    sections: Section[];
}

export interface Section {
    title: string;
    questions: Question[];
}

export interface Question {
    text: string;
    questionType: string;
    questionName?: string | null;
    fields: Field[];
}
export interface Field {
    type: string;
    name: string;
    class: string;
    variant?: string | number;
    placeholder?: string;
}
export interface SurveyCurrentState {
    isLoading: boolean;
    currentSection: Section | null;
    currentQuestion: Question | null;
    answeredQuestions: {[key: string]: any};
    survey: Survey | null;
}

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

type DiscountType = 'percent' | 'sum';

interface Result {
    name: string;
    positive: boolean;
}

interface Supplement {
    name: string;
    description: string;
    count: string;
    img: string;
    ingredients: Ingredient[];
}

interface Ingredient {
    name: string;
    count: string;
}