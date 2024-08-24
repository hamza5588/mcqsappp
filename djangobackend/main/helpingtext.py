from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import  OutputFixingParser
from langchain.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader, TextLoader
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_openai import ChatOpenAI


def generate_questions_from_text(
    text: str = None,
    subject: str = "general",
    sub_topic: str = "overview",
    num_questions: int = 5,
    difficulty_level: str = "Easy",
    language: str = "English",
    question_type: str = "MCQs"
):
    print("this is",text)
    """
    Generates questions based on the content of the uploaded file and specified parameters.

    Parameters:
    - file_path (str): The path to the uploaded file.
    - subject (str): The subject for the questions.
    - sub_topic (str): The sub-topic for the questions.
    - num_questions (int): The number of questions to generate.
    - difficulty_level (str): The difficulty level of the questions (Easy, Medium, Hard).
    - language (str): The language of the questions.
    - question_type (str): The type of questions (MCQs, Question-Answer, Fill in the Blanks, Matching, Mix).

    Returns:
    - result (dict): The generated questions in JSON format.
    """
    
    # Load the appropriate LLM
    apikey = "sk-proj-IE2rVjhpgnuPsQ1DmOGjT3BlbkFJezvy08eqm0ZaoIyHXjKw"

    print(apikey)


    model = ChatOpenAI(openai_api_key=apikey)
    print("model")
    print("model 2")
    
    # Determine file type and load content
    # if file_path.endswith('.pdf'):
    #     print("inside pdf")
    #     loader = PyPDFLoader(file_path)
    # elif file_path.endswith('.docx') or file_path.endswith('.doc'):
    #     print("inside docs")
    #     loader = UnstructuredWordDocumentLoader(file_path)
      
    # elif file_path.endswith('.txt'):
        
    #     print("inside text")

    #     loader = TextLoader(file_path)

    # print("model 2")


    # # Load document and extract text
    # if file_path:
    #     print("inside if")
    #     document = loader.load()
    #     text_splitter = CharacterTextSplitter()
    #     split_documents = text_splitter.split_documents(document)
    #     context = ' '.join([doc.page_content for doc in split_documents])
    # else:
    context=text
    
    print(context)

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
        - **Mix**: Create a mixture of the above types, ensuring a variety of question formats.

        ### Output Format:

        For MCQs:
        ```
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
        ```

        For Question-Answer:
        ```
        {{
        "question_1": {{
            "question": "Your question text here?",
            "answer": "Your answer text here"
        }},
        ...
        }}
        ```

        For Fill in the Blanks:
        ```
        {{
        "question_1": {{
            "sentence": "The quick ___ fox jumps over the lazy dog.",
            "answer": "brown"
        }},
        ...
        }}
        ```

        For Matching:
        ```
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

        For Mix:
        ```
        // A combination of the formats above
        ```

        Please generate the questions accordingly and output them in JSON format.
        """
    )

    # Create the output parser
    json_parser = JsonOutputParser()
    output_parser = OutputFixingParser.from_llm(parser=json_parser, llm=model)

    # Create the LLM Chain
    mcq_chain = LLMChain(
        prompt=prompt_template,
        llm=model,
        output_parser=output_parser
    )

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


    return result
