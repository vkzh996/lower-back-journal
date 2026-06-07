(() => {
  const replacements = [
    ["Боль в пояснице", "Боль в мышцах"],
    ["Средняя боль", "Средняя боль в мышцах"],
    [", боль: ", ", боль в мышцах: "],
  ];

  function updateLabels(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      let value = node.nodeValue;
      replacements.forEach(([from, to]) => {
        value = value.replace(from, to);
      });
      value = value.replace(/^Боль (\d+\/10)$/, "Боль в мышцах $1");
      node.nodeValue = value;
    }
  }

  updateLabels();
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) updateLabels(node.parentNode);
        if (node.nodeType === Node.ELEMENT_NODE) updateLabels(node);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
