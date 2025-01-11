function buildHobbyCards() {
    const hobbyPhotos = [{
        "title": "Running",
        "src": ["img/matt/iron-horse.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Setting my half marathon PR at the Iron Horse Half Marathon"],
        "description": "Running is my main hobby and passion. I'm always training for something."
    }, {
        "title": "Travel",
        "src": ["img/matt/amsterdam.jpg", "img/matt/paris.jpg", "img/matt/madrid.jpg", "img/matt/sitka.jpg", "img/matt/cabo.jpg"],
        "alt": ["At the I AMsterdam sign in Amsterdam, Netherlands", "At the Eiffel Tower in Paris, France", "At Estadio Santiago Bernabeu in Madrid, Spain", "Sitka, Alaska", "Los Cabos, Mexico"],
        "description": "I love to travel and explore new places. Last Fall I took a solo trip to Europe and visited Amsterdam, Paris, and Brussells."
    }, {
        "title": "Sports",
        "src": ["img/matt/mariners.jpg", "img/matt/kraken.jpg", "img/matt/mls-cup.jpg", "img/matt/seahawks.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["At a Mariners game with my some friends", "At my first Kraken game", "At the 2019 MLS Cup Final", "First Seahawks game from College"],
        "description": "I love watching sports, especially baseball and soccer."
    }, {
        "title": "Concerts",
        "src": ["img/matt/olivia-concert.jpg", "img/matt/blink.png", "img/matt/sabrina.jpg", "img/matt/moda-center.jpg", "img/matt/olivia-tour.jpg", "img/matt/panic.jpg", "img/matt/ed-sheeran.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["At the Olivia Rodrigo concert", "Blink-182 Reunion Tour", "Sabrina Carpenter Short N Sweet Tour", "AJR at the Moda Center in PDX", "Outside with Olivia Rodrigo's tour bus", "Panic! at the Disco", "Ed Sheeran Concert"],
        "description": "I love experiencing music live."
    }, {
        "title": "Backpacking",
        "src": ["img/matt/pct-trail.jpg", "img/matt/enchantments.jpg", "img/matt/pct_snowfield.jpg", "img/matt/glacier.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Finishing a section of the PCT", "Last mile after weekend backpacking the Enchantments", "hiking through a snowfield", "Glacier National Park"],
        "description": "I've hiked over 600 miles on the PCT and have plans to finish the trail someday."
    }, {
        "title": "Crafting",
        "src": ["img/matt/halloween.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["My Haloween costume; a custom Orca Reader that *boops*"],
        "description": "Love some good old arts and crafts. I make t-shirts for myself, friends, and family throughout the year."
    }, {
        "title": "Groomsmaning",
        "src": ["img/matt/groomsman.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Groomsman at one of my best friend's wedding"],
        "description": "Guarenteed to always make for a great wedding date. These dance moves are killer."
    }, {
        "title": "Voting",
        "src": ["img/matt/i-voted.jpg", "img/matt/vote2020.jpg", "img/matt/ballot.jpg", "img/matt/ballot2.png"],
        "size": "cover",
        "position": "50%",
        "alt": ["Picture in front of the ballot box with my I voted sticker", "Voting in the 2020 election", "Filled out ballot for the 2024 election", "Filled out ballot for the 2020 election"],
        "description": "Vote blue, vote early, vote often. I have the receipts."
    }, {
        "title": "Motorcycles",
        "src": ["img/matt/motorcycle-serious.jpg", "img/matt/motorcycle-silly.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["On my motorcycle", "Sorority girl pose on my motorcycle"],
        "description": "Not the safest hobby but it's a blast and I look cool doing it. Always ride with full safety gear!"
    }, {
        "title": "Community",
        "src": ["img/matt/electric-cookie.jpg"],
        "size": "cover",
        "position": "25%",
        "alt": ["Dressed as an elf for a christmas 5K"],
        "description": "Never afraid to dress up and get silly for a good cause."
    }, {
        "title": "Transit",
        "src": ["img/matt/baby-train.jpg", "img/matt/transit-center.jpg", "img/matt/cascades.jpg", "img/matt/metro-paris.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Loved transit from a young age.", "In front of the new Link 2 Line opening", "Getting off the Amtrak Cascades train", "In the Paris Metro"],
        "description": "I'm a slut for public infrastruture projects and mass transit."
    }];

    var i = 0;
    const cardContainer = $('.hobby-cards');
    for (hobby of hobbyPhotos) {
        if (i == 2) {
            const nextBtn = $('<div>').addClass('hobby-load-more');
            nextBtn.append($('<i></i>').attr('data-feather', 'chevron-down').attr("alt", "load more"));
            cardContainer.append(nextBtn);
        }

        const card = $('<div></div>').addClass('card');
        if (i < 2) {
            card.addClass("show-card");
        }
        var images = [];
        for (let i = 0; i < hobby.src.length; i++) {
            const imgDiv = $('<div>').addClass('card-img-top').addClass('hobby-img')
                .css('background-image', 'url(' + hobby.src[i] + ')')
                .attr('alt', hobby.alt[i]).attr("image-index", i);
            if (hobby.size) imgDiv.css('background-size', hobby.size);
            if (hobby.position) imgDiv.css('background-position-y', hobby.position);
            images.push(imgDiv);
            const imgImg = $('<img>').addClass('card-img-top').addClass('hobby-img')
                .attr('src', hobby.src[i])
                .attr('alt', hobby.alt[i])
                .attr("image-index", i);
            if (hobby.size) imgImg.css('background-size', hobby.size);
            if (hobby.position) imgImg.css('background-position-y', hobby.position);
            images.push(imgImg);
        }

        const cardNavNext = $('<div></div>').addClass('next');
        cardNavNext.append($('<i></i>').attr('data-feather', 'chevron-right'));
        const cardExpand = $('<div></div>').addClass('expand');
        cardExpand.append($('<i></i>').attr('data-feather', 'maximize-2'));
        const cardShrink = $('<div></div>').addClass('shrink');
        cardShrink.append($('<i></i>').attr('data-feather', 'minimize-2'));
        const cardNavLast = $('<div></div>').addClass('last');
        cardNavLast.append($('<i></i>').attr('data-feather', 'chevron-left'));

        const cardBody = $('<div></div>').addClass('card-body');
        const cardTitle = $('<h5></h5>').addClass('card-title').text(hobby.title);
        const cardText = $('<p></p>').addClass('card-text').text(hobby.description);

        cardBody.append(cardTitle).append(cardText);
        for (img of images) {
            card.append(img);
        }
        if (images.length > 2) {
            card.append(cardNavNext);
        }
        card.append(cardBody).append(cardExpand).append(cardShrink);

        cardContainer.append(card);
        i++;
    }
    $('.hobby-load-more, .hobby-load-more i, .hobby-load-more svg').on('click', loadRemainingHobbies);
}

function expandHobbyImg(e) {
    const card = $(e.target).closest('.card');
    const divImages = card.find('div.hobby-img');
    const imgImages = card.find('img.hobby-img');
    const currentDiv = card.find('div.hobby-img:visible');
    const currentImg = card.find('img.hobby-img:visible');

    const expand = card.find('.expand');
    const shrink = card.find('.shrink');

    if (e.currentTarget.classList.contains('expand')) {
        var index = currentDiv.attr('image-index');
        console.log("expand: div -> img");
        expand.hide();
        shrink.show();
        currentDiv.hide();
        imgImages.eq(index).show();
    } else {
        var index = currentImg.attr('image-index');
        console.log("contract: img -> div");
        expand.show();
        shrink.hide();
        currentImg.hide();
        divImages.eq(index).show();
    }
}

function cardNavClick(e) {
    const card = $(e.target).closest('.card');
    const divImages = card.find('div.hobby-img');
    const imgImages = card.find('img.hobby-img');
    const currentDiv = card.find('div.hobby-img:visible');
    const currentImg = card.find('img.hobby-img:visible');
    const currentImgIndex = imgImages.index(currentImg);
    const currentDivIndex = divImages.index(currentDiv);

    if (e.currentTarget.classList.contains('next')) {
        const expand = card.find('.expand');
        if (expand.is(":visible")) {
            const nextIndex = currentDivIndex + 1;
            if (nextIndex >= divImages.length) {
                divImages.hide();
                divImages.first().show();
            } else {
                currentDiv.hide();
                divImages.eq(nextIndex).show();
            }
        } else {
            const nextIndex = currentImgIndex + 1;
            if (nextIndex >= imgImages.length) {
                imgImages.hide();
                imgImages.first().show();
            } else {
                currentImg.hide();
                imgImages.eq(nextIndex).show();
            }
        }
    }
}

function loadRemainingHobbies() {
    $(".hobby-cards .card").addClass("show-card");
    $(".hobby-cards").css("max-height", "3000px");
    $(".hobby-cards .hobby-load-more").hide();
}