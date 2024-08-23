from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import OutputFixingParser
from langchain.llms import OpenAI
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_openai import ChatOpenAI

# apikey = "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"
apikey="sk-proj-IE2rVjhpgnuPsQ1DmOGjT3BlbkFJezvy08eqm0ZaoIyHXjKw"

def generate_questions_from_subject(
    subject: str = "general",
    sub_topic: str = "overview",
    num_questions: int = 5,
    difficulty_level: str = "Easy",
    language: str = "English",
    question_type: str = "MCQs"
):
    print("hello")
    

    # Load the appropriate LLM
    model = ChatOpenAI(openai_api_key=apikey)
    print("Loaded model")

    context = "generate the quiz on user topic"
    print("Context set:", context)

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
    - **Matching**: Provide pairs of items to be matched with each other, similar to this example:
    - **Terms**: ["Verbs", "Pronouns", "Adjectives", "Nouns"]
    - **Definitions**: [
        "Words that express actions or states of being",
        "Words that replace nouns",
        "Words that describe or modify nouns",
        "Words that show relationships between nouns and other words"
        ]
    - **True/False**: Provide statements where the answer is either "True" or "False."
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
        "answer": "The correct option letter"
    }},
    ...
    }}
    ```

    For Question-Answer:
    {{
    "question_1": {{
        "question": "Your question text here?",
        "answer": "Your answer text here"
    }},
    ...
    }}
    ```

    For Fill in the Blanks:
    {{
    "question_1": {{
        "sentence": "The quick ___ fox jumps over the lazy dog.",
        "answer": "brown"
    }},
    ...
    }}
    ```

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
    
    ```

    For True/False:
    {{
    "question_1": {{
        "statement": "Your statement text here.",
        "answer": "True/False"
    }},
    ...
    }}
    ```

    For Mix:
    {{
    // A combination of the formats above
    }}
    """
)

    print("Prompt template defined")

    # Create the output parser
    json_parser = JsonOutputParser()
    output_parser = OutputFixingParser.from_llm(parser=json_parser, llm=model)
    print("Output parser created")

    # Create the LLM Chain
    mcq_chain = LLMChain(
        prompt=prompt_template,
        llm=model,
        output_parser=output_parser
    )
    print("LLM Chain created")

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

    print("Result generated:", result)

    return result
