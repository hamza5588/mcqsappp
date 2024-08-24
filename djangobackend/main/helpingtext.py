import logging
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import OutputFixingParser
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_openai import ChatOpenAI

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_questions_from_text(
    text: str = None,
    subject: str = "general",
    sub_topic: str = "overview",
    num_questions: int = 5,
    difficulty_level: str = "Easy",
    language: str = "English",
    question_type: str = "MCQs"
):
    logger.debug("Entering generate_questions_from_text function")
    logger.debug(f"Parameters: text={text[:100] if text else 'None'}, subject={subject}, sub_topic={sub_topic}, "
                 f"num_questions={num_questions}, difficulty_level={difficulty_level}, "
                 f"language={language}, question_type={question_type}")

    if not text:
        logger.error("No text provided for generating questions.")
        return {"error": "No text provided for generating questions."}

    # Load the appropriate LLM
    apikey = "sk-proj-IE2rVjhpgnuPsQ1DmOGjT3BlbkFJezvy08eqm0ZaoIyHXjKw"  # Use environment variables in production
    logger.debug(f"API key loaded: {apikey[:4]}...")  # Only log a portion for security

    try:
        model = ChatOpenAI(openai_api_key=apikey)
        logger.debug("ChatOpenAI model initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ChatOpenAI model: {e}")
        raise

    # Define the prompt template
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

        For Question-Answer:
        {{
        "question_1": {{
            "question": "Your question text here?",
            "answer": "Your answer text here"
        }},
        ...
        }}

        For Fill in the Blanks:
        {{
        "question_1": {{
            "sentence": "The quick ___ fox jumps over the lazy dog.",
            "answer": "brown"
        }},
        ...
        }}

        For Matching:
        {{
        "question_1": {{
            "terms": ["Term 1", "Term 2", ...],
            "definitions": ["Definition 1", "Definition 2", ...],
            "correct_pairs": {{
            "Term 1": "Definition 1",
            ...
            }}
        }},
        ...
        }}
        """
    )
    logger.debug("PromptTemplate initialized")

    # Create the output parser
    try:
        json_parser = JsonOutputParser()
        output_parser = OutputFixingParser.from_llm(parser=json_parser, llm=model)
        logger.debug("Output parser initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize output parser: {e}")
        raise

    # Create the LLM Chain
    try:
        mcq_chain = LLMChain(
            prompt=prompt_template,
            llm=model,
            output_parser=output_parser
        )
        logger.debug("LLMChain initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize LLMChain: {e}")
        raise
    
    context = text

    # Run the chain with the specified parameters

    result = mcq_chain.run({
            "context": context,
            "subject": subject,
            "sub_topic": sub_topic,
            "num_questions": num_questions,
            "difficulty_level": difficulty_level,
            "language": language,
            "type": question_type
    })
    logger.debug("my LLMChain executed successfully")
    print(result)
     

    # Log and inspect the final result before returning
    if result == {'message': 'Hello! How can I assist you today?'}:
        logger.error("The model returned a fallback response. Check the input and prompt template.")
        return {"error": "The model returned a fallback response. Check the input and prompt template."}
    else:
        logger.debug(f"Generated questions: {result}")

    return result
