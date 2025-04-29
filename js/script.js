function toggleSection(id) {
    const content = document.getElementById(id + '-content');
    const arrow = document.getElementById(id + '-arrow');
    const show = !content.classList.contains('show');
  
    ['content', 'tech', 'process', 'benefits'].forEach(key => {
      if (key !== id) {
        const otherContent = document.getElementById(key + '-content');
        const otherArrow = document.getElementById(key + '-arrow');
        if (otherContent && otherArrow) {
          otherContent.classList.remove('show');
          otherArrow.className = 'fas fa-chevron-down arrow';
        }
      }
    });
  
    content.classList.toggle('show');
    arrow.className = show ? 'fas fa-chevron-up arrow' : 'fas fa-chevron-down arrow';
  }
  