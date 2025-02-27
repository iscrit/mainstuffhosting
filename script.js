document.addEventListener('DOMContentLoaded', function() {
    // Handle accordion functionality
    document.querySelectorAll('.accordion').forEach(acc => {
        acc.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            this.classList.toggle('active');
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    // Set current page as active in the navigation bar
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    window.onload = function() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    };

    // Smooth scrolling for review section
    const reviewCarousel = document.querySelector('.review-carousel');
    if (reviewCarousel) {
        setInterval(() => {
            reviewCarousel.appendChild(reviewCarousel.firstElementChild);
        }, 3000); // Adjust timing as needed
    }
});



document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName('close')[0];

    // Show the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});