$(document).ready(function () {
    console.log('DOM is ready');

    $('button#add-review').click(function (event) {
        event.preventDefault();

        // Hide the add-review button and the reviews
        $(this).hide();
        $('div#bottom-content h1').hide();
        $('div#bottom-content div.review').hide();

        // Add the form to the div#bottom-content
        const formHTML = `
            <form id="add-review-form" action="#" method="post">
                <h1>Add Review</h1>
                <label for="add-review-rating">Rating:</label><br>
                <input type="number" id="add-review-rating" name="add-review-rating" min="1" max="5" step="0.1" required><br>
                <br>
                <label for="add-review-textarea">Review:</label><br>
                <textarea id="add-review-textarea" name="add-review-textarea" required></textarea><br>
                <br>
                <input type="button" id="cancel-button" value="Cancel">
                <input id="add-review-submit-button" type="submit" value="Submit">
            </form>
        `;
        $('div#bottom-content').append(formHTML);

        // Add click event for the cancel button
        $('#cancel-button').click(function () {
            $('#add-review-form').remove();
            $('div#bottom-content h1').show();
            $('div#bottom-content div.review').show();
            $('button#add-review').show();
        });

        // Add submit event for the form
        $('#add-review-form').submit(function (event) {
            event.preventDefault();

            const name = 'Anonymous';
            const rating = (Math.round($(this).children('input#add-review-rating').val() * 10) / 10).toFixed(1);
            const review = $(this).children('textarea#add-review-textarea').val();
            const date = new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            // Append the new review to the reviews
            const reviewHTML = `
                <div class="review">
                    <h2 class="review-name">${name}</h2>
                    <div class="stars">
                        <h1>${rating}</h1>
                        <ul>
                            ${Array(5).fill().map((_, i) => `<li><i class='fa${i < rating ? 's' : 'r'} fa-star'></i></li>`).join('')}
                        </ul>
                    </div>
                    <p class="review-description">${review}</p>
                    <p class="review-date">${date}</p>
                </div>
            `;
            $('div#reviews').append(reviewHTML);

            // Remove the form and show the reviews and the add-review button
            $(this).remove();
            $('div#bottom-content h1').show();
            $('div#bottom-content div.review').show();
            $('button#add-review').show();

            // Count the number of reviews
            var reviewCount = $('div#bottom-content div.review').length;

            // Calculate the new average rating
            var totalRating = 0;
            $('div#bottom-content div.review').each(function () {
                totalRating += parseFloat($(this).find('div.stars h1').text());
            });
            var averageRating = totalRating / reviewCount;

            // Update the number of reviews and the average rating
            $('div#top-content p.number-reviews').text(reviewCount + ' Reviews');
            $('div#top-content div.stars h1').text(averageRating.toFixed(1));

            // Update the stars in div.stars ul
            var starsHTML = Array(5).fill().map((_, i) => `<li><i class='fa${i < Math.floor(averageRating) ? 's' : 'r'} fa-star'></i></li>`).join('');
            $('div#top-content div.stars ul').html(starsHTML);
        });
    });
});