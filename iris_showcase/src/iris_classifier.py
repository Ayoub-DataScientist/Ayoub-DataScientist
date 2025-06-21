"""Simple Iris dataset classifier.

This script loads the Iris dataset from scikit-learn, splits it into training and
validation sets, fits a logistic regression model, and prints the evaluation
metrics.
"""
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


def main() -> None:
    iris = load_iris(as_frame=True)
    X = iris.data
    y = iris.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    acc = accuracy_score(y_test, predictions)
    print(f"Accuracy: {acc:.2f}")
    print(classification_report(y_test, predictions, target_names=iris.target_names))


if __name__ == "__main__":
    main()
