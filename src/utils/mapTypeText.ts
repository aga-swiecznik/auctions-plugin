import { TextType } from "~/models/Text"

export const mapTypeText = (text: string | null): TextType => {
    if (text === 'winning') return 'winning';
    if (text === 'no-offers') return 'no-offers';
    return 'other';
}