function indexQuestions(questions) {
  return questions.map((question) => {
    const blob = [
      question.question,
      question.categoryName,
      question.difficulty,
      question.tags.join(" "),
      question.answerPoints.join(" ")
    ]
      .join(" ")
      .toLowerCase();
    return { id: question.id, blob };
  });
}

function filterQuestions(questions, searchIndex, filters) {
  const { query, categoryId, difficulty } = filters;
  const normalizedQuery = query.trim().toLowerCase();

  return questions.filter((question) => {
    if (categoryId !== "all" && question.categoryId !== categoryId) {
      return false;
    }
    if (difficulty !== "all" && question.difficulty !== difficulty) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const searchRow = searchIndex.find((entry) => entry.id === question.id);
    return Boolean(searchRow && searchRow.blob.includes(normalizedQuery));
  });
}

export { indexQuestions, filterQuestions };
