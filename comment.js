document.querySelectorAll('.feed-item').forEach(item => {
  const commentInput = item.querySelector('.comment-input');
  const submitBtn = item.querySelector('.submit-comment');
  const commentList = item.querySelector('.comment-list');

  submitBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if(text !== '') {
      const li = document.createElement('li');
      li.textContent = text;
      commentList.appendChild(li);
      commentInput.value = '';
    }
  });
});
