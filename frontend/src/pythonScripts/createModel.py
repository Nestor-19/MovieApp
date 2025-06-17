import pandas as pd
import numpy as np
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import multiprocessing
import torch


def train_and_evaluate_model(
    csv_file_path: str,
    model_path: str = "distilbert-base-uncased",  # Using Distilbert
    label_column_map: dict = None,  # Map your dataset's column names to expected ones (e.g., {"sentiment": "label"})
    sample_size: int = None,  # Number of rows to sample (None = all)
    max_length: int = 128,  # Max token length for tokenizer
    test_size: float = 0.2,  # Proportion of data to use for testing (20%)
    num_train_epochs: int = 3,  # Number of training epochs
    learning_rate: float = 5e-5,  # Learning rate for optimizer
    weight_decay: float = 0.01,  # Regularization
    batch_size: int = 8,  # Batch size for training and evaluation
    output_dir: str = "./results"  # <- [TODO] enter where we save logs 4Where to save model and logs
):
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSequenceClassification.from_pretrained(model_path, num_labels=2)  # Set num_labels as needed

    # Load and preprocess dataset
    df = pd.read_csv(csv_file_path)
    if label_column_map:
        df = df.rename(columns=label_column_map)

    # Optionally sample the dataset
    if sample_size:
        df = df.sample(n=sample_size, random_state=42)

    # Convert to HuggingFace Dataset
    dataset = Dataset.from_pandas(df)

    # Tokenization function
    def tokenize_function(examples):
        return tokenizer(
            examples["text"],
            padding="max_length",
            truncation=True,
            max_length=max_length,
        )

    # Use multiprocessing to speed up tokenization
    num_proc = min(multiprocessing.cpu_count(), 4)
    dataset = dataset.map(tokenize_function, batched=True, num_proc=num_proc)

    # Format dataset for PyTorch
    dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "label"])

    # Train/test split
    split = dataset.train_test_split(test_size=test_size)
    train_dataset = split["train"]
    test_dataset = split["test"]

    # Compute evaluation metrics
    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=1)
        acc = accuracy_score(labels, preds)
        precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted")
        return {"accuracy": acc, "precision": precision, "recall": recall, "f1": f1}

    # Set up training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="epoch",  # Evaluate at the end of each epoch
        save_strategy="epoch",  # Save model at the end of each epoch
        learning_rate=learning_rate,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        num_train_epochs=num_train_epochs,
        weight_decay=weight_decay,
        load_best_model_at_end=True,
        logging_dir=f"{output_dir}/logs",
        logging_steps=10,
        report_to="none"  # Disable logging to external tools like WandB
    )

    # Initialize the Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        compute_metrics=compute_metrics,
        tokenizer=tokenizer
    )

    # Start training
    trainer.train()

    # Evaluate on test set
    results = trainer.evaluate()
    print("Evaluation Results:", results)

    # Save trained model and tokenizer
    model.save_pretrained(f"{output_dir}/model")
    tokenizer.save_pretrained(f"{output_dir}/model")

    return results


# Check if it accounts for acc

