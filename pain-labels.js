(() => {
  function updateLabels(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      let value = node.nodeValue;
      value = value.replace("Боль в пояснице", "Боль в мышцах");
      value = value.replace("Средняя боль в пояснице", "Средняя боль в мышцах");
      value = value.replace(", боль: ", ", боль в мышцах: ");
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
