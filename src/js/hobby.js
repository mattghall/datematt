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
        "src": ["img/matt/amsterdam.jpg", "img/matt/paris.jpg"],
        "alt": ["At the I AMsterdam sign in Amsterdam, Netherlands", "At the Eiffel Tower in Paris, France"],
        "description": "I love to travel and explore new places. Last Fall I took a solo trip to Europe and visited Amsterdam, Paris, and Brussells."
    }, {
        "title": "Sports",
        "src": ["img/matt/mariners.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["At a Mariners game with my some friends"],
        "description": "I love watching sports, especially baseball and soccer."
    }, {
        "title": "Concerts",
        "src": ["img/matt/moda-center.jpg", "img/matt/olivia-concert.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["At a concert at the Moda Center", "At an Olivia Rodrigo concert"],
        "description": "Always make for a great wedding date."
    }, {
        "title": "Backpacking",
        "src": ["img/matt/pct-trail.jpg", "img/matt/pct_snowfield.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Finishing a section of the PCT", "hiking through a snowfield"],
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
        "src": ["img/matt/i-voted.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["Picture in front of the ballot box with my I voted sticker"],
        "description": "Vote blue, vote early, vote often."
    }, {
        "title": "Motorcycles",
        "src": ["img/matt/motorcycle-serious.jpg", "img/matt/motorcycle-silly.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["On my motorcycle", "Sorority girl pose on my motorcycle"],
        "description": "Can't keep me off two wheels. Not the safest hobby but it's a blast and I look cool doing it."
    }, {
        "title": "Community",
        "src": ["img/matt/electric-cookie.jpg"],
        "size": "cover",
        "position": "25%",
        "alt": ["Dressed as an elf for a christmas 5K"],
        "description": "Never afraid to dress up and get silly for a good cause."
    }, {
        "title": "Transit Fangirling",
        "src": ["img/matt/transit-center.jpg", "img/matt/cascades.jpg"],
        "size": "cover",
        "position": "50%",
        "alt": ["In front of the new Link 2 Line opening", "Getting off the Amtrak Cascades train"],
        "description": "I'm a slut for public infrastruture projects and mass transit."
    }];

    for (hobby of hobbyPhotos) {
        const cardContainer = $('.hobby-cards');

        const card = $('<div></div>').addClass('card');
        var images = [];
        for (let i = 0; i < hobby.src.length; i++) {
            const img = $('<div>').addClass('card-img-top').addClass('hobby-img')
                .css('background-image', 'url(' + hobby.src[i] + ')')
                .attr('alt', hobby.alt[i]);
            if (hobby.size) img.css('background-size', hobby.size);
            if (hobby.position) img.css('background-position-y', hobby.position);
            images.push(img);
        }

        const cardNavNext = $('<div></div>').addClass('next');
        cardNavNext.append($('<i></i>').attr('data-feather', 'chevron-right'));
        const cardNavLast = $('<div></div>').addClass('last');
        cardNavLast.append($('<i></i>').attr('data-feather', 'chevron-left'));

        const cardBody = $('<div></div>').addClass('card-body');
        const cardTitle = $('<h5></h5>').addClass('card-title').text(hobby.title);
        const cardText = $('<p></p>').addClass('card-text').text(hobby.description);

        cardBody.append(cardTitle).append(cardText);
        for (img of images) {
            card.append(img);
        }
        if (images.length > 1) card.append(cardNavNext);
        card.append(cardBody);

        cardContainer.append(card);
    }
}

function cardNavClick(e) {
    const card = $(e.target).closest('.card');
    const images = card.find('.hobby-img');
    const next = card.find('.next');
    const last = card.find('.last');
    const current = card.find('.hobby-img:visible');
    const currentIndex = images.index(current);
    const nextIndex = currentIndex + 1;
    const lastIndex = currentIndex - 1;

    if (e.currentTarget.classList.contains('next')) {
        if (nextIndex >= images.length) {
            images.hide();
            images.first().show();
        } else {
            current.hide();
            images.eq(nextIndex).show();
        }
    }
}