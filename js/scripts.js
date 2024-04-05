$(document).ready(function () {
    console.log('DOM is ready');

    $('form#add-review-form').submit(function (event) {
        event.preventDefault();

        const name = 'Anonymous';
        const rating = $(this).children('input#add-review-rating').val();
        const review = $(this).children('textarea#add-review-textarea').val();
        const date = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        localStorage.setItem('newReview', JSON.stringify({
            name: name,
            rating: rating,
            review: review,
            date: date
        }));

        const successMessage = $('<p class="review-added">Review Added!</p>');
        $(successMessage).appendTo($(this)).fadeOut('slow', function () {
            $(this).remove();
            window.location.href = 'reviews.html';
        });
    });

    const storedReview = localStorage.getItem('newReview');
    if (storedReview) {
        const review = JSON.parse(storedReview);
        review.rating = parseInt(review.rating).toFixed(1);
        console.log(review.rating);

        const reviewDiv = $('<div class="review"></div>');

        const reviewName = $('<h2 class="review-name">' + review.name + '</h2>');
        $(reviewName).appendTo(reviewDiv);

        const reviewStars = $('<div class="stars"></div>');
        const reviewRating = $('<h1>' + review.rating + '</h1>');
        const reviewStarsList = $('<ul></ul>');
        for (let i = 1; i <= 5; i++) {
            const star = $('<li></li>');
            if (i <= review.rating) {
                $(star).html('<i class="fas fa-star"></i>');
            } else {
                $(star).html('<i class="far fa-star"></i>');
            }
            $(star).appendTo(reviewStarsList);
        }
        $(reviewRating).appendTo(reviewStars);
        $(reviewStarsList).appendTo(reviewStars);
        $(reviewStars).appendTo(reviewDiv);

        const reviewDescription = $('<p class="review-description">' + review.review + '</p>');
        $(reviewDescription).appendTo(reviewDiv);

        const reviewDate = $('<p class="review-date">' + review.date + '</p>');
        $(reviewDate).appendTo(reviewDiv);

        reviewDiv.appendTo('div#reviews');
        localStorage.removeItem('newReview');

        const numberOfReviews = $('p.number-reviews');
        const newNumberOfReviews = parseInt($(numberOfReviews).text().split(' ')[0]) + 1;
        $(numberOfReviews).text(newNumberOfReviews + ' Reviews');

        let totalRating = 0;
        $('div#bottom-content div#reviews div.review').each(function () {
            const rating = parseInt($(this).find('div.stars h1').text());
            totalRating += rating;
        });
        const newRating = totalRating / newNumberOfReviews;
        const listingRating = $('div#top-content div.stars');
        $(listingRating).children('h1').text(newRating.toFixed(1));

        $(listingRating).children('ul').remove();
        const listingReviewStarList = $('<ul></ul>');
        for (let i = 1; i <= 5; i++) {
            const star = $('<li></li>');
            if (i <= newRating) {
                $(star).html('<i class="fas fa-star"></i>');
            } else {
                $(star).html('<i class="far fa-star"></i>');
            }
            $(star).appendTo($(listingReviewStarList));
        }
        $(listingReviewStarList).appendTo(listingRating);
    }

    // const links = document.querySelectorAll('div#bottom-content div#listings div.listing h2 a');
    // links.forEach(function (link) {
    //     link.addEventListener('click', function (event) {
    //         event.preventDefault();
    //         const listingName = $(this).text();
    //         const listingDiv = $(this).parent().parent();
    //         const listingImage = $(listingDiv).find('img').attr('src');
    //         const listingDescription = $(listingDiv).find('p').first().text();
    //         const listingPrice = $(listingDiv).find('p').last().text();
    //         const listingFeatures = $(listingDiv).find('ul').html();
    //         localStorage.setItem('listing', JSON.stringify({
    //             name: listingName,
    //             image: listingImage,
    //             description: listingDescription,
    //             price: listingPrice,
    //             features: listingFeatures
    //         }));
    //         window.location.href = 'reviews.html';
    //     });
    // });


    // const storedListing = localStorage.getItem('listing');
    // console.log(storedListing);
    // if (storedListing) {
    //     const listing = JSON.parse(storedListing);
    //     const topContent = $('div#top-content');
    //
    //     topContent.empty();
    //
    //     const listingName = $('<h2>' + listing.name + '</h2>');
    //     $(listingName).appendTo(topContent);
    //
    //     const listingAddress = $('<h5>123 Terrace Rd, Blacksburg, VA 23030</h5>');
    //     $(listingAddress).appendTo(topContent);
    //
    //     const listingStars = $('<div class="stars"></div>');
    //     const listingRating = $('<h1>3.8</h1>');
    //     const listingStarList = $('<ul></ul>');
    //     for (let i = 1; i <= 5; i++) {
    //         const star = $('<li></li>');
    //         if (i <= 3.8) {
    //             $(star).html('<i class="fas fa-star"></i>');
    //         } else {
    //             $(star).html('<i class="far fa-star"></i>');
    //         }
    //         $(star).appendTo(listingStarList);
    //     }
    //     $(listingRating).appendTo(listingStars);
    //     $(listingStarList).appendTo(listingStars);
    //     $(listingStars).appendTo(topContent);
    //
    //     const listingNumberReviews = $('<p class="number-reviews">6 Reviews</p>');
    //     $(listingNumberReviews).appendTo(topContent);
    //
    //     const listingImage = $('<img src="' + listing.image + '" alt="' + listing.name + '">');
    //     $(listingImage).appendTo(topContent);
    //
    //     const listingDescription = $('<p>' + listing.description + '</p>');
    //     $(listingDescription).appendTo(topContent);
    //
    //     const listingPrice = $('<p>' + listing.price + '</p>');
    //     $(listingPrice).appendTo(topContent);
    //
    //     const listingAmenities = $('<ul class="amenities">' + listing.features + '</ul>');
    //     $(listingAmenities).appendTo(topContent);
    //
    //     const addReviewButton = $('<button id="AddReview" onclick="location.href=\'addreview.html\'">Add Review</button>');
    //     $(addReviewButton).appendTo(topContent);
    //
    //     $(addReviewButton).click(function () {
    //         window.location.href = 'addreview.html';
    //     });
    //     localStorage.removeItem('listing');
    // }

});