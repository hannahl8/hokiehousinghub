$(document).ready(function () {
    // add review button
    $('button#add-review').click(function (event) {
        event.preventDefault();
        $(this).hide();
        $('div#bottom-content h1').hide();
        $('div#bottom-content div.review').hide();
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
        $('#cancel-button').click(function () {
            $('#add-review-form').remove();
            $('div#bottom-content h1').show();
            $('div#bottom-content div.review').show();
            $('button#add-review').show();
        });
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
            $(this).remove();
            $('div#bottom-content h1').show();
            $('div#bottom-content div.review').show();
            $('button#add-review').show();
            var reviewCount = $('div#bottom-content div.review').length;
            var totalRating = 0;
            $('div#bottom-content div.review').each(function () {
                totalRating += parseFloat($(this).find('div.stars h1').text());
            });
            var averageRating = totalRating / reviewCount;
            $('div#top-content p.number-reviews').text(reviewCount + ' Reviews');
            $('div#top-content div.stars h1').text(averageRating.toFixed(1));
            var starsHTML = Array(5).fill().map((_, i) => `<li><i class='fa${i < Math.floor(averageRating) ? 's' : 'r'} fa-star'></i></li>`).join('');
            $('div#top-content div.stars ul').html(starsHTML);
        });
    });
    // filter form on campus
    $('form#filter-form-oncampus').submit(function (event) {
        event.preventDefault();
        var filterDormType = $('#dorm-type').val();
        var filterAirConditioning = $('#air-conditioning').is(':checked');
        var filterPrivateBathrooms = $('#private-bathrooms').is(':checked');
        $('div.listing').each(function () {
            var listingDormTypes = $(this).find('p').eq(0).text().split('|').map(function (dormType) {
                return dormType.trim();
            });
            var listingAirConditioning = $(this).find('ul li i.far.fa-snowflake').length > 0;
            var listingPrivateBathrooms = $(this).find('ul li i.fas.fa-shower').length > 0;
            if ((filterDormType !== 'all' && listingDormTypes.indexOf(filterDormType) === -1) ||
                (filterAirConditioning && !listingAirConditioning) ||
                (filterPrivateBathrooms && !listingPrivateBathrooms)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
    // filter form off campus
    $('form#filter-form-offcampus').submit(function (event) {
        event.preventDefault();
        var filterBedrooms = $('#bedrooms').val();
        var filterBathrooms = $('#bathrooms').val();
        var filterPrice = $('#price').val();
        var filterAirConditioning = $('#air-conditioning').is(':checked');
        var filterPool = $('#pool').is(':checked');
        $('div.listing').each(function () {
            // bedrooms
            var listingBedrooms = $(this).find('p').eq(0).text().split('|')[0].trim();
            var listingBedroomsArray = listingBedrooms.split(',').map(function (item) {
                return item.trim();
            });
            var listingBedroomsList = [];
            for (var i = 0; i < listingBedroomsArray.length; i++) {
                var bedroomNumber = listingBedroomsArray[i].split(' ')[0];
                if (!isNaN(bedroomNumber)) {
                    listingBedroomsList.push(Number(bedroomNumber));
                }
            }
            // bathrooms
            var listingBathrooms = $(this).find('p').eq(0).text().split('|')[1].trim();
            var listingBathroomsArray = listingBathrooms.split(',').map(function (item) {
                return item.trim();
            });
            var listingBathroomsList = [];
            for (var i = 0; i < listingBathroomsArray.length; i++) {
                var bathroomNumber = listingBathroomsArray[i].split(' ')[0];
                if (!isNaN(bathroomNumber)) {
                    listingBathroomsList.push(Number(bathroomNumber));
                }
            }
            // price
            var listingPrice = $(this).find('p').eq(1).text().split('/')[0].trim();
            var listingPriceArray = listingPrice.split('-').map(function (item) {
                return item.trim();
            });
            var listingPriceList = [];
            for (var i = 0; i < listingPriceArray.length; i++) {
                var priceNumber = Number(listingPriceArray[i].replace('$', '').replace(/,/g, ''));
                listingPriceList.push(priceNumber);
            }
            var listingAirConditioning = $(this).find('ul li i.far.fa-snowflake').length > 0;
            var listingPool = $(this).find('ul li i.fas.fa-swimming-pool').length > 0;
            var meetsCriteria = (
                (filterBedrooms === 'Any' || listingBedroomsList.includes(Number(filterBedrooms))) &&
                (filterBathrooms === 'Any' || listingBathroomsList.includes(Number(filterBathrooms))) &&
                (filterPrice === 'Any' || checkPriceFilter(filterPrice, listingPriceList)) &&
                (!filterAirConditioning || listingAirConditioning) &&
                (!filterPool || listingPool)
            );

            function checkPriceFilter(filterPrice, listingPriceList) {
                var maxPrice = Math.max(...listingPriceList);
                var minPrice = Math.min(...listingPriceList);
                filterPrice = Number(filterPrice);
                var filterMinPrice = filterPrice - 499;
                if (filterPrice === 3001) {
                    return maxPrice >= filterPrice;
                } else if (filterPrice === 500) {
                    return minPrice < filterPrice;
                } else {
                    return maxPrice >= filterMinPrice && minPrice <= filterPrice;
                }
            }

            if (!meetsCriteria) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
});