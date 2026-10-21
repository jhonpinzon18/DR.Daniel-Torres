document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsListContainer');

    // Función de seguridad para prevenir ataques XSS (Cross-Site Scripting)
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Permitir que las tarjetas 3D giren al tocarlas en celulares
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    // Cargar reseñas guardadas en LocalStorage de forma segura
    let savedReviews = [];
    try {
        savedReviews = JSON.parse(localStorage.getItem('doctor_torres_db_reviews')) || [];
    } catch (e) {
        savedReviews = [];
    }
    
    function renderReviews() {
        let html = `
            <div class="review-card">
                <div class="review-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <div class="review-text">"Excelente atención del Dr. Daniel Torres en Villavicencio. Muy profesional, detallista en el diagnóstico de vértigo y con un trato excepcional."</div>
                <div class="reviewer-info">
                    <span>Andrés Felipe P.</span> • <span class="google-badge"><i class="fa-brands fa-google"></i> Reseña de Google Maps</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <div class="review-text">"Llevé a mi hijo por problemas de amígdalas y rinitis. El doctor tiene una paciencia increíble y resolvió todas nuestras dudas. 100% recomendado."</div>
                <div class="reviewer-info">
                    <span>Claudia Milena R.</span> • <span class="google-badge"><i class="fa-brands fa-google"></i> Reseña de Google Maps</span>
                </div>
            </div>
        `;

        savedReviews.forEach(rev => {
            const safeName = escapeHTML(rev.name);
            const safeEmail = escapeHTML(rev.email);
            const safeComment = escapeHTML(rev.comment);

            html += `
                <div class="review-card">
                    <div class="review-stars">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <div class="review-text">"${safeComment}"</div>
                    <div class="reviewer-info">
                        <span>${safeName}</span> • <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verificado (${safeEmail})</span>
                    </div>
                </div>
            `;
        });

        reviewsContainer.innerHTML = html;
    }

    renderReviews();

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewerName').value.trim();
        const email = document.getElementById('reviewerEmail').value.trim();
        const comment = document.getElementById('reviewComment').value.trim();

        // Validación estricta de formato de correo Gmail
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido que termine en @gmail.com.');
            return;
        }

        if (name.length < 2 || comment.length < 5) {
            alert('Por favor, completa tu nombre y un comentario válido.');
            return;
        }

        // Guardar en LocalStorage
        const newReview = { name, email, comment, date: new Date().toISOString() };
        savedReviews.unshift(newReview);
        localStorage.setItem('doctor_torres_db_reviews', JSON.stringify(savedReviews));
        
        renderReviews();

        // Notificar por WhatsApp usando encodeURIComponent para evitar rotura de URL
        const telefonoWhatsApp = "573138740239"; 
        const textoPlano = `Hola Dr. Daniel, hay una nueva reseña en la web:\n\n*Nombre:* ${name}\n*Correo:* ${email}\n*Comentario:* "${comment}"`;
        const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(textoPlano)}`;
        
        window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');

        reviewForm.reset();
    });
});
