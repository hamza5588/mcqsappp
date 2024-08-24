import logging
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import OutputFixingParser
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_openai import ChatOpenAI
from langchain_text_splitters import SpacyTextSplitter

text_splitter = SpacyTextSplitter(chunk_size=1000)

def generate_questions_from_file(
    url: str = None,
    subject: str = "detect own",
    sub_topic: str = "detect by own",
    num_questions: int = 5,
    difficulty_level: str = "Easy",
    language: str = "English",
    question_type: str = "MCQs"
):
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    logger.debug(f"Parameters: subject={subject}, sub_topic={sub_topic}, num_questions={num_questions}, difficulty_level={difficulty_level}, language={language}, question_type={question_type}")

    apikey = "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"
    model = ChatOpenAI(openai_api_key=apikey)

    try:
        logger.debug("Model initialized successfully.")

        prompt_template = PromptTemplate(
            input_variables=["context", "subject", "sub_topic", "num_questions", "difficulty_level", "language", "type"],
            template="""
            Please generate a set of questions based on the following criteria:
            - **Subject**: {subject}
            - **Sub-Topic**: {sub_topic}
            - **Number of Questions**: {num_questions}
            - **Difficulty Level**: {difficulty_level}
            - **Language**: {language}
            - **Type**: {type}
            {context}
            ### Instructions:
            Depending on the type specified, create the questions in the appropriate format:
            - **MCQs**: Provide multiple-choice questions with four options each.
            - **Question-Answer**: Provide a list of questions with detailed answers.
            - **Fill in the Blanks**: Provide sentences with missing words, indicated by underscores.
            - **Matching**: Provide pairs of items to be matched with each other.
            - **Mix**: Create a mixture of the above types, ensuring a variety of question formats.
            ### Output Format:
            For MCQs:
            {{
            "question_1": {{
                "question": "Your question text here?",
                "options": {{
                "A": "Option A text",
                "B": "Option B text",
                "C": "Option C text",
                "D": "Option D text"
                }},
                "correct_answer": "The correct option letter"
            }},
            ...
            }}
            """
        )

        json_parser = JsonOutputParser()
        output_parser = OutputFixingParser.from_llm(parser=json_parser, llm=model)

        mcq_chain = LLMChain(
            prompt=prompt_template,
            llm=model,
            output_parser=output_parser
        )

        logger.debug("LLMChain initialized successfully.")

        # Calculate the token length of the context and discard if it's too long
        texts = text_splitter.split_text(url)
        url=texts[0]
        logger.debug(url)


        # If the text length is acceptable, proceed with generating questions
        result = mcq_chain.run({
            "context": str(url),
            "subject": str(subject),
            "sub_topic": str(sub_topic),
            "num_questions": str(num_questions),
            "difficulty_level": str(difficulty_level),
            "language": str(language),
            "type": str(question_type)
        })

        logger.debug("Questions generated successfully.")
        return result

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return {"error": str(e)}
