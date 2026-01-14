import { LearnerProfile, LearnerProfileRow } from "@/lib/learner-profiles"
import { Answer, Json, Question, QuizRow, QuizUpdate } from "@/types";

interface CreationMeta {
  learner_profile?: LearnerProfileRow;
  [key: string]: unknown;
}

export class Quiz {
  constructor(private data: QuizRow) {}

  asUpdate(): QuizUpdate {
    return {
      title: this.data.title,
      description: this.data.description,
      questions: this.data.questions
    }
  }

  // NOTE: if this ever accepts any camelCase `name`, this will need to
  // be adjusted to handle the transformation
  with(name: "title" | "description", value: string): Quiz {
    return new Quiz({ ...this.data, [name]: value });
  }

  // NOTE: if Question gains any camelCase properties, this will need to
  // be adjusted to handle the transformation
  withQuestion(
    index: number, question: Partial<Question>
  ): Quiz {
    const questions = this.questions.map((existing, i) =>
      i === index ? { ...existing, ...question } : { ...existing }
    );
    return new Quiz({ ...this.data, questions: questions as unknown as Json });
  }

  withAnswer(
    questionIndex: number,
    answerIndex: number,
    answer: Partial<Answer>
  ): Quiz {
    const question = this.questions[questionIndex];
    
    const updatedQuestion = {
      ...question,
      answers: question.answers.map((existing, i) => i === answerIndex ? {...existing, ...answer} : existing)
    }

    return this.withQuestion(questionIndex, updatedQuestion)
  }

  withCorrectAnswer(
    questionIndex: number,
    newCorrectIndex: number
  ): Quiz {
    const question = this.questions[questionIndex];

    const updatedQuestion = {
      ...question,
      answers: question.answers.map((existing, i) => 
        i === newCorrectIndex 
        ? {...existing, correct: true} 
        : {...existing, correct: false}
      )
    }

    return this.withQuestion(questionIndex, updatedQuestion)
  }

  get id() {
    return this.data.id;
  }

  get creationMeta(): CreationMeta {
    return (this.data.creation_meta ?? {}) as CreationMeta;
  }

  get learnerProfile(): LearnerProfile | null {
    const profileData = this.creationMeta.learner_profile;
    if (!profileData) return null;

    return new LearnerProfile(profileData);
  }

  get title() {
    return this.data.title;
  }

  get description() {
    return this.data.description;
  }

  get questionCount() {
    return this.questions.length;
  }

  get questions(): Question[] {
    return (this.data.questions ?? []) as unknown as Question[];
  }
}
