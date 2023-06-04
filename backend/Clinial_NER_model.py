from transformers import pipeline
import pickle


model = pickle.load(open("bert-base-uncased_clinical-ner.sav", 'rb'))
tokenizer = pickle.load(
    open("bert-base-uncased_clinical-ner_tokenizer.sav", 'rb'))


pipe = pipeline("ner", model=model, tokenizer=tokenizer,
                aggregation_strategy="simple")


def Report_Generation(text):
    raw = pipe(text)
    problem = []
    treatment = []
    test = []
    for x in raw:
        # problem
        if x["entity_group"] == "problem":
            if x["word"] not in problem:
                problem.append(x["word"])
        # treatment
        if x["entity_group"] == "treatment":
            if x["word"] not in treatment:
                treatment.append(x["word"])
        # test
        if x["entity_group"] == "test":
            if x["word"] not in test:
                test.append(x["word"])

    return problem, treatment, test
