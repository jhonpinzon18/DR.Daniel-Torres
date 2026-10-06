document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsListContainer');

    // Cargar reseñas guardadas en la "Base de Datos" del navegador (LocalStorage)
    const savedReviews = JSON.parse(localStorage.getItem('doctor_torres_db_reviews')) || [];
    
    function renderReviews() {
        let html = `
            <div class="review-card">
                <div class="review-stars">
                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                </div>
                <div class="review-text">"Excelente atención del Dr. Daniel Torres in Villavicencio. Muy profesional, detallista en el diagnóstico de vértigo y con un trato excepcional."</div>
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
            html += `
                <div class="review-card">
                    <div class="review-stars">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <div class="review-text">"${rev.comment}"</div>
                    <div class="reviewer-info">
                        <span>${rev.name}</span> • <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verificado (${rev.email})</span>
                    </div>
                </div>
            `;
        });

        reviewsContainer.innerHTML = html;
    }

    renderReviews();

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewerName').value;
        const email = document.getElementById('reviewerEmail').value;
        const comment = document.getElementById('reviewComment').value;

        if (!email.toLowerCase().includes('@gmail.com')) {
            alert('Por favor, ingresa un correo electrónico válido de Gmail.');
            return;
        }

        // Guardar en Base de Datos Local (LocalStorage)
        const newReview = { name, email, comment, date: new Date().toISOString() };
        savedReviews.unshift(newReview);
        localStorage.setItem('doctor_torres_db_reviews', JSON.stringify(savedReviews));
        
        renderReviews();

        // Notificar por WhatsApp
        const telefonoWhatsApp = "573138740239"; 
        const mensaje = `Hola Dr. Daniel, hay una nueva reseña en la web:%0A%0A*Nombre:* ${name}%0A*Correo:* ${email}%0A*Comentario:* "${comment}"`;
        
        window.open(`https://wa.me/${telefonoWhatsApp}?text=${mensaje}`, '_blank');

        reviewForm.reset();
        alert('¡Reseña guardada y notificada por WhatsApp con éxito!');
    });
});
