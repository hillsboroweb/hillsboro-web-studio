document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>a.closest('details').removeAttribute('open')));
